// Destellos dorados (y algunos lilas) que suben despacio detrás de todo el
// sitio, como polvo brillando bajo los reflectores. Se apaga con
// "reducir movimiento" y el navegador lo pausa solo si la pestaña no se ve.
// En los flyers el canvas trae data-ancho/data-alto: usa ese tamaño fijo
// (el lienzo del flyer se escala entero) en vez del de la ventana.
(function () {
  const canvas = document.getElementById('destellos');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext('2d');
  const fijo = canvas.dataset.ancho ? { ancho: +canvas.dataset.ancho, alto: +canvas.dataset.alto } : null;
  const CANTIDAD = fijo ? 90 : window.innerWidth < 700 ? 26 : 55;
  let ancho = 0;
  let alto = 0;
  let particulas = [];

  function medir() {
    const dpr = fijo ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    ancho = fijo ? fijo.ancho : window.innerWidth;
    alto = fijo ? fijo.alto : window.innerHeight;
    canvas.width = ancho * dpr;
    canvas.height = alto * dpr;
    canvas.style.width = `${ancho}px`;
    canvas.style.height = `${alto}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function nueva(enCualquierAltura) {
    return {
      x: Math.random() * ancho,
      y: enCualquierAltura ? Math.random() * alto : alto + 10,
      r: Math.random() * 1.5 + 0.4,
      vy: -(Math.random() * 0.25 + 0.06),
      vx: (Math.random() - 0.5) * 0.12,
      fase: Math.random() * Math.PI * 2,
      titileo: Math.random() * 0.025 + 0.008,
      dorada: Math.random() < 0.78,
    };
  }

  // Estrellita de cuatro puntas para los destellos más brillantes
  function estrella(x, y, largo, alpha) {
    ctx.strokeStyle = `rgba(255, 244, 214, ${alpha})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(x - largo, y);
    ctx.lineTo(x + largo, y);
    ctx.moveTo(x, y - largo);
    ctx.lineTo(x, y + largo);
    ctx.stroke();
  }

  function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);
    particulas.forEach((p, i) => {
      p.fase += p.titileo;
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10 || p.x < -10 || p.x > ancho + 10) particulas[i] = nueva(false);

      const brillo = 0.5 + 0.5 * Math.sin(p.fase);
      const alpha = 0.15 + 0.7 * brillo;
      ctx.fillStyle = p.dorada
        ? `rgba(255, 214, 120, ${alpha})`
        : `rgba(200, 160, 255, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      if (p.dorada && p.r > 1.3 && brillo > 0.9) estrella(p.x, p.y, p.r * 4, (brillo - 0.9) * 6);
    });
    requestAnimationFrame(dibujar);
  }

  medir();
  particulas = Array.from({ length: CANTIDAD }, () => nueva(true));
  requestAnimationFrame(dibujar);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(medir, 200);
  });
})();
