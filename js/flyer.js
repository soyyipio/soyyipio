// Flyers: el lienzo tiene resolución fija (data-ancho x data-alto) y se
// escala entero para entrar en la ventana, así siempre se ve igual.
// Con ?real en la URL se muestra a tamaño real (1 píxel = 1 píxel),
// útil para capturar o grabar la pantalla en la resolución exacta.
(function () {
  const lienzo = document.getElementById('lienzo');
  const ancho = Number(lienzo.dataset.ancho);
  const alto = Number(lienzo.dataset.alto);
  const real = new URLSearchParams(location.search).has('real');

  if (real) {
    document.body.classList.add('escala-real');
    return;
  }

  function ajustar() {
    const escala = Math.min(window.innerWidth / ancho, window.innerHeight / alto);
    lienzo.style.transform = `translate(-50%, -50%) scale(${escala})`;
  }

  window.addEventListener('resize', ajustar);
  ajustar();
})();
