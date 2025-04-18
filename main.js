// Estado de la aplicación
const appState = {
    mockClima: "",
    barrio: "",
    menuBarrioVisible: false,
    menuMockVisible: false,
    haVibradoYa: false,
    lastShake: 0,
    activeAnimationIds: {
        particles: null,
        rain: null,
        weather: null // <--- ID CORREGIDO
    },
    lightningIntervalId: null,
    activeEffectScript: null,
    dom: {
        logo: null,
        respuesta: null,
        humedad: null,
        sensacion: null,
        horasLluvia: null,
        infoClima: null, // El elemento que da problemas
        mockMenu: null,
        mockSelect: null,
        barrioMenu: null,
        particlesCanvas: null, // <--- Referencia al canvas particles
        rainCanvas: null, // <--- Referencia al canvas rain (ID CORREGIDO)
        salidaSol: null,
        puestaSol: null,
        body: null
    },
    api: {
        baseUrl: "https://wttr.in/",
        defaultLocation: "Madrid",
        barrios: {
            cuchillo: "40.3811929,-3.73797568773365",
            elfo: "40.434501831261166,-3.651017187763704"
        },
        format: "?format=j1&lang=es"
    },
    datosSimulados: { // Datos simulados actualizados
      "Sunny": { desc: "Soleado", temp: "27", feelsLike: "26", humidity: "30", chanceofrain: ["5", "5", "5", "0", "10"], isDay: true, sunrise: "07:30 AM", sunset: "09:00 PM", weatherCode: '113' },
      "Light rain": { desc: "Lluvia ligera", temp: "18", feelsLike: "17", humidity: "80", chanceofrain: ["65", "70", "75", "80", "85"], isDay: true, sunrise: "07:31 AM", sunset: "08:58 PM", weatherCode: '296' },
      "Thunderstorm": { desc: "Tormenta", temp: "16", feelsLike: "14", humidity: "95", chanceofrain: ["90", "95", "95", "90", "80"], isDay: true, sunrise: "07:32 AM", sunset: "08:57 PM", weatherCode: '389' },
      "Fog": { desc: "Niebla", temp: "14", feelsLike: "13", humidity: "90", chanceofrain: ["15", "10", "5", "0", "0"], isDay: true, sunrise: "07:30 AM", sunset: "08:59 PM", weatherCode: '143' },
      "Snow": { desc: "Nieve", temp: "0", feelsLike: "-2", humidity: "88", chanceofrain: ["70", "60", "50", "40", "30"], isDay: true, sunrise: "07:33 AM", sunset: "08:56 PM", weatherCode: '338' },
      "Clear": { desc: "Despejado", temp: "12", feelsLike: "11", humidity: "50", chanceofrain: ["0", "0", "0", "0", "0"], isDay: false, sunrise: "07:30 AM", sunset: "09:00 PM", weatherCode: '113' } // Noche
    }
};

// Mapeo de WeatherCode
// Mapeo de WeatherCode con SVGs
const weatherCodeMap = {
    // Códigos para sol/despejado
    '113': { 
        emoji: '<img src="weather-icons/line/clear-day.svg" alt="Soleado" class="weather-icon">', 
        clase: 'fondo-sun', 
        script: 'particles.js', 
        canvas: 'particles', 
        isDaySensitive: true, 
        nightEmoji: '<img src="weather-icons/line/clear-night.svg" alt="Despejado noche" class="weather-icon">', 
        nightClase: 'fondo-clear-night' 
    },
    
    // Códigos para nubes
    '116': { 
        emoji: '<img src="weather-icons/line/partly-cloudy-day.svg" alt="Parcialmente nublado" class="weather-icon">', 
        clase: 'fondo-clouds', 
        script: 'clouds.js', 
        canvas: 'particles',
        isDaySensitive: true,
        nightEmoji: '<img src="weather-icons/line/partly-cloudy-night.svg" alt="Parcialmente nublado noche" class="weather-icon">',
    },
    '119': { 
        emoji: '<img src="weather-icons/line/cloudy.svg" alt="Nublado" class="weather-icon">', 
        clase: 'fondo-clouds', 
        script: 'clouds.js', 
        canvas: 'particles' 
    },
    '122': { 
        emoji: '<img src="weather-icons/line/cloudy.svg" alt="Muy nublado" class="weather-icon">', 
        clase: 'fondo-clouds', 
        script: 'clouds.js', 
        canvas: 'particles' 
    },
    
    // Códigos para niebla/bruma
    '143': { 
        emoji: '<img src="weather-icons/line/fog.svg" alt="Niebla" class="weather-icon">', 
        clase: 'fondo-fog', 
        script: 'fog.js', 
        canvas: 'particles' 
    },
    '248': { 
        emoji: '<img src="weather-icons/line/fog.svg" alt="Niebla" class="weather-icon">', 
        clase: 'fondo-fog', 
        script: 'fog.js', 
        canvas: 'particles' 
    },
    '260': { 
        emoji: '<img src="weather-icons/line/fog.svg" alt="Niebla" class="weather-icon">', 
        clase: 'fondo-fog', 
        script: 'fog.js', 
        canvas: 'particles' 
    },
    '120': { 
        emoji: '<img src="weather-icons/line/fog.svg" alt="Niebla" class="weather-icon">', 
        clase: 'fondo-fog', 
        script: 'fog.js', 
        canvas: 'particles' 
    },
    
    // Códigos para lluvia ligera/llovizna
    '176': { 
        emoji: '<img src="weather-icons/line/partly-cloudy-day-drizzle.svg" alt="Lluvia ligera" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain',
        isDaySensitive: true,
        nightEmoji: '<img src="weather-icons/line/partly-cloudy-night-drizzle.svg" alt="Lluvia ligera noche" class="weather-icon">'
    },
    '263': { 
        emoji: '<img src="weather-icons/line/partly-cloudy-day-drizzle.svg" alt="Llovizna ligera" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain',
        isDaySensitive: true,
        nightEmoji: '<img src="weather-icons/line/partly-cloudy-night-drizzle.svg" alt="Llovizna ligera noche" class="weather-icon">'
    },
    '353': { 
        emoji: '<img src="weather-icons/line/partly-cloudy-day-drizzle.svg" alt="Llovizna" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain',
        isDaySensitive: true,
        nightEmoji: '<img src="weather-icons/line/partly-cloudy-night-drizzle.svg" alt="Llovizna noche" class="weather-icon">'
    },
    
    // Códigos para lluvia
    '266': { 
        emoji: '<img src="weather-icons/line/drizzle.svg" alt="Llovizna" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '281': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia helada" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '293': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '296': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '185': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia helada" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '299': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '302': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia intensa" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '305': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia intensa" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '308': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia fuerte" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '311': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia helada" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '314': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia helada fuerte" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '356': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia moderada o fuerte" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    '359': { 
        emoji: '<img src="weather-icons/line/rain.svg" alt="Lluvia torrencial" class="weather-icon">', 
        clase: 'fondo-rain', 
        script: 'rain.js', 
        canvas: 'rain' 
    },
    
    // Códigos para nieve
    '179': { 
        emoji: '<img src="weather-icons/line/snow.svg" alt="Nieve" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '182': { 
        emoji: '<img src="weather-icons/line/sleet.svg" alt="Aguanieve" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '227': { 
        emoji: '<img src="weather-icons/line/wind-snow.svg" alt="Nieve con viento" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '230': { 
        emoji: '<img src="weather-icons/line/wind-snow.svg" alt="Ventisca" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '317': { 
        emoji: '<img src="weather-icons/line/sleet.svg" alt="Aguanieve" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '320': { 
        emoji: '<img src="weather-icons/line/sleet.svg" alt="Aguanieve moderada/fuerte" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '323': { 
        emoji: '<img src="weather-icons/line/snow.svg" alt="Nieve ligera" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '326': { 
        emoji: '<img src="weather-icons/line/snow.svg" alt="Nieve ligera" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '329': { 
        emoji: '<img src="weather-icons/line/snow.svg" alt="Nieve moderada" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '332': { 
        emoji: '<img src="weather-icons/line/snow.svg" alt="Nieve moderada" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '335': { 
        emoji: '<img src="weather-icons/line/snow.svg" alt="Nieve fuerte" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '338': { 
        emoji: '<img src="weather-icons/line/snow.svg" alt="Nieve fuerte" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '368': { 
        emoji: '<img src="weather-icons/line/snow.svg" alt="Nieve ligera" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '371': { 
        emoji: '<img src="weather-icons/line/snow.svg" alt="Nieve fuerte" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    
    // Códigos para granizo
    '350': { 
        emoji: '<img src="weather-icons/line/hail.svg" alt="Granizo" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '374': { 
        emoji: '<img src="weather-icons/line/hail.svg" alt="Granizo ligero" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    '377': { 
        emoji: '<img src="weather-icons/line/hail.svg" alt="Granizo fuerte" class="weather-icon">', 
        clase: 'fondo-snow', 
        script: 'snow.js', 
        canvas: 'particles' 
    },
    
    // Códigos para tormentas
    '200': { 
        emoji: '<img src="weather-icons/line/thunderstorms.svg" alt="Tormenta" class="weather-icon">', 
        clase: 'fondo-storm', 
        script: 'storm.js', 
        canvas: 'weather-canvas' 
    },
    '386': { 
        emoji: '<img src="weather-icons/line/thunderstorms.svg" alt="Tormenta" class="weather-icon">', 
        clase: 'fondo-storm', 
        script: 'storm.js', 
        canvas: 'weather-canvas' 
    },
    '389': { 
        emoji: '<img src="weather-icons/line/thunderstorms-rain.svg" alt="Tormenta con lluvia" class="weather-icon">', 
        clase: 'fondo-storm', 
        script: 'storm.js', 
        canvas: 'weather-canvas' 
    },
    
    // Códigos para tormentas con nieve
    '392': { 
        emoji: '<img src="weather-icons/line/thunderstorms-snow.svg" alt="Tormenta con nieve" class="weather-icon">', 
        clase: 'fondo-storm', 
        script: 'storm.js', 
        canvas: 'weather-canvas' 
    },
    '395': { 
        emoji: '<img src="weather-icons/line/thunderstorms-snow.svg" alt="Tormenta con nieve fuerte" class="weather-icon">', 
        clase: 'fondo-storm', 
        script: 'storm.js', 
        canvas: 'weather-canvas' 
    },
    
    // Valor por defecto
    'default': { 
        emoji: '<img src="weather-icons/line/cloudy.svg" alt="Nublado" class="weather-icon">', 
        clase: 'fondo-clouds', 
        script: 'clouds.js', 
        canvas: 'particles' 
    }
};

// --- INICIALIZACIÓN ---
window.addEventListener("DOMContentLoaded", inicializarApp);

function inicializarApp() {
    console.log("DOM Cargado. Inicializando App..."); // Log inicial
    cacheDomElements();
    setupEventListeners();
    crearMenuBarrio();
    actualizarTitulo();
    obtenerClima();
}

function cacheDomElements() {
    console.log("Ejecutando cacheDomElements..."); // Log para ver si se ejecuta
    appState.dom.logo = document.getElementById("logo");
    appState.dom.respuesta = document.getElementById("respuesta");
    appState.dom.humedad = document.getElementById("humedad");
    appState.dom.sensacion = document.getElementById("sensacion");
    appState.dom.horasLluvia = document.getElementById("horas-lluvia");
    appState.dom.infoClima = document.getElementById("info-clima"); // Intenta encontrar el elemento
    appState.dom.mockMenu = document.getElementById("mock-menu");
    appState.dom.mockSelect = document.getElementById("mock-select");
    appState.dom.salidaSol = document.getElementById("salida-sol");
    appState.dom.puestaSol = document.getElementById("puesta-sol");
    appState.dom.alertaParaguas = document.getElementById("alerta-paraguas");
    appState.dom.particlesCanvas = document.getElementById("particles-canvas");
    appState.dom.rainCanvas = document.getElementById("rain");
    appState.dom.weatherCanvas = document.getElementById("weather-canvas"); // Añadir esta línea
    appState.dom.body = document.body;
    console.log("cacheDomElements terminado."); // Log final
}

function setupEventListeners() {
    // ... (código igual que antes)
    appState.dom.mockSelect.addEventListener("change", (e) => {
        appState.mockClima = e.target.value;
        obtenerClima();
    });

    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        if (key === "b") toggleMenuBarrio();
        else if (key === "m") toggleMenuMock();
    });

    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", handleShake);
    }
}

// --- LÓGICA DE CLIMA ---

// Función para convertir horas de formato 12h a 24h
function convertirA24h(horaStr) {
  if (!horaStr || horaStr === "--:--") return horaStr;
  
  // Extraer partes de la hora
  let [hora, minutos] = horaStr.split(":");
  let periodo = "";
  
  // Detectar AM/PM al final de la cadena
  if (minutos.includes("AM") || minutos.includes("PM")) {
    periodo = minutos.includes("AM") ? "AM" : "PM";
    minutos = minutos.replace(" AM", "").replace(" PM", "");
  }
  
  // Convertir a números
  hora = parseInt(hora, 10);
  minutos = parseInt(minutos, 10);
  
  // Aplicar lógica de conversión 12h a 24h
  if (periodo === "PM" && hora < 12) {
    hora += 12;
  } else if (periodo === "AM" && hora === 12) {
    hora = 0;
  }
  
  // Formatear como "HH:MM"
  return `${hora.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
}

function obtenerClima() {
    // Al finalizar la carga y formateo del clima, añadir:
    actualizarTitulo();
    // Comprobar si respuesta existe antes de modificarlo
    if(appState.dom.respuesta) {
        appState.dom.respuesta.innerHTML = "<div class='texto'>Consultando el cielo...</div>";
    } else {
        console.error("Error: appState.dom.respuesta es null en obtenerClima");
        return; // Salir si falta un elemento crítico
    }

    function formatearHora(fechaStr) {
        try {
            let fecha;
    
            // Si es un timestamp numérico, usarlo directamente
            if (typeof fechaStr === 'number') {
                fecha = new Date(fechaStr);
            } else if (typeof fechaStr === 'string' && fechaStr.includes('T')) {
                // Si parece una fecha ISO, ajustar para compatibilidad con Safari
                fecha = new Date(fechaStr.replace(/-/g, '/').replace('T', ' ').split('.')[0]);
            } else if (typeof fechaStr === 'string') {
                // Intentar crear una fecha directamente desde el string
                fecha = new Date(fechaStr);
            } else {
                // Si no es un formato reconocido, usar la fecha actual
                fecha = new Date();
            }
    
            // Validar que la fecha es válida
            if (isNaN(fecha.getTime())) {
                console.error("Fecha inválida:", fechaStr);
                fecha = new Date(); // Fallback a la fecha actual
            }
    
            // Formatear la hora y los minutos
            const horas = fecha.getHours().toString().padStart(2, '0');
            const minutos = fecha.getMinutes().toString().padStart(2, '0');
            return `${horas}:${minutos}`;
        } catch (error) {
            console.error("Error al formatear hora:", error);
            // Fallback a la hora actual si ocurre un error
            const ahora = new Date();
            const horas = ahora.getHours().toString().padStart(2, '0');
            const minutos = ahora.getMinutes().toString().padStart(2, '0');
            return `${horas}:${minutos}`;
        }
    }


    // Modo simulado
    if (appState.mockClima && appState.datosSimulados[appState.mockClima]) {
        const climaSimulado = { ...appState.datosSimulados[appState.mockClima] };
        climaSimulado.updatedAt = formatearHora(Date.now());
        if (climaSimulado.isDay === undefined) {
            const h = new Date().getHours();
            climaSimulado.isDay = h > 6 && h < 20;
        }
        console.log("Usando clima simulado:", climaSimulado.desc, `(Code: ${climaSimulado.weatherCode})`);
        // Pasar directamente el objeto climaSimulado
        actualizarUI(climaSimulado);
        aplicarEstilosClima(climaSimulado);

        const advice = getRunningAdviceFromClima(clima);

        const desfavorables = (advice.detallesDesfavorables || []).map(txt => `<li class="desfavorable">${txt}</li>`).join('');
        const favorables = (advice.detallesFavorables || []).map(txt => `<li class="favorable">${txt}</li>`).join('');
        
        document.getElementById('runningTitle').textContent = advice.title;
        document.getElementById('runningMessage').textContent = advice.message;
        
        document.getElementById('runningDetails').innerHTML = `
          ${desfavorables ? `
            <div class="bloque-condicion">
              <h4 class="condicion-titulo">⚠️ Condiciones desfavorables</h4>
              <ul class="desfavorables">${desfavorables}</ul>
            </div>` : ''
          }
          ${favorables ? `
            <div class="bloque-condicion">
              <h4 class="condicion-titulo">✅ Condiciones favorables</h4>
              <ul class="favorables">${favorables}</ul>
            </div>` : ''
          }
        `;
        

        return;
    }

    // API real
    let location = appState.api.defaultLocation;
    if (appState.barrio && appState.api.barrios[appState.barrio]) {
        location = appState.api.barrios[appState.barrio];
    }
    const API_URL = `${appState.api.baseUrl}${location}${appState.api.format}`;
    console.log("Consultando API:", API_URL);

    fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Error HTTP ${res.status} - ${res.statusText}`);
      return res.text(); // leer como texto para detectar errores de texto plano
    })
    .then(text => {
      if (text.startsWith("Unknown location")) {
        throw new Error("Ubicación no reconocida. La API no puede proporcionar datos para esta zona.");
      }
  
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("La respuesta del servidor no se pudo interpretar como datos válidos.");
      }

        const current = data.current_condition[0];
        const weather = data.weather[0];
        const astronomy = weather.astronomy[0];
        const weatherCode = current.weatherCode || null;
        const windSpeed = current.windspeedKmph;
        const dewPoint     = current.DewPointC ?? weather.hourly[0].DewPointC;
        const windGustKmph = current.WindGustKmph ?? weather.hourly[0].WindGustKmph;
        const visibility   = current.visibility;

        let isDay = true;
        try {
            // Obtener horas actuales como números simples
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeInMinutes = currentHour * 60 + currentMinute;
            
            // Parsear sunrise y sunset directamente como números
            const parseSunTime = (timeStr) => {
                if (!timeStr || timeStr === "--:--") return null;
                const cleanTime = timeStr.replace(/\s*(AM|PM)/i, "");
                const [hours, minutes] = cleanTime.split(":").map(num => parseInt(num, 10));
                
                // Si hay AM/PM, ajustar horas
                let adjustedHours = hours;
                if (timeStr.includes("PM") && hours < 12) adjustedHours += 12;
                if (timeStr.includes("AM") && hours === 12) adjustedHours = 0;
                
                return adjustedHours * 60 + minutes; // Retornar minutos totales desde medianoche
            };
            
            const sunriseMinutes = parseSunTime(astronomy.sunrise);
            const sunsetMinutes = parseSunTime(astronomy.sunset);
            
            // Si los tiempos se parsearon correctamente
            if (sunriseMinutes !== null && sunsetMinutes !== null) {
                isDay = currentTimeInMinutes >= sunriseMinutes && currentTimeInMinutes < sunsetMinutes;
                console.log(`Determinación día/noche - Actual: ${currentTimeInMinutes} min, Amanecer: ${sunriseMinutes} min, Atardecer: ${sunsetMinutes} min, Es día: ${isDay}`);
            } else {
                // Fallback simple basado en horas del día
                isDay = currentHour >= 7 && currentHour < 20;
                console.log(`Fallback día/noche - Hora actual: ${currentHour}, Es día: ${isDay}`);
            }
        } catch (e) {
            console.error("Error en la determinación día/noche:", e);
            // Fallback muy simple
            const h = new Date().getHours();
            isDay = h >= 7 && h < 20;
        }

        const clima = {
            desc: current.lang_es?.[0]?.value || current.weatherDesc?.[0]?.value || "Desconocido",
            temp: current.temp_C,
            feelsLike: current.FeelsLikeC,
            humidity: current.humidity,
            dewPoint,
            uvIndex: current.uvIndex,
            cloudCover: current.cloudcover,
            windGustKmph,
            visibility,
            chanceofrain: weather.hourly.slice(0, 5).map(h => h.chanceofrain || "0"),
            updatedAt: formatearHora(current.localObsDateTime || Date.now()),
            sunrise: convertirA24h(astronomy?.sunrise || "--:--"),
            sunset: convertirA24h(astronomy?.sunset || "--:--"),
            weatherCode,
            windSpeed,
            isDay: current.isday === "yes"
          };
          
          

        console.log("Clima procesado:", clima);

        // Pasar el objeto clima completo
        actualizarUI(clima);
        aplicarEstilosClima(clima);

        const advice = getRunningAdviceFromClima(clima);

        const desfavorables = (advice.detallesDesfavorables || []).map(txt => `<li class="desfavorable">${txt}</li>`).join('');
        const favorables = (advice.detallesFavorables || []).map(txt => `<li class="favorable">${txt}</li>`).join('');
        
        document.getElementById('runningTitle').textContent = advice.title;
        document.getElementById('runningMessage').textContent = advice.message;
        
        document.getElementById('runningDetails').innerHTML = `
          ${desfavorables ? `
            <div class="bloque-condicion">
              <h4 class="condicion-titulo">⚠️ Condiciones desfavorables</h4>
              <ul class="desfavorables">${desfavorables}</ul>
            </div>` : ''
          }
          ${favorables ? `
            <div class="bloque-condicion">
              <h4 class="condicion-titulo">✅ Condiciones favorables</h4>
              <ul class="favorables">${favorables}</ul>
            </div>` : ''
          }
        `;        

      })
      .catch(error => {
        console.error("Error al obtener o procesar el clima:", error);
      
        // Mostrar mensaje de error al usuario
        if (appState.dom.respuesta) {
          appState.dom.respuesta.innerHTML = `
            <div class='error'>
              ⚠️ No se pudo obtener información del clima.<br>
              <small>${error.message}</small><br><br>
              <button id="boton-reintentar" class="boton-reintentar">🔄 Reintentar</button>
            </div>`;
        }
      
        // Ocultar toda la información excepto #app
        const elementosAEsconder = [
        '.weather-card.running-advice',
        '#prevision',
        '#info-clima',
        '#alerta-paraguas',
        '#mock-menu'
        ];
  
        elementosAEsconder.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';
        });
      
        // Fondo neutro
        aplicarEstilosClima({ weatherCode: null, desc: 'Error', isDay: true });
      
        // Limpiar campos
        if (appState.dom.humedad) appState.dom.humedad.textContent = "";
        if (appState.dom.sensacion) appState.dom.sensacion.textContent = "";
        if (appState.dom.salidaSol) appState.dom.salidaSol.textContent = "";
        if (appState.dom.puestaSol) appState.dom.puestaSol.textContent = "";
        if (appState.dom.horasLluvia) appState.dom.horasLluvia.innerHTML = "---";
        if (appState.dom.infoClima) appState.dom.infoClima.textContent = "Actualizado: --:--";
      
        // Activar botón de reintentar
        setTimeout(() => {
          const boton = document.getElementById("boton-reintentar");
          if (boton) {
            boton.addEventListener("click", () => {
              boton.disabled = true;
              boton.textContent = "Consultando...";
              obtenerClima(); // Recarga la consulta
            });
          }
        }, 0);
      });
    }

// --- ACTUALIZACIÓN DE LA INTERFAZ (UI) ---

function actualizarUI(clima) {
    // Comprobaciones de seguridad
    if (!appState.dom.respuesta || !appState.dom.humedad || !appState.dom.sensacion ||
        !appState.dom.horasLluvia || !appState.dom.infoClima || !appState.dom.salidaSol ||
        !appState.dom.puestaSol) {
      console.error("Error Crítico: Falta uno o más elementos del DOM en actualizarUI.");
      return;
    }
  
    const { desc, temp, feelsLike, humidity, chanceofrain, updatedAt, sunrise, sunset, weatherCode, isDay } = clima;
    const { emoji } = getWeatherInfoFromCode(weatherCode, desc, isDay);
    const esMalTiempo = /rain|thunder|snow|lluvia|tormenta|nieve/i.test(desc);
  
    const mensajeClima = esMalTiempo
      ? `Sí, ${desc.toLowerCase()}.`
      : `No, ${desc.toLowerCase()}.`;
  
    appState.dom.respuesta.innerHTML = `
      <div class='emoji'>${emoji}</div>
      <div class='temp'>${temp}°C</div>
      <div class='texto'>${mensajeClima}</div>`;
    appState.dom.humedad.textContent = `Humedad: ${humidity}%`;
    appState.dom.sensacion.textContent = `Sensación: ${feelsLike}°C`;
  
    actualizarHorasLluvia(clima.chanceofrain);
  
    appState.dom.infoClima.textContent = `Actualizado: ${updatedAt}`;
    appState.dom.salidaSol.innerHTML = `<i class="wi wi-sunrise"></i> ${sunrise}`;
    appState.dom.puestaSol.innerHTML = `<i class="wi wi-sunset"></i> ${sunset}`;
  
// ——— Alerta de paraguas robusta y coherente ———
const alerta = appState.dom.alertaParaguas || document.getElementById("alerta-paraguas");

const chanceRainArray = Array.isArray(clima.chanceofrain)
  ? clima.chanceofrain.map(p => parseInt(p, 10))
  : [];

const lluviaActualPorPrecipitacion = parseFloat(clima.precipMM) > 0;
const lluviaActualPorDescripcion = /lluvia|rain|tormenta|chubasc|shower/i.test(clima.desc || "");
const lluviaActual = lluviaActualPorPrecipitacion || lluviaActualPorDescripcion;

const lluviaFuturaIndex = chanceRainArray.findIndex(p => p >= 50);

let mensajeParaguas = "";

if (lluviaActual && lluviaFuturaIndex >= 0) {
  mensajeParaguas = "Está lloviendo y seguirá lloviendo. Si sales ahora, lleva paraguas.";
} else if (lluviaActual) {
  mensajeParaguas = "Está lloviendo actualmente. Lleva paraguas si vas a salir.";
} else if (lluviaFuturaIndex >= 0) {
  mensajeParaguas = `Parece que va a llover en ${lluviaFuturaIndex + 1} h. ¡Lleva paraguas si sales!`;
}

if (mensajeParaguas) {
  alerta.innerHTML = `
    <img src="weather-icons/line/umbrella.svg" class="weather-icon-small">
    ${mensajeParaguas}`;
  alerta.style.display = "block";
} else {
  alerta.style.display = "none";
}

  
    setupEmojiClickDetector();
  }
  

// Visualización mejorada de previsión por horas
function actualizarHorasLluvia(chanceofrain) {
    if (!appState.dom.horasLluvia) return;
    
    const horaActual = new Date();
    const diaActual = horaActual.getDate();
    
    // Procesar cada previsión de lluvia
    const previsionesHTML = chanceofrain.map((val, i) => {
        // Calcular la hora para esta previsión
        const horaPrediccion = new Date(horaActual);
        horaPrediccion.setHours(horaActual.getHours() + (i + 1) * 3);
        
        // Determinar si es hoy o mañana
        const esMañana = horaPrediccion.getDate() !== diaActual;
        
        // Formatear hora (ejemplo: 15:00)
        const horaStr = horaPrediccion.getHours().toString().padStart(2, '0');
        const textoHora = esMañana 
            ? `${horaStr}h <span class="dia-prevision">mañana</span>` 
            : `${horaStr}h <span class="dia-prevision">hoy</span>`;
        
        // Calcular probabilidad de lluvia
        const probabilidad = parseInt(val, 10);
        
        // Determinar estilo e icono según probabilidad
        let iconoSrc, clase;
        if (probabilidad >= 70) {
            iconoSrc = "weather-icons/line/rain.svg";
            clase = 'prob-alta';
        } else if (probabilidad >= 30) {
            iconoSrc = "weather-icons/line/partly-cloudy-day-drizzle.svg";
            clase = 'prob-media';
        } else {
            iconoSrc = "weather-icons/line/clear-day.svg";
            clase = 'prob-baja';
        }
        
        // Crear HTML para esta previsión
        return `
            <div class="hora-prevision ${clase}">
                <div class="hora-valor">${textoHora}</div>
                <div class="hora-icono">
                    <img src="${iconoSrc}" alt="Previsión" class="weather-icon-hour">
                </div>
                <div class="porcentaje">${val}%</div>
            </div>
        `;
    }).join("");
    
    appState.dom.horasLluvia.innerHTML = previsionesHTML;
}

// Obtiene info mapeada de weatherCode con fallback
function getWeatherInfoFromCode(code, description, isDay) {
    let info = weatherCodeMap[code] || null;

    if (!info) {
        const descLower = description?.toLowerCase() || ""; // Añadir seguridad por si description es null/undefined
        const fallbackKey = Object.keys(weatherCodeMap).find(key =>
            key !== 'default' && key !== '113' &&
            (descLower.includes(key) ||
             (weatherCodeMap[key].clase && descLower.includes(weatherCodeMap[key].clase.replace('fondo-', ''))))
        );

        if (fallbackKey) {
            console.warn(`WeatherCode '${code}' no mapeado, usando fallback por descripción -> ${fallbackKey}`);
            info = weatherCodeMap[fallbackKey];
        } else {
            // Solo loguear si no es un error intencional
            if (descLower !== 'error') {
                 console.warn(`WeatherCode '${code}' y descripción '${description}' no mapeados, usando default.`);
            }
            info = weatherCodeMap['default'];
        }
    }

    // Manejo día/noche
    // Asegurarse que 'info' no es null aquí antes de acceder a sus propiedades
    if (info && info.isDaySensitive && !isDay) {
        return {
            emoji: info.nightEmoji || info.emoji,
            clase: info.nightClase || info.clase,
            script: info.script,
            canvas: info.canvas // <-- Corregido: Debe ser el ID del canvas ('particles' o 'rain')
        };
    }

    // Devolver copia o el default si info sigue siendo null
    return info ? { ...info } : { ...weatherCodeMap['default'] };
}


// --- GESTIÓN DE ESTILOS Y EFECTOS VISUALES ---

function aplicarEstilosClima(clima) {
    if (!clima) {
        console.error("aplicarEstilosClima llamado sin objeto clima");
        clima = { weatherCode: null, desc: 'Error', isDay: true }; // Objeto por defecto para evitar más errores
    };

    const { clase, script, canvas } = getWeatherInfoFromCode(clima.weatherCode, clima.desc, clima.isDay);

    console.log(`Aplicando Estilos/Efecto: Clase=${clase}, Script=${script}, Canvas=${canvas}`);

    requestAnimationFrame(() => {
        // Comprobar si body existe
        if(appState.dom.body) {
            appState.dom.body.className = clase || 'fondo-default';
        } else {
            console.error("Error: appState.dom.body es null en aplicarEstilosClima");
        }
    });

    gestionarCanvasEfecto(canvas, script); // 'canvas' aquí es el ID del canvas ('particles' o 'rain')

    // Añadir clase al logo según clima
    if (appState.dom.logo) {
    // Quitar clases anteriores
    appState.dom.logo.classList.remove('climate-sun', 'climate-rain', 'climate-snow', 'climate-night');
    
    // Añadir clase según clima actual
    if (clase === 'fondo-sun') appState.dom.logo.classList.add('climate-sun');
    else if (clase === 'fondo-rain' || clase === 'fondo-storm') appState.dom.logo.classList.add('climate-rain');
    else if (clase === 'fondo-snow') appState.dom.logo.classList.add('climate-snow');
    else if (clase === 'fondo-clear-night') appState.dom.logo.classList.add('climate-night');
}
}

// Gestiona la limpieza y carga de scripts de efectos
function gestionarCanvasEfecto(targetCanvasId, scriptSrc) {
    console.log(`Iniciando efecto con canvas=${targetCanvasId}, script=${scriptSrc}`); // Añade este log

    // Limpiar todos los canvas y animaciones
    ['particles', 'rain', 'weather-canvas'].forEach(type => {
        // Necesitamos normalizar los IDs de referencia
        let canvasKey, animKey;
        
        if (type === 'weather-canvas') {
            canvasKey = 'weatherCanvas';
            animKey = 'weather';
        } else {
            canvasKey = `${type}Canvas`;
            animKey = type;
        }
        
        const canvas = appState.dom[canvasKey];
        const animId = appState.activeAnimationIds[animKey];
        
        if (canvas) {
            canvas.style.opacity = "0";
            canvas.style.display = "none";
            canvas.dataset.active = "false";
            if (animId) {
                console.log(`Cancelando animación para ${type}, ID=${animId}`);
                cancelAnimationFrame(animId);
                appState.activeAnimationIds[animKey] = null;
            }
        }
    });

    if (appState.lightningIntervalId) {
        console.log(`Limpiando intervalo de rayos (ID=${appState.lightningIntervalId})`);
        clearInterval(appState.lightningIntervalId);
        appState.lightningIntervalId = null;
    }

    if (appState.activeEffectScript && appState.activeEffectScript.parentNode) {
        appState.activeEffectScript.parentNode.removeChild(appState.activeEffectScript);
        appState.activeEffectScript = null;
    }

    if (!scriptSrc || !targetCanvasId) {
        console.log("No hay script de efecto para cargar o targetCanvasId no especificado.");
        return;
    }

    // Normaliza las referencias para obtener el canvas correcto
    let targetCanvasKey;
    if (targetCanvasId === 'weather-canvas') {
        targetCanvasKey = 'weatherCanvas';
    } else {
        targetCanvasKey = `${targetCanvasId}Canvas`;
    }
    
    const targetCanvas = appState.dom[targetCanvasKey];
    
    console.log(`Buscando canvas con clave: ${targetCanvasKey}`);
    
    if (!targetCanvas) {
        console.error(`Canvas con ID ${targetCanvasId} no encontrado en appState.dom.`);
        return;
    }

    // El resto de la función sigue igual
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => {
        console.log(`Script ${scriptSrc} cargado.`);
        targetCanvas.style.display = 'block';
        setTimeout(() => targetCanvas.style.opacity = "1", 50);
    };
    script.onerror = () => console.error(`Error al cargar script: ${scriptSrc}`);

    document.body.appendChild(script);
    appState.activeEffectScript = script;
}


// --- GESTIÓN DE MENÚS Y EVENTOS ---
function crearMenuBarrio() {
    const menu = document.createElement("div");
    menu.id = "barrio-menu";
    menu.innerHTML = `<label id="barrio-label">📍 ¿Desde qué barrio miras al cielo?</label><div id="barrio-options" role="group" aria-labelledby="barrio-label"></div>`;
    document.body.appendChild(menu);
    appState.dom.barrioMenu = menu;
    const optionsContainer = menu.querySelector("#barrio-options");
    Object.keys(appState.api.barrios).forEach(key => {
        const button = document.createElement("button");
        button.dataset.barrio = key;
        button.textContent = key === 'cuchillo' ? '🔪' : (key === 'elfo' ? '🧝' : key);
        button.setAttribute("aria-label", `Consultar clima para Barrio ${key.charAt(0).toUpperCase() + key.slice(1)}`);
        button.addEventListener("click", () => { 
            if (appState.barrio !== key) {
                // NUEVO: Desactivar clima simulado al cambiar de barrio
                if (appState.mockClima) {
                    appState.mockClima = "";
                    // Resetear el select visual
                    if (appState.dom.mockSelect) {
                        appState.dom.mockSelect.value = "";
                    }
                }
                appState.barrio = key;
                transicionBarrio();
                obtenerClima();
            }
            toggleMenuBarrio(false);
        });
        optionsContainer.appendChild(button);
    });
    
    const madridButton = document.createElement("button");
    madridButton.dataset.barrio = "";
    madridButton.textContent = "🧸";
    madridButton.setAttribute("aria-label", "Consultar clima para Madrid centro");
    madridButton.addEventListener("click", () => {
        if (appState.barrio !== "") {
            // NUEVO: Desactivar clima simulado también para Madrid centro
            if (appState.mockClima) {
                appState.mockClima = "";
                // Resetear el select visual
                if (appState.dom.mockSelect) {
                    appState.dom.mockSelect.value = "";
                }
            }
            appState.barrio = "";
            transicionBarrio();
            obtenerClima();
        }
        toggleMenuBarrio(false);
    });
    optionsContainer.appendChild(madridButton);
}

function toggleMenuBarrio(forceState = null) { 
    const menu = appState.dom.barrioMenu; 
    const shouldBeVisible = forceState !== null ? forceState : !appState.menuBarrioVisible; 
    menu.classList.toggle("visible", shouldBeVisible); 
    appState.menuBarrioVisible = shouldBeVisible; 
}

function toggleMenuMock(forceState = null) { 
    const menu = appState.dom.mockMenu; 
    if (!menu) return;
    
    const shouldBeVisible = forceState !== null ? forceState : !appState.menuMockVisible; 
    
    // Guardar estado anterior para comparar después
    const estadoAnterior = appState.menuMockVisible;
    
    // Actualizar UI
    menu.classList.toggle("visible", shouldBeVisible); 
    menu.style.display = shouldBeVisible ? "block" : "none";
    
    // Actualizar estado
    appState.menuMockVisible = shouldBeVisible; 
    
    // Solo refrescar si CAMBIAMOS el valor de mockClima, no al cerrar el menú
    if (estadoAnterior && !shouldBeVisible && appState.mockClima) {
        // No hacemos nada, conservamos el modo simulado actual
        console.log("Cerrando menú mock, manteniendo simulación: " + appState.mockClima);
    }
}

function handleShake(e) { 
    const acc = e.accelerationIncludingGravity; 
    if (!acc || acc.x === null) return; 
    
    const fuerza = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z); 
    const umbral = 25; 
    const cooldown = 800; 
    const now = Date.now(); 
    
    if (fuerza > umbral && !appState.haVibradoYa && (now - appState.lastShake > cooldown)) { 
        console.log("Shake detectado!"); 
        appState.haVibradoYa = true; 
        appState.lastShake = now; 
        toggleMenuBarrio(); 
        
        if (navigator.vibrate) navigator.vibrate(100); 
        
        setTimeout(() => { 
            appState.haVibradoYa = false; 
        }, cooldown); 
    } 
}

function actualizarTitulo() { 
    let titulo = "¿Llueve en Madrid?"; 
    
    if (appState.barrio === "cuchillo") {
        titulo = "¿Llueve en el barrio navajero?"; 
    } else if (appState.barrio === "elfo") {
        titulo = "¿Llueve en el barrio elfo?"; 
    }
    
    if(appState.dom.logo) {
        appState.dom.logo.textContent = titulo; 
    }
}

function transicionBarrio() { 
    if(!appState.dom.body) return; 
    
    appState.dom.body.style.transition = 'opacity 0.2s ease-in-out'; 
    appState.dom.body.style.opacity = 0.7; 
    
    setTimeout(() => { 
        appState.dom.body.style.opacity = 1; 
        setTimeout(() => { 
            appState.dom.body.style.transition = 'var(--transition-bg)'; 
        }, 200); 
    }, 200); 
}

// Contador para detectar múltiples clics en el emoji
let emojiClickCount = 0;
let emojiClickTimer = null;

function setupEmojiClickDetector() {
    const emojiContainer = document.querySelector('#respuesta .emoji');
    
    if (emojiContainer) {
        emojiContainer.style.cursor = 'pointer';
        
        emojiContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Incrementar contador para ambos casos (abrir o cerrar)
            emojiClickCount++;
            
            // Reiniciar el temporizador en cada clic
            clearTimeout(emojiClickTimer);
            
            // Si se alcanza el umbral de 5 clics
            if (emojiClickCount >= 5) {
                emojiClickCount = 0; // Resetear contador
                
                // Alternar el estado del menú (abrir si está cerrado, cerrar si está abierto)
                toggleMenuMock(!appState.menuMockVisible);
                
                // Animación de feedback (diferente según se abra o cierre)
                if (emojiContainer.querySelector('img')) {
                    // Si estamos abriendo, girar en sentido normal
                    // Si estamos cerrando, girar en sentido inverso
                    const animationDirection = appState.menuMockVisible ? '' : 'reverse';
                    emojiContainer.querySelector('img').style.animation = `spin 0.5s ease-in-out ${animationDirection}`;
                    
                    // Restaurar animación flotante después
                    setTimeout(() => {
                        if (emojiContainer.querySelector('img')) {
                            emojiContainer.querySelector('img').style.animation = 'floatIcon 3s ease-in-out infinite';
                        }
                    }, 500);
                }
            } else {
                // Proporcionar feedback visual sutil del progreso
                if (emojiContainer.querySelector('img')) {
                    // Pequeño pulso para cada clic
                    emojiContainer.querySelector('img').style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        if (emojiContainer.querySelector('img')) {
                            emojiContainer.querySelector('img').style.transform = '';
                        }
                    }, 100);
                }
                
                // Mostrar cuántos clics faltan (opcional)
                console.log(`Clics: ${emojiClickCount}/5`);
                
                // Reiniciar contador después de 3 segundos sin clics
                emojiClickTimer = setTimeout(() => {
                    emojiClickCount = 0;
                }, 3000);
            }
        });
    }
}

function getRunningAdviceFromClima(clima) {
    const parse = (val, fallback = 0) => isNaN(parseFloat(val)) ? fallback : parseFloat(val);
    const parseIntSafe = (val, fallback = 0) => isNaN(parseInt(val)) ? fallback : parseInt(val);
  
    const t    = parse(clima.temp);
    const f    = parse(clima.feelsLike);
    const h    = parseIntSafe(clima.humidity);
    const d    = parse(clima.dewPoint);
    const rain = parse(clima.precipMM || clima.chanceofrain?.[0]);
    const code = parseIntSafe(clima.weatherCode);
    const w    = parse(clima.windSpeed);
    const gust = parse(clima.windGustKmph);
    const uv   = parseIntSafe(clima.uvIndex);
    const c    = parseIntSafe(clima.cloudCover);
    const vis  = parse(clima.visibility);
    const hr   = new Date(clima.localObsDateTime || Date.now()).getHours();
    const desc = (clima.desc || "").toLowerCase();
  
    const requiredValues = { t, f, h, d, rain, code, w, gust, uv, c, vis };
  
    for (const [key, val] of Object.entries(requiredValues)) {
      if (isNaN(val)) {
        return {
          level: 'peligroso',
          title: '❌ No se puede evaluar',
          message: 'Faltan datos clave del clima para valorar la situación.',
          detallesDesfavorables: [`Falta información clave para evaluar el clima (${key})`],
          detallesFavorables: []
        };
      }
    }
  
    const rainCodes = [176,263,266,281,284,293,296,299,302,305,308,311,314,353,356,359,362,365,377];
    const isGoodHour = (hr >= 6 && hr <= 10) || (hr >= 18 && hr <= 21);
    const isDaytime = hr >= 11 && hr <= 17;
  
    let criticalFails = 0;
    let moderateFails = 0;
    let flagSensacionCritica = false;
  
    const favorables = [];
    const desfavorables = [];
  
    const condiciones = [
      {
        tipo: 'crítico',
        condicion: rain > 0 || rainCodes.includes(code) || /lluvia|rain/.test(desc),
        desfavorable: `🌧️ Está lloviendo ahora: ${clima.desc}. Correr bajo la lluvia puede provocar resbalones, ropa empapada o incomodidad térmica.`,
        favorable: `🌤️ No llueve (precipitación: ${rain} mm). El suelo está seco y no hay riesgo de lluvia inmediata.`
      },
      {
        tipo: 'crítico',
        condicion: f > 28,
        desfavorable: `🔥 Sensación térmica muy alta (${f} °C). Por encima de 28 °C hay riesgo de sobrecalentamiento.`,
        onFail: () => flagSensacionCritica = true
      },
      {
        tipo: 'crítico',
        condicion: f < 5 && w > 20,
        desfavorable: `❄️ Frío con viento: sensación de ${f} °C, viento de ${w} km/h. Riesgo de rigidez muscular.`,
        onFail: () => flagSensacionCritica = true
      },
      {
        tipo: 'crítico',
        condicion: vis < 2,
        desfavorable: `🌫️ Visibilidad muy baja (${vis} km). Riesgo al correr en zonas poco iluminadas o con tráfico.`,
        favorable: `👁️ Buena visibilidad: ${vis} km. Puedes correr con seguridad.`
      },
      {
        tipo: 'moderado',
        condicion: h > 85,
        desfavorable: `💦 Humedad alta (${h}%). El sudor se evapora mal, lo que dificulta la regulación térmica.`,
        favorable: `💧 Humedad adecuada: ${h}%. Buena capacidad del cuerpo para enfriarse.`
      },
      {
        tipo: 'moderado',
        condicion: gust > 30,
        desfavorable: `💨 Rachas de viento intensas (hasta ${gust} km/h). Podrían desestabilizar o aumentar el esfuerzo.`,
        favorable: `🌬️ Rachas suaves: ${gust} km/h. Cómodo para correr.`
      },
      {
        tipo: 'moderado',
        condicion: uv > 8,
        desfavorable: `☀️ Radiación UV alta (${uv}). Usa protección solar si corres al sol.`,
        favorable: `🧴 Radiación UV moderada: ${uv}. Bajo riesgo para la piel.`
      },
      {
        tipo: 'moderado',
        condicion: (t > 20 || f > 22) && !isGoodHour && isDaytime,
        desfavorable: `🕒 Hora no ideal con calor (${hr} h). Mejor correr temprano o al final del día.`,
        favorable: `🕘 Hora adecuada: ${hr} h. Buen momento para evitar calor excesivo.`
      },
      {
        tipo: 'moderado',
        condicion: t - d < 2,
        desfavorable: `🌫️ Aire muy húmedo (rocío: ${d} °C). El sudor se evapora mal y puede generar incomodidad.`,
        favorable: `🌬️ Aire seco (rocío: ${d} °C). Buena transpiración.`
      },
      {
        tipo: 'informativo',
        condicion: t < 10 || t > 25,
        desfavorable: `🌡️ Temperatura fuera del rango ideal (${t} °C). Aunque es tolerable, el cuerpo rinde mejor entre 10 °C y 25 °C.`,
        favorable: `🌡️ Temperatura ideal: ${t} °C. Buena para el rendimiento.`
      }
    ];
  
    for (const { tipo, condicion, desfavorable, favorable, onFail } of condiciones) {
      if (condicion) {
        if (tipo !== 'informativo') {
          tipo === 'crítico' ? criticalFails++ : moderateFails++;
        }
        if (typeof onFail === 'function') onFail();
        if (desfavorable) desfavorables.push(desfavorable);
      } else if (favorable) {
        favorables.push(favorable);
      }
    }
  
    // Añadir sensación térmica cómoda si no hubo advertencia
    if (!flagSensacionCritica) {
      favorables.push(`🌡️ Sensación térmica cómoda: ${f} °C. No hay riesgo térmico actual.`);
    }
  
    // Nubosidad (añadida siempre como favorable neutra)
    if (c <= 10) {
      favorables.push(`🌞 Cielo despejado (${c}% de nubosidad). Alta exposición solar.`);
    } else if (c >= 90) {
      favorables.push(`☁️ Cielo totalmente cubierto (${c}% de nubosidad). Ayuda a evitar calor solar.`);
    } else {
      favorables.push(`🌤️ Nubosidad parcial (${c}% de nubosidad). Equilibrio entre sombra y luz.`);
    }
  
    // Resultado final con división clara
    if (criticalFails > 0) {
      return {
        level: 'peligroso',
        title: '❌ No es seguro correr ahora',
        message: 'Hay condiciones que pueden poner en riesgo tu salud.',
        detallesDesfavorables: desfavorables,
        detallesFavorables: favorables
      };
    }
  
    if (moderateFails >= 2) {
      return {
        level: 'precaución',
        title: '⚠️ Puedes correr, pero con precauciones',
        message: 'Algunos factores podrían incomodar o afectar tu rendimiento.',
        detallesDesfavorables: desfavorables,
        detallesFavorables: favorables
      };
    }
  
    return {
      level: 'ideal',
      title: '✅ Perfecto para correr',
      message: 'Todo indica que puedes salir a correr sin problema.',
      detallesDesfavorables: [],
      detallesFavorables: favorables
    };
  }
  