(function startStormEffect() {
  const canvas = document.getElementById("weather-canvas");
  if (!canvas || canvas.dataset.active === "true") {
      console.log("Storm effect: Canvas no encontrado o ya activo.");
      return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Storm effect: No se pudo obtener el contexto 2D.");
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let bolts = [];
  const maxBolts = 150;

  function initStorm() {
    bolts = [];
    for (let i = 0; i < maxBolts; i++) {
      bolts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        l: Math.random() * 25 + 15,
        xs: Math.random() * 1 - 0.5,
        ys: Math.random() * 10 + 15
      });
    }
    iniciarRayosAleatorios();
  }

  function drawStorm() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < bolts.length; i++) {
      const b = bolts[i];
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x + b.xs, b.y + b.l);
    }
    ctx.stroke();
    updateBolts();
    appState.activeAnimationIds.weather = requestAnimationFrame(drawStorm);
  }

  function updateBolts() {
    for (let i = 0; i < bolts.length; i++) {
      const b = bolts[i];
      b.x += b.xs;
      b.y += b.ys;
      if (b.y > canvas.height) {
        b.x = Math.random() * canvas.width;
        b.y = -b.l - 10;
      }
       if (b.x > canvas.width + b.l || b.x < -b.l) {
         b.x = Math.random() * canvas.width;
         b.y = -b.l - 10;
      }
    }
  }

  // --- FUNCIÓN MODIFICADA PARA RAYO SUTIL ---
  function flashLightning() {
      const body = document.body;
      // Guarda el estilo inline actual por si acaso (aunque deberíamos confiar en la clase CSS)
      const originalInlineBackground = body.style.background;

      // Define el color del flash (un azul pálido o blanco roto puede ser sutil)
      // Puedes experimentar con el color y la opacidad
      const flashColor = 'rgba(190, 210, 240, 0.6)'; // Azul pálido semi-transparente

      // Aplica el flash cambiando el fondo directamente al body
      // Esto sobrescribirá temporalmente el gradiente definido por la clase CSS 'fondo-storm'
      body.style.transition = 'background 0.05s ease-out'; // Transición muy rápida para el flash
      body.style.background = flashColor;

      // Programa la restauración del fondo original después de un breve instante
      setTimeout(() => {
          // Quita el estilo inline para que el fondo vuelva a ser el definido por la clase CSS
          body.style.background = '';
          // Restaura la transición de fondo más lenta definida en CSS
          // (main.js debería estar aplicando la clase 'fondo-storm' que usa --transition-bg)
          // Forzar la restauración explícita de la transición por si acaso:
          body.style.transition = 'var(--transition-bg)';
      }, 100); // Duración del flash (ajusta este valor, 100-150ms suele ir bien)
  }
  // --- FIN DE FUNCIÓN MODIFICADA ---


  function iniciarRayosAleatorios() {
      if (appState.lightningIntervalId) {
          clearInterval(appState.lightningIntervalId);
      }
      // Intervalo más frecuente para que se note más, pero probabilidad baja por flash
      appState.lightningIntervalId = setInterval(() => {
          // Ajusta la probabilidad según cuán frecuente/sutil quieres que sea
          if (Math.random() < 0.25) { // Probabilidad del 25% en cada intervalo
              flashLightning();
          }
      }, Math.random() * 2000 + 1500); // Cada 1.5 - 3.5 segundos intenta un flash
  }


  function onResize() {
      if (appState.activeAnimationIds.weather) {
          cancelAnimationFrame(appState.activeAnimationIds.weather);
          appState.activeAnimationIds.weather = null;
      }
      if (appState.lightningIntervalId) {
          clearInterval(appState.lightningIntervalId);
          appState.lightningIntervalId = null;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStorm(); // Reinicia gotas y relámpagos
      appState.activeAnimationIds.weather = requestAnimationFrame(drawStorm);
  }

  // --- Inicio del efecto ---
  console.log("Iniciando efecto tormenta (con rayos sutiles)...");
  initStorm();
  canvas.dataset.active = "true";
  appState.activeAnimationIds.weather = requestAnimationFrame(drawStorm);
  window.addEventListener("resize", onResize);

})();