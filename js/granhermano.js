// Sección Gran Hermano: se edita en data/granhermano.json.
// - Números que cuentan hacia arriba al aparecer en pantalla.
// - Línea de tiempo vertical: una línea dorada se va "llenando" con el
//   scroll y enciende cada momento cuando lo alcanza.
// - Versus: placa "Yipio VS rival" con quién siguió y quién quedó afuera.
// - Videos cortos con visor de cámara (REC, CAM, timecode):
//     * en PC se reproducen al pasar el mouse por la tarjeta;
//     * en celular se reproducen solos al quedar en el centro de la pantalla.
//   En los dos casos también se pueden tocar para pausar/reproducir.
(function () {
  const statsWrap = document.getElementById('ghStats');
  const timeline = document.getElementById('ghTimeline');
  const subtitulo = document.getElementById('ghSubtitulo');
  const titulo = document.getElementById('ghTitulo');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hayIO = 'IntersectionObserver' in window;

  function formatear(valor, decimales) {
    return valor.toLocaleString('es-UY', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
  }

  function htmlStat(s) {
    if (s.texto) {
      return `
        <div class="gh-stat">
          <div class="gh-stat-valor gh-stat-valor--texto texto-oro">${s.texto}</div>
          <div class="gh-stat-etiqueta">${s.etiqueta || ''}</div>
        </div>`;
    }
    const dec = s.decimales || 0;
    return `
      <div class="gh-stat">
        <div class="gh-stat-valor texto-oro" data-valor="${s.valor}" data-decimales="${dec}"
          data-prefijo="${s.prefijo || ''}" data-sufijo="${s.sufijo || ''}">${s.prefijo || ''}${formatear(s.valor, dec)}${s.sufijo || ''}</div>
        <div class="gh-stat-etiqueta">${s.etiqueta || ''}</div>
      </div>`;
  }

  // Cuenta desde 0 hasta el valor final con una curva que frena al llegar.
  function contar(el, hasta, decimales, armar, duracion = 1800) {
    const inicio = performance.now();
    function paso(ahora) {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - t, 3);
      el.textContent = armar(formatear(hasta * suave, decimales));
      if (t < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  function htmlMedia(m) {
    if (m.video) {
      return `
        <div class="momento-media momento-media--video">
          <video src="${m.video}"${m.poster ? ` poster="${m.poster}"` : ''} muted loop playsinline preload="none"
            aria-label="${m.titulo}"></video>
          <div class="hud" aria-hidden="true">
            <span class="hud-rec"><i></i>REC</span>
            <span class="hud-cam">${m.camara || 'CAM'}</span>
            <span class="hud-tc">00:00:00:00</span>
          </div>
          <div class="momento-play" aria-hidden="true">
            <span>▶</span>
            <small>${conMouse ? 'Pasá el mouse' : 'Tocá para ver'}</small>
          </div>
        </div>`;
    }
    if (m.versus) {
      const v = m.versus;
      return `
        <div class="momento-versus" aria-hidden="true">
          <div class="vs-lado vs-lado--yipio">
            <span class="vs-nombre">Yipio</span>
            <span class="vs-estado">${v.resultadoYipio || 'Sigue'}</span>
          </div>
          <span class="vs-centro">VS</span>
          <div class="vs-lado vs-lado--rival">
            <span class="vs-nombre">${v.rival}</span>
            ${v.resultadoRival ? `<span class="vs-estado">${v.resultadoRival}</span>` : ''}
          </div>
        </div>`;
    }
    if (m.imagen) {
      return `<div class="momento-media"><img src="${m.imagen}" alt="${m.titulo}" loading="lazy"></div>`;
    }
    return `<div class="momento-placa" aria-hidden="true"><span>${m.placa || ''}</span></div>`;
  }

  function htmlMomento(m, lado) {
    const clases = ['momento', m.destacado ? 'momento--destacado' : `momento--${lado}`];
    return `
      <article class="${clases.join(' ')}">
        <span class="momento-nodo" aria-hidden="true"></span>
        <div class="momento-card">
          ${htmlMedia(m)}
          <div class="momento-cuerpo">
            <p class="momento-etiqueta">${m.etiqueta || ''}</p>
            <h3 class="momento-titulo">${m.titulo || ''}</h3>
            ${m.texto ? `<p class="momento-texto">${m.texto}</p>` : ''}
            ${m.votos ? `
              <div class="votometro" data-votos="${m.votos}">
                <div class="votometro-fila"><span>Yipio</span><span class="votometro-num">0%</span></div>
                <div class="votometro-barra"><div class="votometro-relleno"></div></div>
              </div>` : ''}
            ${m.frase ? `<blockquote class="momento-frase">“${m.frase}”<cite>Yipio</cite></blockquote>` : ''}
          </div>
        </div>
      </article>`;
  }

  // ---------- Videos ----------
  function timecode(segundos) {
    const total = Math.floor(segundos);
    const cuadros = Math.floor((segundos % 1) * 30);
    const dos = (n) => String(n).padStart(2, '0');
    return `00:${dos(Math.floor(total / 60))}:${dos(total % 60)}:${dos(cuadros)}`;
  }

  function prepararVideo(media) {
    const video = media.querySelector('video');
    const tc = media.querySelector('.hud-tc');
    const card = media.closest('.momento-card');
    let raf = null;

    function tick() {
      tc.textContent = timecode(video.currentTime);
      raf = requestAnimationFrame(tick);
    }

    video.addEventListener('playing', () => {
      media.classList.add('reproduciendo');
      cancelAnimationFrame(raf);
      tick();
    });
    video.addEventListener('pause', () => {
      media.classList.remove('reproduciendo');
      cancelAnimationFrame(raf);
    });

    const play = () => video.play().catch(() => {});
    const pausa = () => video.pause();

    if (conMouse) {
      card.addEventListener('mouseenter', play);
      card.addEventListener('mouseleave', pausa);
    }
    media.addEventListener('click', () => (video.paused ? play() : pausa()));

    return { video, play, pausa };
  }

  function activarVideos() {
    const medias = [...timeline.querySelectorAll('.momento-media--video')];
    const controles = medias.map(prepararVideo);

    // En celular (sin mouse) se reproduce solo el que queda en el centro.
    if (!conMouse && !reduceMotion && hayIO) {
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            const c = controles[medias.indexOf(entrada.target)];
            if (entrada.isIntersecting) c.play();
            else c.pausa();
          });
        },
        { rootMargin: '-30% 0px -30% 0px', threshold: 0.35 }
      );
      medias.forEach((m) => observador.observe(m));
    }
  }

  // ---------- Línea de progreso y momentos que se encienden ----------
  function activarScroll() {
    const linea = document.createElement('div');
    linea.className = 'timeline-linea';
    linea.innerHTML = '<div class="timeline-progreso"></div>';
    timeline.prepend(linea);
    const progreso = linea.firstElementChild;
    const momentos = [...timeline.querySelectorAll('.momento')];
    let pendiente = false;

    function actualizar() {
      pendiente = false;
      const rect = timeline.getBoundingClientRect();
      // La punta de la línea va a 60% de la altura de la pantalla.
      const punta = window.innerHeight * 0.6 - rect.top;
      const alto = Math.max(0, Math.min(punta, rect.height));
      progreso.style.height = `${alto}px`;
      momentos.forEach((m) => {
        const nodo = m.querySelector('.momento-nodo');
        const yNodo = nodo.getBoundingClientRect().top - rect.top + nodo.offsetHeight / 2;
        m.classList.toggle('activo', alto >= yNodo);
      });
    }

    function pedirActualizacion() {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    }

    window.addEventListener('scroll', pedirActualizacion, { passive: true });
    window.addEventListener('resize', pedirActualizacion);
    actualizar();
  }

  function activarEntradas() {
    if (reduceMotion || !hayIO) {
      timeline.querySelectorAll('.momento').forEach((m) => m.classList.add('visto'));
      return;
    }
    timeline.classList.add('timeline--animada');
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add('visto');
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.2 }
    );
    timeline.querySelectorAll('.momento').forEach((m) => observador.observe(m));
  }

  // Números y barra de votos: arrancan cuando aparecen en pantalla.
  function alAparecer(elementos, accion) {
    if (!hayIO || reduceMotion) {
      elementos.forEach((el) => accion(el, true));
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          accion(entrada.target, false);
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.5 }
    );
    elementos.forEach((el) => observador.observe(el));
  }

  function activarNumeros() {
    alAparecer([...statsWrap.querySelectorAll('[data-valor]')], (el, directo) => {
      if (directo) return;
      const { valor, decimales, prefijo, sufijo } = el.dataset;
      contar(el, Number(valor), Number(decimales), (n) => `${prefijo}${n}${sufijo}`);
    });

    alAparecer([...timeline.querySelectorAll('.votometro')], (el, directo) => {
      const votos = Number(el.dataset.votos);
      const num = el.querySelector('.votometro-num');
      el.querySelector('.votometro-relleno').style.width = `${votos}%`;
      if (directo) num.textContent = `${formatear(votos, 1)}%`;
      else contar(num, votos, 1, (n) => `${n}%`, 2400);
    });
  }

  fetch('data/granhermano.json')
    .then((r) => r.json())
    .then((data) => {
      if (data.titulo) titulo.textContent = data.titulo;
      subtitulo.textContent = data.subtitulo || '';
      statsWrap.innerHTML = (data.stats || []).map(htmlStat).join('');
      if (!statsWrap.innerHTML) statsWrap.remove();

      // Los momentos alternan izquierda/derecha; el destacado va al centro
      // y no cuenta para la alternancia.
      let lado = 0;
      timeline.innerHTML = (data.momentos || [])
        .map((m) => (m.destacado ? htmlMomento(m) : htmlMomento(m, lado++ % 2 ? 'der' : 'izq')))
        .join('');

      activarEntradas();
      activarScroll();
      activarVideos();
      activarNumeros();
    })
    .catch(() => {
      timeline.innerHTML = '<p class="loading">No se pudo cargar esta sección.</p>';
    });
})();
