(function startRainEffect() {
  const canvas = document.getElementById("rain"); // ID actualizado
  if (!canvas || canvas.dataset.active === "true") {
    console.log("Rain effect: Canvas no encontrado o ya activo.");
    return; // Salir si el canvas no está o ya tiene un efecto activo (manejado por main.js)
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Rain effect: No se pudo obtener el contexto 2D.");
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let drops = [];
  const maxDrops = 300; // Mantener un número razonable

  function initRain() {
    drops = [];
    for (let i = 0; i < maxDrops; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        l: Math.random() * 15 + 5, // Longitud de gota
        xs: Math.random() * 1 - 0.5, // Ligero movimiento horizontal
        ys: Math.random() * 8 + 12   // Velocidad vertical
      });
    }
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)"; // Ligeramente más visible
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.xs, d.y + d.l);
    }
    ctx.stroke();
    updateRain();

    // Guarda el ID de la animación en el estado global para poder cancelarlo
    appState.activeAnimationIds.weather = requestAnimationFrame(drawRain);
  }

  function updateRain() {
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.x += d.xs;
      d.y += d.ys;
      // Si la gota sale por abajo o por los lados, reaparece arriba
      if (d.y > canvas.height) {
        d.x = Math.random() * canvas.width;
        d.y = -d.l - 10; // Empieza justo encima del canvas
      }
      if (d.x > canvas.width + d.l || d.x < -d.l) {
         d.x = Math.random() * canvas.width;
         d.y = -d.l - 10;
      }
    }
  }

  function onResize() {
    // Cancela la animación anterior antes de redimensionar para evitar solapamientos
     if (appState.activeAnimationIds.weather) {
          cancelAnimationFrame(appState.activeAnimationIds.weather);
          appState.activeAnimationIds.weather = null;
     }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initRain();
    // Reinicia la animación
    appState.activeAnimationIds.weather = requestAnimationFrame(drawRain);
  }

  // --- Inicio del efecto ---
  console.log("Iniciando efecto lluvia...");
  initRain();
  // Inicia el bucle de animación
  // main.js ya hace visible el canvas y le aplica fade-in
  canvas.dataset.active = "true"; // Marca como activo
  appState.activeAnimationIds.weather = requestAnimationFrame(drawRain);

  window.addEventListener("resize", onResize);

   // Cleanup: main.js se encarga de cancelar la animación y quitar el listener si se carga otro efecto.
   // Pero podemos añadir un listener de seguridad si el script se elimina directamente.
   // (Aunque la gestión centralizada en main.js es preferible)
   // const observer = new MutationObserver((mutationsList, observer) => {
   //   for(const mutation of mutationsList) {
   //     if (mutation.removedNodes) {
   //       mutation.removedNodes.forEach(node => {
   //         if (node === canvas.parentNode?.script) { // Comprobar si este script fue eliminado
   //              console.log("Limpiando efecto lluvia por eliminación de script.");
   //              if (appState.activeAnimationIds.weather) cancelAnimationFrame(appState.activeAnimationIds.weather);
   //              window.removeEventListener("resize", onResize);
   //              observer.disconnect();
   //         }
   //       });
   //     }
   //   }
   // });
   // if (canvas.parentNode) observer.observe(canvas.parentNode, { childList: true });


})();