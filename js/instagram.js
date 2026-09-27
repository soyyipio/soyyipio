// Instagram: tarjeta de perfil + publicaciones destacadas.
// El usuario sale del link de Instagram en data/config.json (redes.instagram)
// y las publicaciones de data/instagram.json. Instagram no deja leer el feed
// sin una API con token, así que las publicaciones se eligen a mano:
//   - con "imagen": se arma una tarjeta propia con la estética del sitio;
//   - sin "imagen": se usa el embed oficial de Instagram.
// Si no hay link de Instagram, la sección y su link del menú se ocultan.
(function () {
  const Y = window.YIPIO;
  const seccion = document.getElementById('instagram');
  const perfilWrap = document.getElementById('igPerfil');
  const grid = document.getElementById('igGrid');
  const masWrap = document.getElementById('igMas');

  function ocultarSeccion() {
    seccion.remove();
    document.querySelectorAll('a[href="#instagram"]').forEach((a) => a.remove());
  }

  function tarjeta(p) {
    const esReel = p.tipo === 'reel';
    return `
      <a class="ig-card" href="${p.url}" target="_blank" rel="noopener" aria-label="${p.texto || 'Ver en Instagram'}">
        <img src="${p.imagen}" alt="${p.texto || 'Publicación de Instagram'}" loading="lazy">
        ${esReel ? '<span class="ig-card-tipo" aria-hidden="true">▶</span>' : ''}
        <span class="ig-card-pie">${Y.ICONOS.instagram}${p.texto || ''}</span>
      </a>`;
  }

  function embed(p) {
    return `
      <div class="ig-embed">
        <blockquote class="instagram-media" data-instgrm-permalink="${p.url}" data-instgrm-version="14"></blockquote>
      </div>`;
  }

  function cargarEmbeds() {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(script);
  }

  Promise.all([
    Y.cargarJSON('data/config.json'),
    Y.cargarJSON('data/instagram.json').catch(() => ({})),
    Y.cargarJSON('data/bio.json').catch(() => ({})),
  ])
    .then(([config, data, bio]) => {
      const url = config.redes && config.redes.instagram;
      const usuario = Y.usuarioInstagram(url || '');
      if (!usuario) {
        ocultarSeccion();
        return;
      }

      const perfil = data.perfil || {};
      const avatar = perfil.avatar || bio.foto;
      perfilWrap.innerHTML = `
        ${avatar ? `<div class="ig-avatar"><img src="${avatar}" alt="@${usuario}"></div>` : ''}
        <div class="ig-datos">
          <p class="ig-usuario texto-oro">@${usuario}</p>
          ${perfil.nombre ? `<p class="ig-nombre">${perfil.nombre}</p>` : ''}
          ${perfil.texto ? `<p class="ig-texto">${perfil.texto}</p>` : ''}
        </div>
        <a class="btn btn-oro" href="${url}" target="_blank" rel="noopener">${Y.ICONOS.instagram}Seguir</a>`;
      perfilWrap.hidden = false;

      const publicaciones = (data.publicaciones || []).filter((p) => p.url);
      grid.innerHTML = publicaciones.map((p) => (p.imagen ? tarjeta(p) : embed(p))).join('');
      if (!publicaciones.length) grid.remove();
      if (publicaciones.some((p) => !p.imagen)) cargarEmbeds();

      masWrap.innerHTML = `<a class="btn btn-linea" href="${url}" target="_blank" rel="noopener">Ver más en Instagram</a>`;
    })
    .catch(ocultarSeccion);
})();
