# SmartAICargo - Guía de Configuración del Backend

Esta guía explica cómo cambiar entre el backend mock (simulado) y el backend real (PostgreSQL).

## 🔄 Cambiar Entre Backends

### Opción 1: Usar Backend REAL (Recomendado para Producción)

**Paso 1:** Actualiza tu archivo `.env.local`:

```bash
# En smartaicargo-v4/.env.local
VITE_API_BASE_URL=http://localhost:3001
VITE_USE_REAL_BACKEND=true
```

**Paso 2:** Asegúrate de que el backend esté corriendo:

```bash
cd smartaicargo-backend
npm run dev  # Backend en puerto 3001
```

**Paso 3:** Inicia el frontend:

```bash
cd smartaicargo-v4
npm run dev  # Frontend en puerto 5173
```

### Opción 2: Usar Backend MOCK (Para Desarrollo Sin PostgreSQL)

**Paso 1:** Actualiza tu archivo `.env.local`:

```bash
# En smartaicargo-v4/.env.local
# Comenta o elimina estas líneas:
# VITE_API_BASE_URL=http://localhost:3001
# VITE_USE_REAL_BACKEND=true
```

**Paso 2:** Inicia solo el frontend:

```bash
cd smartaicargo-v4
npm run dev
```

---

## 🏗️ Arquitectura del Sistema de Configuración

El sistema detecta automáticamente qué backend usar basándose en las variables de entorno:

```
services/
├── apiService.ts          # Mock backend (simulado en memoria)
├── apiService.real.ts     # Real backend (API REST)
└── apiService.config.ts   # Auto-switcher (NEW!)
```

### Lógica de Detección

```typescript
// Si VITE_API_BASE_URL está definido → Usa backend REAL
// Si VITE_USE_REAL_BACKEND=true → Usa backend REAL
// De lo contrario → Usa backend MOCK
```

---

## 🧪 Testing

### Verificar Qué Backend Se Está Usando

1. Abre la consola del navegador (F12)
2. Busca el mensaje:
   - `🔧 Using REAL backend` + `📡 API URL: http://localhost:3001`
   - O: `🔧 Using MOCK backend`

### Test del Backend Real

**Test 1 - Health Check:**
```bash
curl http://localhost:3001/health
# Respuesta esperada: {"success":true,"message":"SmartAICargo API is running",...}
```

**Test 2 - Login:**
1. Abre http://localhost:5173
2. Click en "Iniciar Sesión"
3. Username: `shipper`, Password: `password123`
4. Si funciona → Backend real está activo! ✅

**Test 3 - Persistencia:**
1. Crea una nueva carga
2. Refresca el navegador (F5)
3. Si la carga persiste → Backend real funciona! ✅

---

## 🔧 Troubleshooting

### Error: "Failed to fetch" o "Network Error"

**Problema:** El backend no está corriendo o la URL es incorrecta.

**Solución:**
```bash
# Terminal 1: Verifica que el backend esté corriendo
cd smartaicargo-backend
npm run dev

# Terminal 2: Verifica el frontend
cd smartaicargo-v4
npm run dev
```

### Error: CORS

**Problema:** El backend rechaza requests del frontend.

**Solución:** Verifica que el backend tenga la configuración correcta de CORS:

```bash
# En smartaicargo-backend/.env
CORS_ORIGIN=http://localhost:5173
```

### Backend Real No Se Detecta

**Problema:** Sigue usando el mock aunque hayas configurado el backend real.

**Solución:**
1. Verifica que `.env.local` existe (NO `.env.example`)
2. Reinicia el servidor de desarrollo del frontend
3. Borra la cache del navegador (Ctrl+Shift+Del)

---

## 📝 Variables de Entorno Completas

### Frontend (`.env.local`)

```bash
# API Keys
VITE_GEMINI_API_KEY=tu_api_key_de_gemini
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps

# Backend Configuration (descomenta para usar backend real)
VITE_API_BASE_URL=http://localhost:3001
VITE_USE_REAL_BACKEND=true
```

### Backend (`.env`)

```bash
# Database
DATABASE_URL="postgresql://smartaicargo_user:smartaicargo123@localhost:5432/smartaicargo?schema=public"

# JWT
JWT_SECRET="tu-secreto-minimo-32-caracteres-largo"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
```

---

## ✅ Checklist de Configuración

### Para Usar Backend REAL:

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos creada (`smartaicargo`)
- [ ] Migraciones ejecutadas (`npm run prisma:migrate`)
- [ ] Datos iniciales cargados (`npm run seed`)
- [ ] Backend corriendo (`npm run dev` en puerto 3001)
- [ ] `.env.local` configurado con `VITE_API_BASE_URL`
- [ ] Frontend corriendo (`npm run dev` en puerto 5173)

### Para Usar Backend MOCK:

- [ ] `.env.local` SIN `VITE_API_BASE_URL`
- [ ] Frontend corriendo (`npm run dev`)
- ✅ ¡Listo! (no necesitas PostgreSQL ni backend)

---

## 🚀 Recomendaciones

### Desarrollo Local
- **Usa MOCK**: Si solo estás trabajando en el frontend o UI
- **Usa REAL**: Si necesitas probar autenticación, persistencia, o deployment

### Producción
- **Usa REAL**: Siempre usa el backend real en producción
- Backend desplegado en Railway/Render
- Frontend en Vercel apuntando al backend de producción

---

## 🆘 Ayuda Rápida

```bash
# ¿Qué backend estoy usando?
# → Revisa la consola del navegador (F12)

# Cambiar a backend REAL:
echo 'VITE_API_BASE_URL=http://localhost:3001' >> smartaicargo-v4/.env.local

# Cambiar a backend MOCK:
# → Elimina la línea VITE_API_BASE_URL de .env.local

# Reiniciar todo:
# Terminal 1:
cd smartaicargo-backend && npm run dev

# Terminal 2:
cd smartaicargo-v4 && npm run dev
```

---

**¿Preguntas?** Consulta la documentación completa en:
- [GUIA_INSTALACION_COMPLETA.md](file:///Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/GUIA_INSTALACION_COMPLETA.md)
- [Backend README](file:///Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-backend/README.md)
