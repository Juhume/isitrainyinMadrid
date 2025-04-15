(function startFogEffect() {
  // Usa el canvas 'particles' según la configuración en main.js
  const canvas = document.getElementById("particles-canvas");
   if (!canvas || canvas.dataset.active === "true") {
      console.log("Fog effect: Canvas no encontrado o ya activo.");
      return;
  }

  const ctx = canvas.getContext("2d");
   if (!ctx) {
    console.error("Fog effect: No se pudo obtener el contexto 2D.");
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let fogs = [];
  const numFogPatches = 25; // Número de "manchas" de niebla

  function initFog() {
    fogs = [];
    for (let i = 0; i < numFogPatches; i++) {
      fogs.push({
        x: Math.random() * canvas.width,
        // Posicionar niebla más abajo en la pantalla generalmente
        y: canvas.height * 0.6 + Math.random() * canvas.height * 0.4,
        r: Math.random() * 120 + 80, // Radios grandes para manchas difusas
        dx: (Math.random() - 0.5) * 0.2, // Movimiento horizontal lento
        opacity: Math.random() * 0.03 + 0.02 // Muy baja opacidad
      });
    }
  }

  function drawFog() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja cada mancha de niebla
    fogs.forEach(f => {
      // Crear un gradiente radial para un efecto más suave
      const gradient = ctx.createRadialGradient(f.x, f.y, f.r * 0.1, f.x, f.y, f.r);
      gradient.addColorStop(0, `rgba(200, 200, 200, ${f.opacity * 0.5})`); // Centro ligeramente más opaco
      gradient.addColorStop(1, `rgba(200, 200, 200, 0)`); // Transparente en el borde

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();

      // Movimiento
      f.x += f.dx;

      // Si la niebla sale por un lado, reaparece por el otro
      if (f.x + f.r < 0) f.x = canvas.width + f.r;
      if (f.x - f.r > canvas.width) f.x = -f.r;
    });

    // Guarda el ID de la animación
    appState.activeAnimationIds.particles = requestAnimationFrame(drawFog);
  }

  function onResize() {
      if (appState.activeAnimationIds.particles) {
          cancelAnimationFrame(appState.activeAnimationIds.particles);
          appState.activeAnimationIds.particles = null;
      }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFog();
      appState.activeAnimationIds.particles = requestAnimationFrame(drawFog);
  }

  // --- Inicio del efecto ---
  console.log("Iniciando efecto niebla...");
  initFog();
  canvas.dataset.active = "true";
  appState.activeAnimationIds.particles = requestAnimationFrame(drawFog);
  window.addEventListener("resize", onResize);

  // Cleanup manejado por main.js

})();