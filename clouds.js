(function startCloudEffect() {
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
  
    let clouds = [];
    let animationId;
  
    function initClouds() {
      clouds = [];
      for (let i = 0; i < 15; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 80 + 40,
          dx: 0.2 + Math.random() * 0.3
        });
      }
    }
  
    function drawClouds() {
      animationId = requestAnimationFrame(drawClouds);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
        c.x += c.dx;
        if (c.x - c.r > canvas.width) {
          c.x = -c.r;
          c.y = Math.random() * canvas.height;
        }
      }
    }
  
    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initClouds();
    }
  
    window.addEventListener("resize", onResize);
    initClouds();
    drawClouds();
  })();