(function startStormEffect() {
    const canvas = document.getElementById("rain");
    if (!canvas || canvas.dataset.active === "true") return;
    canvas.dataset.active = "true";
    canvas.style.display = "block";
  
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    canvas.style.opacity = 0;
    canvas.style.transition = "opacity 1s ease";
    setTimeout(() => { canvas.style.opacity = 1; }, 50);
  
    let bolts = [];
    let animationId;
  
    function initStorm() {
      bolts = [];
      for (let i = 0; i < 150; i++) {
        bolts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          l: Math.random() * 20 + 10,
          xs: Math.random() * 2 - 1,
          ys: Math.random() * 8 + 12
        });
      }
    }
  
    function drawStorm() {
      animationId = requestAnimationFrame(drawStorm);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < bolts.length; i++) {
        const b = bolts[i];
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + b.xs, b.y + b.l);
      }
      ctx.stroke();
      updateBolts();
    }
  
    function updateBolts() {
      for (let i = 0; i < bolts.length; i++) {
        const b = bolts[i];
        b.x += b.xs;
        b.y += b.ys;
  
        if (b.x > canvas.width || b.y > canvas.height) {
          b.x = Math.random() * canvas.width;
          b.y = -20;
        }
      }
    }
  
    function flashLightning() {
      canvas.style.background = "rgba(255,255,255,0.8)";
      setTimeout(() => {
        canvas.style.background = "transparent";
      }, 80);
    }
  
    function iniciarRayosAleatorios() {
    lightningIntervalId = setInterval(() => {
        if (Math.random() < 0.5) flashLightning();
        }, Math.random() * 3000 + 3000);
    }
  
    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStorm();
    }
  
    window.addEventListener("resize", onResize);
    initStorm();
    drawStorm();
    iniciarRayosAleatorios();
  })();