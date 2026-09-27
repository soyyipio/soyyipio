// Fotos sin fondo del escenario (portada y flyers): se detectan solas en
// img/escenario/ por número, sin tocar el HTML.
//   1 = foto del centro, 2 = izquierda, 3 = derecha.
// Sirven .webp o .png (si hay de los dos, gana el .webp).
// Cada <img data-foto="N"> toma su archivo; la carpeta sale de
// data-carpeta del contenedor (en los flyers es ../img/escenario/).
// La animación de entrada arranca recién cuando la imagen terminó de cargar.
(function () {
  const Y = window.YIPIO;
  const EXTENSIONES = ['webp', 'png'];

  document.querySelectorAll('[data-carpeta]').forEach((contenedor) => {
    const carpeta = contenedor.dataset.carpeta;
    contenedor.querySelectorAll('img[data-foto]').forEach(async (img) => {
      const ruta = await Y.buscarConExtensiones(`${carpeta}${img.dataset.foto}`, EXTENSIONES);
      if (!ruta) {
        img.remove();
        return;
      }
      img.addEventListener('load', () => img.classList.add('cargada'), { once: true });
      img.src = ruta;
    });
  });
})();
