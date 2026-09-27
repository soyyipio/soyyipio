// Utilidades compartidas por todos los scripts del sitio: fechas, archivos,
// banderas, cuenta regresiva e íconos de redes. Quedan en window.YIPIO.
(function () {
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MESES_LARGO = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const BANDERAS = {
    UY: `<svg class="bandera" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-label="Uruguay">
      <rect width="30" height="20" fill="#fff"/>
      <rect y="2.2" width="30" height="2.2" fill="#0038a8"/>
      <rect y="6.6" width="30" height="2.2" fill="#0038a8"/>
      <rect y="11" width="30" height="2.2" fill="#0038a8"/>
      <rect y="15.4" width="30" height="2.2" fill="#0038a8"/>
      <rect width="11" height="11" fill="#fff"/>
      <circle cx="5.5" cy="5.5" r="3" fill="#fcd116"/>
    </svg>`,
    AR: `<svg class="bandera" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-label="Argentina">
      <rect width="30" height="20" fill="#fff"/>
      <rect width="30" height="6.66" fill="#75aadb"/>
      <rect y="13.33" width="30" height="6.67" fill="#75aadb"/>
      <circle cx="15" cy="10" r="2.6" fill="#fcbf49"/>
    </svg>`,
  };

  const ICONOS = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14 2c-3.4 0-4.1 2.5-4.1 4.1v2.4H7.5v3.8h2.4V22h4.1v-9.7h3.2l.4-3.8z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  };

  const NOMBRES_REDES = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    facebook: 'Facebook',
    x: 'X',
  };

  // Convierte un emoji de bandera (ej: 🇺🇾) a su código de país (ej: "UY"),
  // así en el JSON se puede escribir el emoji o el código, da igual.
  function emojiACodigoPais(str) {
    if (!str) return str;
    const puntos = Array.from(str);
    if (puntos.length === 2) {
      const letras = puntos.map((p) => {
        const codigo = p.codePointAt(0) - 0x1f1e6;
        if (codigo < 0 || codigo > 25) return null;
        return String.fromCharCode(65 + codigo);
      });
      if (letras[0] && letras[1]) return letras.join('');
    }
    return str.toUpperCase();
  }

  function bandera(pais) {
    return BANDERAS[emojiACodigoPais(pais)] || '';
  }

  // Fecha de hoy según el reloj local, no UTC: con toISOString(), después de
  // las 21 hs de Uruguay ya es "mañana" en UTC y el show de esa misma noche
  // desaparecía de la lista antes de empezar.
  function hoyISO() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-');
  }

  function partes(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return { y, m, d };
  }

  // new Date(y, m-1, d) usa componentes locales: si se parseara el string ISO
  // directo, en husos horarios negativos (UY/AR) el día se corre uno para atrás.
  function diaSemana(iso) {
    const { y, m, d } = partes(iso);
    return DIAS[new Date(y, m - 1, d).getDay()];
  }

  function fechaLarga(iso) {
    const { m, d } = partes(iso);
    return `${diaSemana(iso)} ${d} de ${MESES_LARGO[m - 1]}`;
  }

  // Momento exacto en que arranca la función. Uruguay y Argentina están en
  // UTC-3 todo el año, así que la cuenta regresiva es la misma para los dos.
  function inicioFuncion(evento) {
    return new Date(`${evento.fecha}T${evento.hora || '21:00'}:00-03:00`);
  }

  function slug(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function cargarJSON(ruta) {
    return fetch(ruta).then((r) => {
      if (!r.ok) throw new Error(`No se pudo cargar ${ruta}`);
      return r.json();
    });
  }

  async function existeArchivo(ruta, reintentos = 2) {
    try {
      // HEAD da una respuesta HTTP real: 404 = no existe (definitivo),
      // en vez de Image() que confunde fallas de red pasajeras con "no existe".
      const res = await fetch(ruta, { method: 'HEAD', cache: 'no-store' });
      return res.ok;
    } catch (err) {
      // Esto sí es un error de red genuino (no un 404), vale la pena reintentar.
      if (reintentos > 0) {
        await new Promise((r) => setTimeout(r, 400));
        return existeArchivo(ruta, reintentos - 1);
      }
      return false;
    }
  }

  // Prueba "base.ext" con todas las extensiones en paralelo (no una por una)
  // y devuelve la primera que exista, o null.
  async function buscarConExtensiones(base, extensiones) {
    const candidatos = extensiones.map((ext) => `${base}.${ext}`);
    const resultados = await Promise.all(
      candidatos.map(async (ruta) => ((await existeArchivo(ruta)) ? ruta : null))
    );
    return resultados.find(Boolean) || null;
  }

  // Mientras config.json tenga sendsToLandingPage:true, el botón de entradas
  // manda a la landing (evento.html) en vez de a la tiquetera real.
  function usaLanding(config) {
    return config && config.sendsToLandingPage === true;
  }

  function linkEntradas(evento, config) {
    return usaLanding(config) ? `evento.html?id=${encodeURIComponent(evento.id)}` : evento.link;
  }

  function atributosLink(config) {
    return usaLanding(config) ? '' : ' target="_blank" rel="noopener"';
  }

  function textoDestacado(evento) {
    if (!evento.destacado) return '';
    return typeof evento.destacado === 'string' ? evento.destacado : 'Función especial';
  }

  // Badges de estado de una función: destacado, últimas entradas, agotado.
  function badges(evento, { incluirAgotado = false } = {}) {
    const destacado = textoDestacado(evento);
    return [
      destacado && `<span class="badge badge--destacado">★ ${destacado}</span>`,
      evento.ultimas && !evento.agotado && '<span class="badge badge--ultimas">Últimas entradas</span>',
      incluirAgotado && evento.agotado && '<span class="badge badge--agotado">Agotado</span>',
    ].filter(Boolean).join('');
  }

  // Cuenta regresiva en vivo dentro de "el" hasta la fecha "destino".
  function cuentaRegresiva(el, destino) {
    if (!el) return;
    const UNIDADES = [
      ['dias', 'Días'],
      ['horas', 'Horas'],
      ['min', 'Min'],
      ['seg', 'Seg'],
    ];
    el.innerHTML = UNIDADES.map(
      ([clave, etiqueta]) =>
        `<div class="cuenta-caja"><span class="cuenta-num" data-u="${clave}">00</span><span class="cuenta-lbl">${etiqueta}</span></div>`
    ).join('');
    const nums = {};
    el.querySelectorAll('[data-u]').forEach((n) => { nums[n.dataset.u] = n; });

    function actualizar() {
      const resta = destino - Date.now();
      if (resta <= 0) {
        clearInterval(timer);
        el.innerHTML = '<p class="cuenta-hoy">¡Es hoy!</p>';
        return;
      }
      const s = Math.floor(resta / 1000);
      const valores = {
        dias: Math.floor(s / 86400),
        horas: Math.floor((s % 86400) / 3600),
        min: Math.floor((s % 3600) / 60),
        seg: s % 60,
      };
      Object.keys(valores).forEach((k) => {
        nums[k].textContent = String(valores[k]).padStart(2, '0');
      });
    }
    const timer = setInterval(actualizar, 1000);
    actualizar();
  }

  function usuarioInstagram(url) {
    try {
      return new URL(url).pathname.split('/').filter(Boolean)[0] || '';
    } catch (err) {
      return '';
    }
  }

  window.YIPIO = {
    MESES,
    MESES_LARGO,
    DIAS,
    ICONOS,
    NOMBRES_REDES,
    bandera,
    hoyISO,
    partes,
    diaSemana,
    fechaLarga,
    inicioFuncion,
    slug,
    cargarJSON,
    existeArchivo,
    buscarConExtensiones,
    usaLanding,
    linkEntradas,
    atributosLink,
    textoDestacado,
    badges,
    cuentaRegresiva,
    usuarioInstagram,
  };
})();
