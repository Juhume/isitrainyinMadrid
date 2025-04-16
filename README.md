# ☁️ ¿Va a llover en Madrid?

**Una web minimalista, mágica y mobile-first que responde una sola pregunta con estilo:**  
**¿Va a llover en tu barrio de Madrid?**

---

## 🌦 ¿Qué hace esta web?

Te dice si va a llover **hoy**, en tu barrio favorito de Madrid.  
Pero lo hace de forma especial:

- Usa datos reales de una API de predicción meteorológica.
- Anima cada tipo de clima con efectos visuales distintos (lluvia, sol, niebla, nieve...).
- Incluye **alertas visuales** si necesitas paraguas.
- Ofrece una vista clara de la **previsión por horas**.
- Tiene un **modo simulado** para jugar con distintos climas (eso si, tendrás que buscarlo para la versión móvil).
- Y si agitas el móvil... 🪄 aparece el **menú secreto de barrios** (solo en Android).

---

## 🧙‍♂️ ¿Por qué?

Porque la mayoría de webs del tiempo son frías, genéricas y recargadas.  
Esta app es lo contrario: **simple y directa**  
Diseñada para usarse con una mano, en dos segundos.

---

## ⚙️ ¿Cómo funciona?

### 🔌 Datos

La web obtiene datos reales desde esta API:

- `https://wttr.in` (consultada desde `main.js`)

También incluye un **modo simulado (mock)** que puedes activar manualmente pulsando la tecla M en la versión escritorio.

---

### 🎨 Animaciones y visuales

Cada clima tiene su propio fondo dinámico con animaciones en canvas:

| Clima | Animación |
|-------|-----------|
| ☀️ Sol | `particles.js` |
| 🌧 Lluvia | `rain.js` |
| ❄️ Nieve | `snow.js` |
| 🌫 Niebla | `fog.js` |
| ⛈ Tormenta | `storm.js` |
| ☁️ Nublado | `clouds.js` |

Los estilos están en `styles.css`, usando `CSS custom properties` y gradientes dinámicos para cambiar el fondo según el clima.

---

## 📱 Totalmente responsive

Diseñada primero para móvil, pero también luce genial en escritorio.

- Sin scroll.
- Layout estable.
- Transiciones suaves.
- Interfaz clara, legible y sin ruido visual.

---

## 🚀 Cómo usar

```bash
git clone https://github.com/Juhume/isitrainyinMadrid.git
cd isitrainyinMadrid
```

Luego abre `index.html` en tu navegador.

> ⚠️ La app **no necesita claves de API** ni configuración extra. Todo funciona directamente desde el navegador.

---

## 🧪 Modo simulado

Puedes activar el modo simulado desde el menú inferior derecho o modificando `main.js`. Esto te permite ver cómo se comporta la interfaz con cualquier tipo de clima, sin esperar a que cambie el tiempo real.

---

## 🌐 Iconos del tiempo

Los iconos SVG vienen de la genial galería [Basmilius Weather Icons](https://basmilius.github.io/weather-icons/index-line.html) e integran perfectamente con el diseño de la app.

---

## ✨ Detalles técnicos

- HTML + CSS + JavaScript puro (sin frameworks).
- Animaciones con `requestAnimationFrame`.
- Datos en tiempo real desde Wttr.in.
- Canvas para efectos climáticos.
- Transiciones suaves entre estados visuales.
- Estructura modular, fácil de mantener.

---

## 👤 Autor

Hecho con cariño por [@Juhume](https://github.com/Juhume)  

Inspirado en el eterno marzo de 2025 con registros históricos de lluvia en Madrid.
