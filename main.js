function aplicarTemaAutomatico() {
    const ahora = new Date();
    const horaMadrid = ahora.toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
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
  
  async function vaALlover() {
    const API_URL = "https://wttr.in/Almeria?format=j1";
    const respuesta = document.getElementById("respuesta");
    const rainCanvas = document.getElementById("rain");
    const particlesCanvas = document.getElementById("particles");
  
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
  
      const currentCondition = data.current_condition[0].weatherDesc[0].value.toLowerCase();
      const tempActual = data.current_condition[0].temp_C;
  
      // Diccionario de condiciones → emojis
      const emojiClima = {
        rain: "🌧️",
        drizzle: "🌦️",
        shower: "🌧️",
        thunderstorm: "⛈️",
        snow: "❄️",
        sleet: "🌨️",
        fog: "🌫️",
        mist: "🌫️",
        haze: "🌫️",
        clouds: "☁️",
        overcast: "☁️",
        clear: "☀️",
        sunny: "☀️"
      };
  
      // Buscar emoji adecuado
      let emoji = "🌤️"; // por defecto
      for (let key in emojiClima) {
        if (currentCondition.includes(key)) {
          emoji = emojiClima[key];
          break;
        }
      }
  
      // ¿Está lloviendo?
      const esLluvia = currentCondition.includes('rain') ||
                       currentCondition.includes('lluvia') ||
                       currentCondition.includes('drizzle') ||
                       currentCondition.includes('shower') ||
                       currentCondition.includes('thunderstorm');
  
      let mensaje = esLluvia
        ? "Sí, está lloviendo en Madrid"
        : "No, no está lloviendo en Madrid";
  
      // Mostrar animación correspondiente
      if (esLluvia) {
        document.body.style.background = "linear-gradient(135deg, #60a5fa, #2563eb)";
        rainCanvas.style.display = "block";
        particlesCanvas.style.display = "none";
      } else {
        document.body.style.background = ""; // usa clase modo-dia/noche
        rainCanvas.style.display = "none";
        particlesCanvas.style.display = "block";
      }
  
      // Pintar con un estilo asi como de iOS
      respuesta.innerHTML = `
        <div class="emoji">${emoji}</div>
        <div class="temp">${tempActual}°C</div>
        <div class="texto">${mensaje}</div>
      `;
  
      // Actualizar hora de último chequeo
      const ahora = new Date().toLocaleTimeString("es-ES", {
        timeZone: "Europe/Madrid",
        hour: '2-digit',
        minute: '2-digit'
      });
      document.getElementById("info-clima").textContent = `Actualizado: ${ahora}`;
  
    } catch (error) {
      console.error("Error al obtener el clima:", error);
      respuesta.innerHTML = `
        <div class="emoji">⚠️</div>
        <div class="temp">--</div>
        <div class="texto">Error al cargar datos</div>
      `;
      document.body.style.backgroundColor = "#ef4444";
      rainCanvas.style.display = "none";
      particlesCanvas.style.display = "none";
    }
  }
  
  aplicarTemaAutomatico();
  vaALlover();
  setInterval(vaALlover, 120000); // cada 2 minutos
  