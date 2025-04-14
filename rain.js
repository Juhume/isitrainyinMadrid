(function startRainEffect() {
    const canvas = document.getElementById("rain");
    if (!canvas || canvas.dataset.active === "true") return;
    canvas.dataset.active = "true";
    canvas.style.display = "block";
  
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    let drops = [];
    let animationId;
  
    function initRain() {
      drops = [];
      for (let i = 0; i < 300; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          l: Math.random() * 20 + 10,
          xs: Math.random() * 4 - 2,
          ys: Math.random() * 10 + 10
        });
      }
    }
  
    function drawRain() {
      animationId = requestAnimationFrame(drawRain);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.xs, d.y + d.l);
      }
      ctx.stroke();
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.x += d.xs;
        d.y += d.ys;
        if (d.x > canvas.width || d.y > canvas.height) {
          d.x = Math.random() * canvas.width;
          d.y = -20;
        }
      }
    }
  
    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initRain();
    }
  
    window.addEventListener("resize", onResize);
    initRain();
    drawRain();
  })();