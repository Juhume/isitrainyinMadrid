const rainCanvas = document.getElementById("rain");
const rainCtx = rainCanvas.getContext("2d");

rainCanvas.width = window.innerWidth;
rainCanvas.height = window.innerHeight;

let drops = [];

for (let i = 0; i < 300; i++) {
  drops.push({
    x: Math.random() * rainCanvas.width,
    y: Math.random() * rainCanvas.height,
    l: Math.random() * 20 + 10,
    xs: Math.random() * 4 - 2,
    ys: Math.random() * 10 + 10
  });
}

function drawRain() {
  rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  rainCtx.strokeStyle = "rgba(255,255,255,0.2)";
  rainCtx.lineWidth = 1;
  rainCtx.beginPath();
  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    rainCtx.moveTo(d.x, d.y);
    rainCtx.lineTo(d.x + d.xs, d.y + d.l);
  }
  rainCtx.stroke();
  moveRain();
}

function moveRain() {
  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    d.x += d.xs;
    d.y += d.ys;
    if (d.x > rainCanvas.width || d.y > rainCanvas.height) {
      d.x = Math.random() * rainCanvas.width;
      d.y = -20;
    }
  }
}

function animateRain() {
  drawRain();
  requestAnimationFrame(animateRain);
}

animateRain();

window.addEventListener("resize", () => {
  rainCanvas.width = window.innerWidth;
  rainCanvas.height = window.innerHeight;
});
