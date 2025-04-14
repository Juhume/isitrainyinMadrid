(function startFogEffect() {
    const canvas = document.getElementById("particles");
    if (!canvas || canvas.dataset.active === "true") return;
    canvas.dataset.active = "true";
    canvas.style.display = "block";
  
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    canvas.style.opacity = 0;
    canvas.style.transition = "opacity 1s ease";
    setTimeout(() => { canvas.style.opacity = 1; }, 50);
  
    let fogs = [];
    let animationId;
  
    function initFog() {
      fogs = [];
      for (let i = 0; i < 20; i++) {
        fogs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 80 + 50,
          dx: (Math.random() - 0.5) * 0.2
        });
      }
    }
  
    function drawFog() {
      animationId = requestAnimationFrame(drawFog);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      for (let i = 0; i < fogs.length; i++) {
        const f = fogs[i];
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        f.x += f.dx;
        if (f.x > canvas.width + f.r) f.x = -f.r;
        if (f.x < -f.r) f.x = canvas.width + f.r;
      }
    }
  
    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFog();
    }
  
    window.addEventListener("resize", onResize);
    initFog();
    drawFog();
  })();
  