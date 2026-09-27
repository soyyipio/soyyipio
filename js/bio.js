// Biografía: se edita en data/bio.json, no hace falta tocar el HTML.
(function () {
  const wrap = document.getElementById('bioContent');

  fetch('data/bio.json')
    .then((r) => r.json())
    .then((bio) => {
      const parrafos = (bio.texto || []).map((p) => `<p>${p}</p>`).join('');
      const chips = (bio.destacados || []).map((c) => `<span class="chip">✦ ${c}</span>`).join('');

      wrap.innerHTML = `
        ${bio.foto ? `
        <div class="bio-foto">
          <div class="bio-marco"><img src="${bio.foto}" alt="${bio.nombre || 'Foto'}" onerror="this.closest('.bio-foto').remove()"></div>
          <span class="bio-placa">${(bio.nombre || '').toUpperCase()}</span>
        </div>` : ''}
        <div class="bio-cuerpo">
          ${bio.nombreCompleto ? `<p class="bio-nombre">${bio.nombreCompleto}</p>` : ''}
          ${chips ? `<div class="bio-chips">${chips}</div>` : ''}
          <div class="bio-texto">${parrafos}</div>
          ${bio.frase ? `<blockquote class="bio-frase">${bio.frase}<cite>${bio.nombre || ''}</cite></blockquote>` : ''}
        </div>`;
    })
    .catch(() => {
      wrap.innerHTML = '<p class="loading">No se pudo cargar la biografía.</p>';
    });
})();
