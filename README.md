# 🚗 Mi Aparcamiento

Una aplicación web progresiva moderna y eficiente diseñada para que nunca vuelvas a olvidar dónde aparcaste tu coche. Utiliza geolocalización en tiempo real y mapas interactivos para guardar y gestionar tus ubicaciones de aparcamiento.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)

---

## ✨ Características Principales

- **📍 Geolocalización Inteligente**: Obtén tu ubicación actual con un solo clic o selecciónala manualmente en el mapa.
- **🗺️ Mapas Interactivos**: Integración fluida con Leaflet para una visualización clara y precisa.
- **🕒 Historial de Aparcamientos**: Mantén un registro detallado de dónde y cuándo has aparcado.
- **🔒 Acceso Seguro**: Sistema de autenticación para sincronizar tus datos con el servidor.
- **📱 PWA Ready**: Instalable en dispositivos móviles para una experiencia nativa.
- **🎨 Diseño Responsivo**: Construido con Bootstrap 5 para adaptarse perfectamente a cualquier pantalla.

## 🛠️ Stack Tecnológico

- **Backend**: Node.js & Express.js
- **Base de Datos**: SQLite (Better-SQLite3)
- **Frontend**: EJS (Templating), CSS3 Vanilla, JavaScript ES6+
- **Framework UI**: Bootstrap 5
- **Mapas**: Leaflet.js
- **Gestión de Sesiones**: Express-session

## 🚀 Instalación y Uso

Sigue estos pasos para ejecutar el proyecto localmente:

### 1. Clonar el repositorio

```bash
git clone https://github.com/n3brrr/Gestion-de-Aparcamiento.git
cd Reto5_Aparcamiento
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar la aplicación

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`.

## 📂 Estructura del Proyecto

- `/public`: Archivos estáticos (CSS, JS, Imágenes).
- `/routes`: Definición de rutas y lógica de la API.
- `/views`: Plantillas EJS para la interfaz de usuario.
- `/database`: Controladores de acceso a datos (DAOs).
- `app.js`: Punto de entrada de la aplicación.
- `datos.sqlite`: Base de datos local.

## 🔑 Credenciales de Acceso

Para acceder a las funciones avanzadas y sincronización de datos, utiliza las siguientes credenciales de administrador:

- **Usuario**: `admin`
- **Contraseña**: `admin`

---

## 👨‍💻 Autor

- **Rubén** - [n3brrr](https://github.com/n3brrr)

---

> Este proyecto fue desarrollado como parte del **Reto 5: Gestión de Aparcamiento**.
