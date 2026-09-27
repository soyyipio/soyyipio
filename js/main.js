// Menú móvil, navbar que se oscurece al scrollear, año del footer,
// animaciones de aparición y resaltado de la sección activa en el navbar.
(function () {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  function abrirMenu(abrir) {
    links.classList.toggle('open', abrir);
    navbar.classList.toggle('menu-abierto', abrir);
    toggle.setAttribute('aria-expanded', String(abrir));
    toggle.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = abrir ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => abrirMenu(!links.classList.contains('open')));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => abrirMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) abrirMenu(false);
  });

  // Navbar transparente arriba de todo, con fondo al bajar. Las páginas
  // que ya lo traen con fondo desde el HTML (evento.html) lo dejan fijo.
  const siempreConFondo = navbar.classList.contains('scrolled');
  function marcarScroll() {
    navbar.classList.toggle('scrolled', siempreConFondo || window.scrollY > 40);
  }
  window.addEventListener('scroll', marcarScroll, { passive: true });
  marcarScroll();

  document.getElementById('anioActual').textContent = new Date().getFullYear();

  // --- Aparición suave de las secciones al entrar en pantalla ---
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const secciones = document.querySelectorAll('.section');

  if (!reduceMotion && 'IntersectionObserver' in window) {
    secciones.forEach((s) => s.classList.add('reveal'));
    const revelador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            revelador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    secciones.forEach((s) => revelador.observe(s));
  }

  // --- Resaltado del link del navbar según la sección visible ---
  const navLinks = [...links.querySelectorAll('a[href^="#"]')];
  const porId = {};
  navLinks.forEach((a) => { porId[a.getAttribute('href').slice(1)] = a; });

  if ('IntersectionObserver' in window && navLinks.length) {
    const activador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          navLinks.forEach((a) => a.classList.remove('activo'));
          const link = porId[entrada.target.id];
          if (link) link.classList.add('activo');
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    Object.keys(porId).forEach((id) => {
      const seccion = document.getElementById(id);
      if (seccion) activador.observe(seccion);
    });
  }
})();
