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
        rain: null // <--- ID CORREGIDO
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
const weatherCodeMap = {
    '113': { emoji: '☀️', clase: 'fondo-sun', script: 'particles.js', canvas: 'particles', isDaySensitive: true, nightEmoji: '🌙', nightClase: 'fondo-clear-night' },
    '116': { emoji: '🌤️', clase: 'fondo-clouds', script: 'clouds.js', canvas: 'particles' },
    '119': { emoji: '☁️', clase: 'fondo-clouds', script: 'clouds.js', canvas: 'particles' },
    '122': { emoji: '🌥️', clase: 'fondo-clouds', script: 'clouds.js', canvas: 'particles' },
    '143': { emoji: '🌫️', clase: 'fondo-fog', script: 'fog.js', canvas: 'particles' },
    '248': { emoji: '🌫️', clase: 'fondo-fog', script: 'fog.js', canvas: 'particles' },
    '260': { emoji: '🌫️', clase: 'fondo-fog', script: 'fog.js', canvas: 'particles' },
    '120': { emoji: '🌫️', clase: 'fondo-fog', script: 'fog.js', canvas: 'particles' },
    '176': { emoji: '🌦️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' }, // Usa canvas 'rain'
    '263': { emoji: '🌦️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '266': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '281': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '293': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '296': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '353': { emoji: '🌦️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '185': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '299': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '302': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '305': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '308': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '311': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '314': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '356': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '359': { emoji: '🌧️', clase: 'fondo-rain', script: 'rain.js', canvas: 'rain' },
    '179': { emoji: '🌨️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '182': { emoji: '🌨️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '227': { emoji: '🌬️❄️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '230': { emoji: '🌬️❄️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '317': { emoji: '🌨️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '320': { emoji: '🌨️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '323': { emoji: '❄️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '326': { emoji: '❄️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '329': { emoji: '❄️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '332': { emoji: '❄️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '335': { emoji: '❄️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '338': { emoji: '❄️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '350': { emoji: '🧊', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '368': { emoji: '🌨️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '371': { emoji: '🌨️', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '374': { emoji: '🧊', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '377': { emoji: '🧊', clase: 'fondo-snow', script: 'snow.js', canvas: 'particles' },
    '200': { emoji: '⛈️', clase: 'fondo-storm', script: 'storm.js', canvas: 'rain' }, // Usa canvas 'rain'
    '386': { emoji: '⛈️', clase: 'fondo-storm', script: 'storm.js', canvas: 'rain' },
    '389': { emoji: '⛈️', clase: 'fondo-storm', script: 'storm.js', canvas: 'rain' },
    '392': { emoji: '⛈️❄️', clase: 'fondo-storm', script: 'storm.js', canvas: 'rain' },
    '395': { emoji: '⛈️❄️', clase: 'fondo-storm', script: 'storm.js', canvas: 'rain' },
    'default': { emoji: '☁️', clase: 'fondo-clouds', script: 'clouds.js', canvas: 'particles' }
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
        else if (key === "c") toggleMenuMock();
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
          // Si es un timestamp numérico, usarlo directamente
          const fecha = typeof fechaStr === 'number' ? new Date(fechaStr) : 
                       // Si parece una fecha ISO, intentar ajustarla
                       fechaStr.includes('T') ? new Date(fechaStr.replace(/-/g, '/').replace('T', ' ')) :
                       // De lo contrario, crear fecha actual
                       new Date();
          
          // Usar método más básico y compatible
          const horas = fecha.getHours().toString().padStart(2, '0');
          const minutos = fecha.getMinutes().toString().padStart(2, '0');
          return `${horas}:${minutos}`;
        } catch (error) {
          console.error("Error al formatear hora:", error);
          // Fallback a hora actual si hay error
          const ahora = new Date();
          return `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
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
        return res.json();
      })
      .then(data => {
        if (!data?.current_condition?.[0] || !data?.weather?.[0]?.hourly || !data?.weather?.[0]?.astronomy?.[0]) {
          throw new Error("Formato de datos inesperado recibido de la API.");
        }

        const current = data.current_condition[0];
        const weather = data.weather[0];
        const astronomy = weather.astronomy[0];
        const weatherCode = current.weatherCode || null;

        let isDay = true;
        try {
            const observationTime = new Date(current.localObsDateTime || Date.now());
        
            const parseTimeToDate = (timeStr) => {
                if (!timeStr) throw new Error("Invalid time string for parsing");
                
                // Convertimos primero a formato 24h para simplicidad
                const hora24h = convertirA24h(timeStr);
                const [h, m] = hora24h.split(":").map(Number);
                
                const date = new Date();
                date.setHours(h, m, 0, 0);
                return date;
            };
        
            const sunriseDate = parseTimeToDate(astronomy.sunrise);
            const sunsetDate = parseTimeToDate(astronomy.sunset);
        
            isDay = observationTime >= sunriseDate && observationTime < sunsetDate;
        } catch (e) {
            console.error("Error parsing sunrise/sunset times:", e);
            const h = new Date().getHours();
            isDay = h > 6 && h < 20;
        }

        const clima = {
          desc: current.lang_es?.[0]?.value || current.weatherDesc?.[0]?.value || "Desconocido",
          temp: current.temp_C,
          feelsLike: current.FeelsLikeC,
          humidity: current.humidity,
          chanceofrain: weather.hourly.slice(0, 5).map(h => h.chanceofrain || "0"),
          updatedAt: formatearHora(current.localObsDateTime || Date.now()),
          sunrise: convertirA24h(astronomy?.sunrise || "--:--"),
          sunset: convertirA24h(astronomy?.sunset || "--:--"),
          weatherCode: weatherCode,
          isDay: isDay
        };

        console.log("Clima procesado:", clima);
        // Pasar el objeto clima completo
        actualizarUI(clima);
        aplicarEstilosClima(clima);
      })
      .catch(error => {
        console.error("Error al obtener o procesar el clima:", error);
        if(appState.dom.respuesta) {
             appState.dom.respuesta.innerHTML = `<div class='error'>No se pudo cargar el clima.<br><small>${error.message}</small></div>`;
        }
        aplicarEstilosClima({ weatherCode: null, desc: 'Error', isDay: true }); // Aplicar estilo de error
        // Limpia campos (comprobando si existen antes)
        if(appState.dom.humedad) appState.dom.humedad.textContent = "";
        if(appState.dom.sensacion) appState.dom.sensacion.textContent = "";
        if(appState.dom.salidaSol) appState.dom.salidaSol.textContent = "";
        if(appState.dom.puestaSol) appState.dom.puestaSol.textContent = "";
        if(appState.dom.horasLluvia) appState.dom.horasLluvia.innerHTML = "---";
        if(appState.dom.infoClima) appState.dom.infoClima.textContent = "Actualizado: --:--";
      });
}

// --- ACTUALIZACIÓN DE LA INTERFAZ (UI) ---

function actualizarUI(clima) { // Recibe el objeto clima completo
    // Comprobaciones de seguridad por si algún elemento del DOM es null
    if (!appState.dom.respuesta || !appState.dom.humedad || !appState.dom.sensacion ||
        !appState.dom.horasLluvia || !appState.dom.infoClima || !appState.dom.salidaSol ||
        !appState.dom.puestaSol) {
        console.error("Error Crítico: Falta uno o más elementos del DOM en actualizarUI. Revisa cacheDomElements y el HTML.");
        return; // No continuar si faltan elementos esenciales
    }

    const { desc, temp, feelsLike, humidity, chanceofrain, updatedAt, sunrise, sunset, weatherCode, isDay } = clima;
    const { emoji } = getWeatherInfoFromCode(weatherCode, desc, isDay);
    const esMalTiempo = emoji === '🌧️' || emoji === '⛈️' || emoji === '❄️' || emoji === '🌨️' || /rain|thunder|snow|lluvia|tormenta|nieve/i.test(desc);

    const mensaje = esMalTiempo
        ? `Sí, ${desc.toLowerCase()}.`
        : `No, ${desc.toLowerCase()}.`;

    appState.dom.respuesta.innerHTML = `
        <div class='emoji'>${emoji}</div>
        <div class='temp'>${temp}°C</div>
        <div class='texto'>${mensaje}</div>`;
    appState.dom.humedad.textContent = `Humedad: ${humidity}%`;
    appState.dom.sensacion.textContent = `Sensación: ${feelsLike}°C`;

    actualizarHorasLluvia(clima.chanceofrain);


    appState.dom.infoClima.textContent = `Actualizado: ${updatedAt}`;
    appState.dom.salidaSol.textContent = `☀️ ${sunrise}`;
    appState.dom.puestaSol.textContent = `🌙 ${sunset}`;

    const alerta = appState.dom.alertaParaguas || document.getElementById("alerta-paraguas");
    const hayLluviaAlta = clima.chanceofrain.some(prob => parseInt(prob, 10) >= 50);
  
    if (hayLluviaAlta) {
      alerta.textContent = "☔ Parece que va a llover pronto. ¡Lleva paraguas!";
      alerta.style.display = "block";
    } else {
      alerta.style.display = "none";
    }    
}

// Visualización mejorada de previsión por horas
function actualizarHorasLluvia(chanceofrain) {
    if (!appState.dom.horasLluvia) return;
    
    const horaActual = new Date();
    const diaActual = horaActual.getDate();
    
    // Contenedor principal con layout flex
    const contenedor = document.createElement('div');
    contenedor.className = 'prevision-contenedor';
    
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
        
        // Determinar estilo según probabilidad
        let icono, clase;
        if (probabilidad >= 70) {
            icono = '🌧️';
            clase = 'prob-alta';
        } else if (probabilidad >= 30) {
            icono = '🌦️';
            clase = 'prob-media';
        } else {
            icono = '☀️';
            clase = 'prob-baja';
        }
        
        // Crear HTML para esta previsión
        return `
            <div class="hora-prevision ${clase}">
                <div class="hora-valor">${textoHora}</div>
                <div class="hora-icono">${icono}</div>
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
}

// Gestiona la limpieza y carga de scripts de efectos
function gestionarCanvasEfecto(targetCanvasId, scriptSrc) {
    // Corregido para usar los IDs correctos de appState.dom
    ['particles', 'rain'].forEach(type => {
        // El ID del canvas en HTML es el 'type' ('particles' o 'rain')
        // La referencia en appState.dom es `appState.dom[type + 'Canvas']`
        const canvas = appState.dom[`${type}Canvas`];
        // El ID de animación se guarda bajo la clave 'type' ('particles' o 'rain')
        const animId = appState.activeAnimationIds[type];
        if (canvas) {
            canvas.style.opacity = "0";
            canvas.style.display = "none";
            canvas.dataset.active = "false";
            if (animId) {
                cancelAnimationFrame(animId);
                appState.activeAnimationIds[type] = null;
            }
        }
    });

    if (appState.lightningIntervalId) {
        console.log(`gestionarCanvasEfecto: Limpiando intervalo de rayos (ID=${appState.lightningIntervalId})`);
        clearInterval(appState.lightningIntervalId);
        appState.lightningIntervalId = null;
    }

    if (appState.activeEffectScript && appState.activeEffectScript.parentNode) {
        appState.activeEffectScript.parentNode.removeChild(appState.activeEffectScript);
        appState.activeEffectScript = null;
    }

    if (!scriptSrc || !targetCanvasId) { // targetCanvasId es 'particles' o 'rain'
      console.log("No hay script de efecto para cargar o targetCanvasId no especificado.");
      return;
    }

    // Obtener la referencia correcta al elemento canvas
    const targetCanvas = appState.dom[`${targetCanvasId}Canvas`]; // Usa el ID para buscar en appState.dom
    if (!targetCanvas) {
        console.error(`Canvas con ID ${targetCanvasId} no encontrado en appState.dom.`);
        // Podríamos intentar buscarlo por ID directamente como fallback
        // const fallbackCanvas = document.getElementById(targetCanvasId);
        // if (!fallbackCanvas) {
        //     console.error(`Fallback getElementById(${targetCanvasId}) también falló.`);
        //     return;
        // }
        // targetCanvas = fallbackCanvas;
        return; // Salir si no se encuentra el canvas
    }

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
        button.addEventListener("click", () => { if (appState.barrio !== key) { appState.barrio = key; transicionBarrio(); obtenerClima(); } toggleMenuBarrio(false); });
        optionsContainer.appendChild(button);
    });
     const madridButton = document.createElement("button");
     madridButton.dataset.barrio = "";
     madridButton.textContent = "🧸";
     madridButton.setAttribute("aria-label", "Consultar clima para Madrid centro");
     madridButton.addEventListener("click", () => { if (appState.barrio !== "") { appState.barrio = ""; transicionBarrio(); obtenerClima(); } toggleMenuBarrio(false); });
     optionsContainer.appendChild(madridButton);
}

function toggleMenuBarrio(forceState = null) { 
    const menu = appState.dom.barrioMenu; 
    const shouldBeVisible = forceState !== null ? forceState : !appState.menuBarrioVisible; 
    menu.classList.toggle("visible", shouldBeVisible); 
    appState.menuBarrioVisible = shouldBeVisible; 
}

function toggleMenuMock() { 
    const menu = appState.dom.mockMenu; 
    appState.menuMockVisible = !appState.menuMockVisible; 
    menu.classList.toggle("visible", appState.menuMockVisible); 
    menu.style.display = appState.menuMockVisible ? "block" : "none"; 
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
        titulo = "¿Llueve en barrio elfo?"; 
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
