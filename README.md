# 🅿️ UTEQ Smart Parking — Monitoreo Telemático de Parqueadero Inteligente

Sistema web en tiempo real desarrollado para el monitoreo telemático y gestión inteligente de plazas de estacionamiento en el **Campus UTEQ (Quevedo)**. La plataforma visualiza el estado operativo de 80 sensores ultrasónicos distribuidos geométricamente en 4 columnas.

---

## 🚀 Características Principales

* **Monitoreo en Tiempo Real (RTDB):** Sincronización instantánea con Firebase Realtime Database.
* **Cuadrícula Operativa Interactiva (4x20):** 
  * 🟢 **Verde:** Espacio Libre / Disponible.
  * 🔴 **Rojo:** Espacio Ocupado (detecta vehículos a menos de 50 cm).
  * 🩶 **Gris:** Sensor Sin Información / Desconectado.
* **Filtros Avanzados:** Filtrado dinámico por estado (Todos / Libres / Ocupados) y por columna (A, B, C, D).
* **Panel de Sensor Seleccionado:** Muestra métricas detalladas de distancia (cm), umbral de proximidad, coordenadas geográficas y timestamp de actualización.
* **Historial Global de Eventos:** Registro cronológico acumulado de cambios de estado en todo el sistema.
* **Simulador Teórico de Eventos:** Botón integrado para simular lecturas y cambios de distancia/estado en tiempo real.
* **Mapa Geográfico Interactivo:** Vista satelital integrada con Google Maps basada en las coordenadas reales de las plazas.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React.js, Vite, JavaScript (ES6+), CSS3 (Inline styles / Flexbox & Grid).
* **Base de Datos & Backend:** Firebase Realtime Database.
* **Geolocalización:** Google Maps Embed API.

---

## 📂 Estructura del Proyecto

```text
uteq-smart-parking/
├── public/
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── hooks/              # Custom Hooks (useEspacios, useHistorialEspacio)
│   ├── pages/
│   │   └── Home.jsx        # Dashboard principal del parqueadero
│   ├── services/
│   │   ├── firebase.js     # Configuración e inicialización de Firebase
│   │   └── parkingGenerator.js  # Generador inicial de los 80 espacios
│   ├── App.jsx             # Punto de entrada de componentes
│   └── main.jsx            # Renderizado inicial de React
├── package.json
└── README.md
```

---

## 💻 Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/uteq-smart-parking.git](https://github.com/TU_USUARIO/uteq-smart-parking.git)
   cd uteq-smart-parking
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (`.env`):**
   Crea un archivo `.env` en la raíz con tus credenciales de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_DATABASE_URL=[https://tu-proyecto.firebaseio.com](https://tu-proyecto.firebaseio.com)
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🎓 Créditos

Proyecto desarrollado para el **Campus UTEQ - Quevedo** como solución telemática para la gestión inteligente de estacionamientos.