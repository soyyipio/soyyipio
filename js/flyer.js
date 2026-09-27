// Flyers: el lienzo tiene resolución fija (data-ancho x data-alto) y se
// escala entero para entrar en la ventana, así siempre se ve igual.
// Con data-rotar="90" el lienzo se gira 90° en sentido horario (flyer-vert-90:
// el diseño vertical ocupando una pantalla horizontal de 1920x1080).
// Con ?real en la URL se muestra a tamaño real (1 píxel = 1 píxel),
// útil para capturar o grabar la pantalla en la resolución exacta.
(function () {
  const lienzo = document.getElementById('lienzo');
  const ancho = Number(lienzo.dataset.ancho);
  const alto = Number(lienzo.dataset.alto);
  const rotar = Number(lienzo.dataset.rotar) || 0;
  const girado = rotar % 180 !== 0;
  // Tamaño que ocupa en pantalla (con el giro, ancho y alto se invierten)
  const anchoFinal = girado ? alto : ancho;
  const altoFinal = girado ? ancho : alto;
  const real = new URLSearchParams(location.search).has('real');

  function aplicar(escala) {
    lienzo.style.transform = `translate(-50%, -50%) rotate(${rotar}deg) scale(${escala})`;
  }

  if (real) {
    document.body.classList.add('escala-real');
    if (girado) {
      // A tamaño real y girado: el body toma la medida final y el lienzo
      // se centra y rota adentro.
      document.body.style.position = 'relative';
      document.body.style.width = `${anchoFinal}px`;
      document.body.style.height = `${altoFinal}px`;
      lienzo.style.top = '50%';
      lienzo.style.left = '50%';
      aplicar(1);
    }
    return;
  }

  function ajustar() {
    aplicar(Math.min(window.innerWidth / anchoFinal, window.innerHeight / altoFinal));
  }

  window.addEventListener('resize', ajustar);
  ajustar();
})();
