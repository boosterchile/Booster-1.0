# Booster 1.0

Plataforma integral para la optimización y gestión de operaciones de carga marítima y portuaria.

## 📁 Estructura del Proyecto

```
Booster 1.0/
├── frontend/          # Aplicación React + TypeScript + Vite
├── backend/           # API REST con Node.js + TypeScript + Prisma
└── docs/              # Documentación del proyecto
```

## 🚀 Inicio Rápido

### Prerequisitos

- **Node.js** v18 o superior
- **npm** o **yarn**
- **Base de datos** PostgreSQL (para el backend)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Backend

```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# Ejecutar migraciones de Prisma
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

El backend estará disponible en `http://localhost:3000` (o el puerto configurado en .env)

## 📚 Documentación

Para más información sobre el proyecto, consulta la carpeta `docs/`:

- **[ANALISIS_COMPLETO_V4.md](docs/ANALISIS_COMPLETO_V4.md)** - Análisis completo de la arquitectura y funcionalidades
- **[GUIA_DEPLOYMENT_WEB.md](docs/GUIA_DEPLOYMENT_WEB.md)** - Guía para desplegar la aplicación web
- **[GUIA_INSTALACION_COMPLETA.md](docs/GUIA_INSTALACION_COMPLETA.md)** - Guía de instalación paso a paso
- **[PROBLEMAS_RESUELTOS.md](docs/PROBLEMAS_RESUELTOS.md)** - Soluciones a problemas comunes

### Documentación Específica

- **Frontend**: Ver `frontend/README.md` para detalles sobre la aplicación React
- **Backend**: Ver `backend/README.md` para detalles sobre la API y base de datos

## 🛠️ Tecnologías Principales

### Frontend

- React 18
- TypeScript
- Vite
- React Query
- Google Maps API
- Vitest (testing)

### Backend

- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Express (o similar)

## 🔧 Desarrollo

### Frontend

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Ejecutar tests
npm run test
```

### Backend

```bash
# Modo desarrollo con hot-reload
npm run dev

# Build
npm run build

# Producción
npm start

# Prisma Studio (visualizar DB)
npx prisma studio
```

## 🌐 Despliegue

### Frontend (Vercel)

El proyecto incluye configuración para Vercel. Ver `docs/GUIA_DEPLOYMENT_WEB.md` para instrucciones detalladas.

### Backend

Se recomienda desplegar en servicios como:

- Railway
- Render
- Heroku
- DigitalOcean App Platform

## 📝 Notas

- Este proyecto consolida las carpetas `smartaicargo-v4` (frontend) y `smartaicargo-backend` (backend)
- La estructura modular permite desarrollar y desplegar frontend y backend de forma independiente
- Asegúrate de configurar correctamente las variables de entorno en ambos proyectos

## 🤝 Contribución

Para contribuir al proyecto:

1. Trabaja en la rama correspondiente (frontend o backend)
2. Asegúrate de que los tests pasen
3. Mantén la documentación actualizada
4. Sigue las convenciones de código del proyecto

## 📄 Licencia

[Definir licencia del proyecto]

---

**Booster 1.0** - Optimizando operaciones portuarias con tecnología de punta 🚢
