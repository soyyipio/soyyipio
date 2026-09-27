// Cintas de texto que se cruzan debajo de la portada (una dorada y una
// púrpura en sentido contrario). Se editan en data/marquee.json.
(function () {
  const tracks = [
    document.getElementById('marqueeTrack'),
    document.getElementById('marqueeTrack2'),
  ].filter(Boolean);

  fetch('data/marquee.json')
    .then((r) => r.json())
    .then((data) => {
      const items = data.items || [];
      if (!items.length) {
        document.querySelector('.cintas')?.remove();
        return;
      }
      const sep = data.separador || '•';
      // Se repite el texto hasta que alcance para cubrir pantallas anchas,
      // y después se duplica todo para que el loop sea continuo.
      const base = items.join(` ${sep} `) + ` ${sep} `;
      let texto = base;
      while (texto.length < 220) texto += base;

      tracks.forEach((track) => {
        track.innerHTML = `<span>${texto}</span><span>${texto}</span>`;
        // La animación se activa recién ahora que el texto real ya está
        // insertado, para que su "reloj" no arranque contra un ancho vacío.
        requestAnimationFrame(() => track.classList.add('listo'));
      });
    })
    .catch(() => {});
})();
