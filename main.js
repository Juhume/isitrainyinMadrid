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
      document.body.style.backgroundColor = "#5f99ff";
    } else {
      mensaje = "No, hoy no llueve en Madrid ☀️";
      document.body.style.backgroundColor = "#fcd34d";
    }

    respuesta.innerHTML = `${mensaje}<br><span style="font-size: 1.5rem;">Con una temperatura de: ${tempActual}°C 🌡️</span>`;
    
  } catch (error) {
    console.error(error);
    respuesta.textContent = "Error al cargar datos.";
    document.body.style.backgroundColor = "#ef4444";
  }
}

vaALlover();
