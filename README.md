# 🌍 NomadHub — Travel Explorer

Aplicación web para explorar países, consultar clima en tiempo real y buscar vuelos. Desarrollada con Django REST Framework y React + TypeScript.

**Autor:** Kendal Trejos Cubero 
**Carné:** C4K374  
**Curso:** Lenguajes para Aplicaciones Comerciales  
**Universidad:** Universidad de Costa Rica — Sede de Occidente

---

## 🚀 Tecnologías

**Backend**
- Python 3.11
- Django 5.x + Django REST Framework
- MySQL 8.4 (WAMP)
- python-dotenv

**Frontend**
- React 18 + TypeScript
- Vite
- Leaflet.js (mapa interactivo)
- Axios

**APIs externas**
- [REST Countries](https://restcountries.com) — perfil de países
- [Open-Meteo](https://open-meteo.com) — clima actual e histórico
- [Aviation Stack](https://aviationstack.com) — vuelos en tiempo real

---

## ⚙️ Requisitos

- Python 3.11+
- Node.js 18+
- MySQL 8.x (WAMP recomendado en Windows)
- Git

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/KendalTC/NomadHub.git
cd NomadHub
```

### 2. Configurar el backend

```bash
# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

Creá un archivo `.env` en la raíz del proyecto:

```env
SECRET_KEY=django-insecure-cambiar-en-produccion
DEBUG=True
DB_NAME=nomadhub
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_HOST=localhost
DB_PORT=3306
AVIATION_KEY=tu_api_key_de_aviationstack
```

### 4. Crear base de datos

Abrí phpMyAdmin o MySQL y ejecutá:

```sql
CREATE DATABASE nomadhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Ejecutar migraciones

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 6. Configurar el frontend

```bash
cd frontend
npm install
```

---

## ▶️ Ejecutar el proyecto

Necesitás **dos terminales** abiertas simultáneamente.

**Terminal 1 — Backend:**
```bash
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Abrí `http://localhost:5173/` en el navegador.

---

## 🗂️ Estructura del proyecto
NomadHub/
├── nomadhub/          # Configuración Django
├── trips/             # App principal
│   ├── models.py      # Itinerary, FlightSearch
│   ├── views.py       # API views
│   ├── serializers.py
│   ├── services.py    # Lógica de APIs externas
│   └── urls.py
├── frontend/          # React + TypeScript
│   ├── src/
│   │   ├── api/       # Cliente axios
│   │   ├── components/# Navbar, MapView
│   │   ├── pages/     # Home, Country, Flights, Itineraries
│   │   └── types/     # TypeScript interfaces
├── .env               # Variables de entorno (no subir a Git)
├── requirements.txt
└── README.md


## 🔌 APIs utilizadas

| API | Uso | Autenticación |
|-----|-----|---------------|
| REST Countries | Perfil de países, banderas, coordenadas | Sin key |
| Open-Meteo | Clima actual e histórico | Sin key |
| Aviation Stack | Vuelos en tiempo real, aeropuertos | API key gratis |

---

## 📋 Funcionalidades

- 🗺️ Mapa mundial interactivo con Leaflet — clic en cualquier país
- 🌤️ Clima actual al explorar un país
- ✈️ Búsqueda de vuelos con selector de aeropuertos por país
- 📋 CRUD completo de itinerarios de viaje
- 🌙 Dark mode elegante
- 📱 Diseño responsivo

---

## ⚠️ Limitaciones conocidas

- Aviation Stack plan gratuito muestra solo vuelos activos en tiempo real. Rutas con mayor tráfico como SJO→MIA tienen mejores resultados.
- El portal self-service de Amadeus fue descontinuado en 2026.

---

## 👤 Admin

Accedé al panel de administración en `http://127.0.0.1:8000/admin/` con las credenciales del superusuario creado.