(function startSnowEffect() {
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
  
    let snowflakes = [];
    let animationId;
  
    function initSnow() {
      snowflakes = [];
      for (let i = 0; i < 150; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 3 + 1,
          d: Math.random() * 2 + 1
        });
      }
    }
  
    function drawSnow() {
      animationId = requestAnimationFrame(drawSnow);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      for (let i = 0; i < snowflakes.length; i++) {
        const f = snowflakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      updateSnow();
    }
  
    function updateSnow() {
      for (let i = 0; i < snowflakes.length; i++) {
        const f = snowflakes[i];
        f.y += Math.pow(f.d, 2) + 1;
        f.x += Math.sin(f.y * 0.01);
  
        if (f.y > canvas.height) {
          f.y = 0;
          f.x = Math.random() * canvas.width;
        }
      }
    }
  
    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSnow();
    }
  
    window.addEventListener("resize", onResize);
    initSnow();
    drawSnow();
  })();