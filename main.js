
let mockClima = "";
let barrio = "";
let haVibradoYa = false;
let lastShake = 0;
let menuVisible = false;
let scriptClimaActivo = null;
let lightningIntervalId;

const datosSimulados = {
  "Sunny": {
    desc: "Sunny",
    temp: "27",
    feelsLike: "26",
    humidity: "30",
    chanceofrain: ["5", "5", "5", "0", "10"]
  },
  "Light rain": {
    desc: "Light rain",
    temp: "18",
    feelsLike: "17",
    humidity: "80",
    chanceofrain: ["65", "70", "75", "80", "85"]
  },
  "Thunderstorm": {
    desc: "Thunderstorm",
    temp: "16",
    feelsLike: "14",
    humidity: "95",
    chanceofrain: ["90", "95", "95", "90", "80"]
  },
  "Fog": {
    desc: "Fog",
    temp: "14",
    feelsLike: "13",
    humidity: "90",
    chanceofrain: ["15", "10", "5", "0", "0"]
  },
  "Snow": {
    desc: "Snow",
    temp: "0",
    feelsLike: "-2",
    humidity: "88",
    chanceofrain: ["70", "60", "50", "40", "30"]
  }
};

window.addEventListener("DOMContentLoaded", () => {
  setupInicial();
});

function setupInicial() {
  document.getElementById("mock-select").addEventListener("change", e => {
    mockClima = e.target.value;
    obtenerClima();
  });

  document.querySelectorAll("#barrio-options button").forEach(boton => {
    boton.addEventListener("click", () => {
      barrio = boton.dataset.barrio;
      actualizarTitulo();
      transicionBarrio();
      obtenerClima();
    });
  });

  document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
  
    if (key === "m") {
      toggleMenuBarrio();
    }
  
    if (key === "c") {
      const mockMenu = document.getElementById("mock-menu");
      const visible = mockMenu.style.display === "block";
      mockMenu.style.display = visible ? "none" : "block";
    }
  });

  window.addEventListener("devicemotion", handleShake);

  actualizarTitulo();
  obtenerClima();
}

function handleShake(event) {
  const intensidad = Math.abs(event.acceleration.x) + Math.abs(event.acceleration.y);
  const ahora = Date.now();
  if (intensidad > 25 && ahora - lastShake > 1000) {
    lastShake = ahora;
    if (!haVibradoYa) {
      toggleMenuBarrio();
      haVibradoYa = true;
    }
  }
}

function toggleMenuBarrio() {
  const menu = document.getElementById("barrio-menu");
  if (!menuVisible) {
    menu.style.display = "block";
    menu.classList.remove("ocultar-popup");
    menu.classList.add("mostrar-popup");
  } else {
    menu.classList.remove("mostrar-popup");
    menu.classList.add("ocultar-popup");
    setTimeout(() => menu.style.display = "none", 400);
  }
  menuVisible = !menuVisible;
}

function actualizarTitulo() {
  const logo = document.getElementById("logo");
  if (barrio === "cuchillo") logo.textContent = "¿Va a llover en el barrio de navajero?";
  else if (barrio === "elfo") logo.textContent = "¿Va a llover en el barrio elfo?";
  else logo.textContent = "¿Va a llover en Madrid?";
}

function obtenerClima() {
    if (mockClima && datosSimulados[mockClima]) {
      actualizarUI(datosSimulados[mockClima]);
      cargarEfecto(datosSimulados[mockClima].desc);
      return;
    }
  
    let API_URL = "https://wttr.in/Madrid?format=j1";
    if (barrio === "cuchillo") API_URL = "https://wttr.in/40.3811929,-3.73797568773365?format=j1";
    if (barrio === "elfo") API_URL = "https://wttr.in/40.434501831261166,-3.651017187763704?format=j1";
  
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const current = data.current_condition[0];
        const clima = {
          desc: current.lang_es[0].value,
          temp: current.temp_C,
          feelsLike: current.FeelsLikeC,
          humidity: current.humidity,
          chanceofrain: data.weather[0].hourly.slice(0, 5).map(h => h.chanceofrain)
        };
        actualizarUI(clima);
        cargarEfecto(clima.desc);
      })
      .catch(() => {
        document.getElementById("respuesta").innerHTML = `<div class='texto'>Error al cargar clima</div>`;
      });
  }
  

function actualizarUI({ desc, temp, feelsLike, humidity, chanceofrain }) {
  const respuesta = document.getElementById("respuesta");
  const humedad = document.getElementById("humedad");
  const sensacion = document.getElementById("sensacion");
  const horas = document.getElementById("horas-lluvia");
  const info = document.getElementById("info-clima");

  const estaLloviendo = /rain|thunder/i.test(desc);
  const emoji = obtenerEmoji(desc);
  const mensaje = estaLloviendo
    ? `Sí, está lloviendo ahora mismo.`
    : `No está lloviendo. Ahora está: ${desc}`;
  
  respuesta.innerHTML = `<div class='emoji'>${emoji}</div><div class='temp'>${temp}°</div><div class='texto'>${mensaje}</div>`;  humedad.textContent = `Humedad: ${humidity}%`;
  sensacion.textContent = `Sensación térmica: ${feelsLike}°C`;
  horas.innerHTML = chanceofrain.map((val, i) => `<div><strong>+${i * 3}h</strong>${val}%</div>`).join("");
  const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  info.textContent = `Actualizado: ${hora}`;
  aplicarFondo(desc);
}

function obtenerEmoji(desc) {
    const texto = desc.toLowerCase();
  
    if (texto.includes("soleado") || texto.includes("sol")) return "☀️";
    if (texto.includes("tormenta")) return "⛈️";
    if (texto.includes("lluvia")) return "🌧️";
    if (texto.includes("nieve")) return "❄️";
    if (texto.includes("niebla") || texto.includes("bruma")) return "🌫️";
  
    return "☁️"; // por defecto, nubes
  }

function aplicarFondo(desc) {
  const body = document.body;
  body.className = "";

  const texto = desc.toLowerCase();
  let clase = "fondo-clouds";

  if (texto.includes("soleado") || texto.includes("sol")) clase = "fondo-sun";
  else if (texto.includes("lluvia")) clase = "fondo-rain";
  else if (texto.includes("tormenta")) clase = "fondo-storm";
  else if (texto.includes("nieve")) clase = "fondo-snow";
  else if (texto.includes("niebla") || texto.includes("bruma")) clase = "fondo-fog";

  setTimeout(() => body.classList.add(clase), 50);
}

function cargarEfecto(desc) {

    // Limpiar todos los canvas de efectos
    const rain = document.getElementById("rain");
    const particles = document.getElementById("particles");
  
    [rain, particles].forEach(c => {
      c.style.display = "none";
      c.dataset.active = "false";
    });

    if (typeof lightningIntervalId !== 'undefined') {
        clearInterval(lightningIntervalId);
        lightningIntervalId = undefined;
      }
  
    // Eliminar script anterior si existe
    if (scriptClimaActivo) {
      document.body.removeChild(scriptClimaActivo);
      scriptClimaActivo = null;
    }
  
    const efectos = {
      "Sunny": "particles.js",
      "Light rain": "rain.js",
      "Thunderstorm": "storm.js",
      "Snow": "snow.js",
      "Fog": "fog.js"
    };
  
    const script = document.createElement("script");
    script.src = efectos[desc] || "clouds.js";
    script.async = true;
    document.body.appendChild(script);
    scriptClimaActivo = script;
  }
  
function transicionBarrio() {
  document.body.style.opacity = 0.7;
  setTimeout(() => {
    document.body.style.opacity = 1;
  }, 300);
}
