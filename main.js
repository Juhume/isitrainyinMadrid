function aplicarTemaAutomatico() {
    const ahora = new Date();
  
    // Convertimos la hora a Madrid (UTC+2 en verano, UTC+1 en invierno)
    const horaMadrid = ahora.toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
    const hora = new Date(horaMadrid).getHours();
  
    const body = document.body;
  
    if (hora >= 20 || hora < 7) {
      // 🌙 Modo noche
      body.classList.add("modo-noche");
      body.classList.remove("modo-dia");
    } else {
      // ☀️ Modo día
      body.classList.add("modo-dia");
      body.classList.remove("modo-noche");
    }
  }

const API_URL = "https://wttr.in/Madrid?format=j1";

async function vaALlover() {
  const respuesta = document.getElementById('respuesta');

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const currentCondition = data.current_condition[0].weatherDesc[0].value.toLowerCase();
    const tempActual = data.current_condition[0].temp_C;

    let mensaje = "";

    if(currentCondition.includes('rain') || currentCondition.includes('lluvia') || currentCondition.includes('drizzle') || currentCondition.includes('shower')) {
      mensaje = "Sí, está lloviendo en Madrid 🌧️";
      document.body.style.background = "linear-gradient(135deg, #60a5fa, #2563eb)";
    } else {
      mensaje = "No, ahora no llueve en Madrid ☀️";
      document.body.style.background = "linear-gradient(135deg, #fcd34d, #fbbf24)";
    }

    respuesta.innerHTML = `${mensaje}<br><span style="font-size: 1.5rem;">Con una temperatura de: ${tempActual}°C 🌡️</span>`;

    const rainCanvas = document.getElementById("rain");
    const particlesCanvas = document.getElementById("particles");

    if (currentCondition.includes('rain') || currentCondition.includes('lluvia') || currentCondition.includes('drizzle') || currentCondition.includes('shower')) {
        mensaje = "Sí, está lloviendo en Madrid 🌧️";
        document.body.style.background = "linear-gradient(135deg, #60a5fa, #2563eb)";

    rainCanvas.style.display = "block";
    particlesCanvas.style.display = "none";
    } else {
    mensaje = "No, hoy no llueve en Madrid ☀️";
    document.body.style.background = "linear-gradient(135deg, #fcd34d, #fbbf24)";

    rainCanvas.style.display = "none";
    particlesCanvas.style.display = "block";
    }
    
  } catch (error) {
    console.error(error);
    respuesta.textContent = "Error al cargar datos.";
    document.body.style.backgroundColor = "#ef4444";
  }
}

aplicarTemaAutomatico();
vaALlover();
setInterval(vaALlover, 120000);
