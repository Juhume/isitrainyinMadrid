(function startCloudEffect() {
  // Usa el canvas 'particles' según la configuración en main.js
  const canvas = document.getElementById("particles-canvas");
  if (!canvas || canvas.dataset.active === "true") {
      console.log("Clouds effect: Canvas no encontrado o ya activo.");
      return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Clouds effect: No se pudo obtener el contexto 2D.");
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let clouds = [];
  const numClouds = 10; // Menos nubes, pero más grandes

  function initClouds() {
    clouds = [];
    for (let i = 0; i < numClouds; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4 + canvas.height * 0.1, // En la parte superior/media
        r: Math.random() * 100 + 60, // Radios grandes
        dx: 0.1 + Math.random() * 0.2, // Movimiento horizontal lento y constante
        opacity: Math.random() * 0.05 + 0.03 // Opacidad baja
      });
    }
  }

  function drawClouds() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja cada nube (similar a la niebla pero quizás con forma diferente)
    clouds.forEach(c => {
        // Usar gradiente radial para suavidad
        const gradient = ctx.createRadialGradient(c.x, c.y, c.r * 0.2, c.x, c.y, c.r);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${c.opacity * 0.8})`); // Centro más opaco
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`); // Borde transparente

        ctx.fillStyle = gradient;
        // Podrías dibujar múltiples círculos superpuestos para una forma de nube más compleja
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); // Círculo principal
        // Círculos adicionales para forma irregular (opcional)
        // ctx.arc(c.x + c.r * 0.3, c.y + c.r * 0.1, c.r * 0.6, 0, Math.PI * 2);
        // ctx.arc(c.x - c.r * 0.4, c.y - c.r * 0.05, c.r * 0.7, 0, Math.PI * 2);
        ctx.fill();

      // Movimiento
      c.x += c.dx;

      // Si la nube sale por la derecha, reaparece por la izquierda
      if (c.x - c.r > canvas.width) {
        c.x = -c.r;
        c.y = Math.random() * canvas.height * 0.4 + canvas.height * 0.1; // Reaparece a altura similar
      }
    });

    // Guarda el ID de la animación
    appState.activeAnimationIds.particles = requestAnimationFrame(drawClouds);
  }


  function onResize() {
      if (appState.activeAnimationIds.particles) {
          cancelAnimationFrame(appState.activeAnimationIds.particles);
          appState.activeAnimationIds.particles = null;
      }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initClouds();
      appState.activeAnimationIds.particles = requestAnimationFrame(drawClouds);
  }

  // --- Inicio del efecto ---
  console.log("Iniciando efecto nubes...");
  initClouds();
  canvas.dataset.active = "true";
  appState.activeAnimationIds.particles = requestAnimationFrame(drawClouds);
  window.addEventListener("resize", onResize);

  // Cleanup manejado por main.js

})();