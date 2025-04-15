(function startSnowEffect() {
    // Usa el canvas 'particles' según la configuración en main.js
    const canvas = document.getElementById("particles-canvas");
    if (!canvas || canvas.dataset.active === "true") {
        console.log("Snow effect: Canvas no encontrado o ya activo.");
        return;
    }

    const ctx = canvas.getContext("2d");
     if (!ctx) {
      console.error("Snow effect: No se pudo obtener el contexto 2D.");
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let snowflakes = [];
    const maxFlakes = 200; // Más copos para efecto nieve

    function initSnow() {
      snowflakes = [];
      for (let i = 0; i < maxFlakes; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 3 + 1, // Radio del copo
          d: Math.random() + 1,     // Densidad/velocidad
          opacity: Math.random() * 0.5 + 0.3 // Opacidad variable
        });
      }
    }

    function drawSnow() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibuja cada copo
      snowflakes.forEach(f => {
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`; // Usa opacidad individual
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
        ctx.fill();
      });

      updateSnow();

      // Guarda el ID de la animación
      appState.activeAnimationIds.particles = requestAnimationFrame(drawSnow);
    }

    function updateSnow() {
      for (let i = 0; i < snowflakes.length; i++) {
        const f = snowflakes[i];
        // Movimiento: Cae y tiene un ligero balanceo horizontal (usando seno)
        f.y += f.d * 0.8; // Velocidad de caída basada en densidad
        f.x += Math.sin(f.y * 0.02) * 0.5; // Balanceo suave

        // Si el copo sale por abajo, reaparece arriba
        if (f.y - f.r > canvas.height) {
          f.y = -f.r - 10;
          f.x = Math.random() * canvas.width;
        }
        // Si sale por los lados (debido al balanceo), también reaparece
         if (f.x + f.r < 0) f.x = canvas.width + f.r;
         if (f.x - f.r > canvas.width) f.x = -f.r;
      }
    }

    function onResize() {
        if (appState.activeAnimationIds.particles) {
            cancelAnimationFrame(appState.activeAnimationIds.particles);
            appState.activeAnimationIds.particles = null;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initSnow();
        appState.activeAnimationIds.particles = requestAnimationFrame(drawSnow);
    }

    // --- Inicio del efecto ---
    console.log("Iniciando efecto nieve...");
    initSnow();
    canvas.dataset.active = "true";
    appState.activeAnimationIds.particles = requestAnimationFrame(drawSnow);
    window.addEventListener("resize", onResize);

    // Cleanup manejado por main.js

})();