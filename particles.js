(function startParticlesEffect() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas || canvas.dataset.active === "true") {
      console.log("Particles effect: Canvas no encontrado o ya activo.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Particles effect: No se pudo obtener el contexto 2D.");
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const numParticles = 100; // Ajustar según rendimiento deseado

    // Determinar si es de día o noche por la clase del body (simple check)
    const isLikelyNight = document.body.classList.contains('fondo-clear-night') ||
                         document.body.classList.contains('fondo-default');

    function initParticles() {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: isLikelyNight ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1, // Más pequeñas de noche (estrellas)
          dx: (Math.random() - 0.5) * (isLikelyNight ? 0.1 : 0.4), // Más lentas de noche
          dy: (Math.random() - 0.5) * (isLikelyNight ? 0.1 : 0.4)
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Color y opacidad diferentes para día/noche
      ctx.fillStyle = isLikelyNight ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.35)";

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        // Rebote en los bordes
        if (p.x - p.r < 0 || p.x + p.r > canvas.width) p.dx *= -1;
        if (p.y - p.r < 0 || p.y + p.r > canvas.height) p.dy *= -1;

        // Hacer que las partículas que salen reaparezcan en el lado opuesto (movimiento continuo)
        if (p.x + p.r < 0) p.x = canvas.width + p.r;
        if (p.x - p.r > canvas.width) p.x = -p.r;
        if (p.y + p.r < 0) p.y = canvas.height + p.r;
        if (p.y - p.r > canvas.height) p.y = -p.r;
      });

      appState.activeAnimationIds.particles = requestAnimationFrame(drawParticles);
    }

    function onResize() {
        if (appState.activeAnimationIds.particles) {
            cancelAnimationFrame(appState.activeAnimationIds.particles);
            appState.activeAnimationIds.particles = null;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
        appState.activeAnimationIds.particles = requestAnimationFrame(drawParticles);
    }

    // --- Inicio del efecto ---
    console.log("Iniciando efecto partículas...");
    initParticles();
    canvas.dataset.active = "true";
    appState.activeAnimationIds.particles = requestAnimationFrame(drawParticles);
    window.addEventListener("resize", onResize);

    // Cleanup gestionado por main.js

})();