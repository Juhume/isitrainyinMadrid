let mockClima = "";
let barrio = "";
let lastShake = 0;
let menuVisible = false;
let haVibradoYa = false;

function aplicarTemaAutomatico() {
  const ahora = new Date();
  const horaMadrid = ahora.toLocaleString("en-US", { timeZone: "Europe/Madrid" });
  const hora = new Date(horaMadrid).getHours();
  const body = document.body;

  if (hora >= 20 || hora < 7) {
    body.classList.add("modo-noche");
    body.classList.remove("modo-dia");
  } else {
    body.classList.add("modo-dia");
    body.classList.remove("modo-noche");
  }
}

function animarTransicion() {
  const elementos = [
    document.getElementById("app"),
    document.getElementById("prevision"),
    document.getElementById("logo"),
    document.getElementById("info-clima")
  ];

  elementos.forEach(el => {
    if (!el) return;
    el.classList.remove("show");
    el.classList.add("fade-in-up");
    setTimeout(() => el.classList.add("show"), 10);
  });
}

async function vaALlover() {
  animarTransicion();

  let API_URL = "https://wttr.in/Madrid?format=j1";
  if (barrio === "cuchillo") API_URL = "https://wttr.in/40.3811929,-3.73797568773365?format=j1";
  if (barrio === "elfo") API_URL = "https://wttr.in/40.434501831261166,-3.651017187763704?format=j1";

  const respuesta = document.getElementById("respuesta");
  const rainCanvas = document.getElementById("rain");
  const particlesCanvas = document.getElementById("particles");

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (mockClima) {
      data.current_condition[0].weatherDesc[0].value = mockClima;
      data.current_condition[0].temp_C = "16";
      data.current_condition[0].FeelsLikeC = "14";
      data.current_condition[0].humidity = "78";

      const lluviaAlta = ["Light rain", "Thunderstorm", "Snow"];
      for (let i = 0; i < data.weather[0].hourly.length; i++) {
        data.weather[0].hourly[i].chanceofrain = lluviaAlta.includes(mockClima) ? "90" : "5";
      }
    }

    const logo = document.getElementById("logo");
    if (logo) {
      if (barrio === "cuchillo") {
        logo.textContent = "¿Va a llover en el barrio navajero?";
      } else if (barrio === "elfo") {
        logo.textContent = "¿Va a llover en el barrio elfo?";
      } else {
        logo.textContent = "¿Va a llover en Madrid?";
      }
    }

    const condition = data.current_condition[0];
    const desc = condition.weatherDesc[0].value.toLowerCase();
    const temp = condition.temp_C;
    const feelsLike = condition.FeelsLikeC;
    const humidity = condition.humidity;

    const emojis = {
      rain: "🌧️", drizzle: "🌦️", shower: "🌧️", thunderstorm: "⛈️", snow: "❄️",
      fog: "🌫️", mist: "🌫️", haze: "🌫️", clouds: "☁️", overcast: "☁️",
      clear: "☀️", sunny: "☀️"
    };

    let emoji = "🌤️";
    for (let key in emojis) {
      if (desc.includes(key)) {
        emoji = emojis[key];
        break;
      }
    }

    const esLluvia = desc.includes("rain") || desc.includes("lluvia") || desc.includes("drizzle") || desc.includes("shower") || desc.includes("thunderstorm");

    const mensaje = esLluvia
      ? "Llueve ahora mismo"
      : "No llueve en Madrid";

    if (esLluvia) {
      document.body.style.background = "linear-gradient(135deg, #60a5fa, #2563eb)";
      rainCanvas.style.display = "block";
      particlesCanvas.style.display = "none";
    } else {
      document.body.style.background = "";
      rainCanvas.style.display = "none";
      particlesCanvas.style.display = "block";
    }

    respuesta.innerHTML = `
      <div class="emoji">${emoji}</div>
      <div class="temp">${temp}°C</div>
      <div class="texto">${mensaje}</div>
    `;

    const humedad = document.getElementById("humedad");
    const sensacion = document.getElementById("sensacion");
    if (humedad) humedad.textContent = `Humedad: ${humidity}%`;
    if (sensacion) sensacion.textContent = feelsLike !== temp ? `Sensación: ${feelsLike}°C` : "";

    const ahora = new Date().toLocaleTimeString("es-ES", {
      timeZone: "Europe/Madrid",
      hour: '2-digit',
      minute: '2-digit'
    });

    const infoClima = document.getElementById("info-clima");
    if (infoClima) infoClima.textContent = `Actualizado: ${ahora}`;

    const ahoraMadrid = new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" });
    const horaActual = new Date(ahoraMadrid).getHours();

    const contenedor = document.getElementById("horas-lluvia");
    const horasHoy = data.weather[0].hourly;
    const horasManana = data.weather[1]?.hourly || [];

    const procesarHoras = (horas, offset = 0) =>
      horas.map(hora => {
        const horaNum = parseInt(hora.time, 10);
        const horaReal = horaNum === 0 ? 0 : horaNum / 100;
        return { ...hora, horaReal: horaReal + offset };
      });

    const hoyFuturas = procesarHoras(horasHoy).filter(h => h.horaReal > horaActual);
    const mananaProcesadas = procesarHoras(horasManana, 24);
    const todas = [...hoyFuturas, ...mananaProcesadas].slice(0, 5);

    if (contenedor) {
      contenedor.innerHTML = todas.length === 0
        ? `<div>No hay datos próximos 🌙</div>`
        : todas.map(h => {
            const lluvia = parseInt(h.chanceofrain, 10);
            const icono = lluvia >= 70 ? "🌧️" : lluvia >= 30 ? "🌦️" : "☀️";
            const horaMostrar = h.horaReal >= 24 ? `${h.horaReal - 24}h mañana` : `${h.horaReal}h`;
            return `<div>${horaMostrar}<br>${icono}<br>${lluvia}%</div>`;
          }).join("");
    }

    const todasLluviaAlta = todas.length && todas.every(h => parseInt(h.chanceofrain, 10) >= 70);
    document.body.classList.toggle("modo-paraguas", todasLluviaAlta);

  } catch (err) {
    console.error(err);
    if (respuesta) {
      respuesta.innerHTML = `
        <div class="emoji">⚠️</div>
        <div class="temp">--</div>
        <div class="texto">Error al obtener datos</div>
      `;
    }
  }
}

// === EVENTOS ===
document.addEventListener("DOMContentLoaded", () => {
  aplicarTemaAutomatico();
  vaALlover();
  setInterval(vaALlover, 120000);
});

// Tecla M: menú de simulación
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "m") {
    const menu = document.getElementById("mock-menu");
    if (menu) menu.style.display = menu.style.display === "none" ? "block" : "none";
  }
});

const select = document.getElementById("mock-select");
if (select) {
  select.addEventListener("change", () => {
    mockClima = select.value;
    vaALlover();
  });
}

// Tecla B: menú de barrios
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "b") {
    const menu = document.getElementById("barrio-menu");
    if (menu) menu.style.display = menu.style.display === "none" ? "block" : "none";
  }
});

// Botones del menú de barrios
const barrioBtns = document.querySelectorAll("#barrio-options button");
barrioBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    barrio = btn.dataset.barrio;
    if (navigator.vibrate) navigator.vibrate(60);
    vaALlover();
  });
});

// Agitar para mostrar/ocultar menú barrio con animación
function detectarShake(event) {
  const aceleracion = event.accelerationIncludingGravity;
  const intensidad = Math.abs(aceleracion.x) + Math.abs(aceleracion.y) + Math.abs(aceleracion.z);
  const now = Date.now();

  if (intensidad > 25 && now - lastShake > 1000) {
    lastShake = now;
    const menu = document.getElementById("barrio-menu");
    if (!menu) return;

    menu.classList.remove("mostrar-popup", "ocultar-popup");
    void menu.offsetWidth;

    if (!menuVisible) {
      menu.classList.add("mostrar-popup");
      menu.style.display = "block";
      menuVisible = true;
      if (!haVibradoYa && navigator.vibrate) {
        navigator.vibrate(100);
        haVibradoYa = true;
      }
    } else {
      menu.classList.add("ocultar-popup");
      setTimeout(() => { menu.style.display = "none"; }, 400);
      menuVisible = false;
      haVibradoYa = false;
    }
  }
}

if (window.DeviceMotionEvent) {
  window.addEventListener("click", () => {
    window.addEventListener("devicemotion", detectarShake);
  }, { once: true });
}

document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "s") {
      detectarShake({
        accelerationIncludingGravity: { x: 25, y: 25, z: 25 }
      });
    }
  });