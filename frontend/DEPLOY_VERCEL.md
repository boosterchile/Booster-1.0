# 🚀 Deploy SmartAICargo v4 en Vercel - Paso a Paso

## ⏱️ Tiempo estimado: 10 minutos

---

## Paso 1: Build del Proyecto (3 minutos)

Abre tu Terminal y ejecuta:

```bash
# Navega al proyecto
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4

# Instala dependencias (si no lo has hecho)
npm install

# Build de producción
npm run build
```

**Qué hace esto**:
- Compila React a JavaScript optimizado
- Genera archivos estáticos en la carpeta `dist/`
- Minifica y optimiza todo el código
- Prepara para producción

**Resultado esperado**:
```
✓ built in 3.45s
dist/index.html                   3.70 kB │ gzip: 1.28 kB
dist/assets/index-[hash].css     45.23 kB │ gzip: 12.34 kB
dist/assets/index-[hash].js     234.56 kB │ gzip: 78.90 kB
```

---

## Paso 2: Crear Cuenta en Vercel (2 minutos)

1. **Abre**: https://vercel.com
2. Click en **"Sign Up"** (esquina superior derecha)
3. Selecciona **"Continue with GitHub"** (recomendado)
   - O usa Google/Email si prefieres
4. Autoriza Vercel en GitHub
5. ¡Cuenta creada! 🎉

**¿Por qué GitHub?**
- Deploys automáticos cuando haces push
- Preview de Pull Requests
- Historial de deploys

---

## Paso 3: Deploy del Proyecto (2 minutos)

### Método A: Drag & Drop (Más Fácil)

1. En Vercel Dashboard, click **"Add New..." → "Project"**

2. Click en la pestaña **"Import Third-Party Git Repository"** 
   O simplemente busca el área que dice **"Deploy a repository"**

3. **IMPORTANTE**: Si no ves tu repo, hay dos opciones:

   **Opción 1 - Upload Manual (MÁS RÁPIDO)**:
   - Busca el botón **"Browse"** o área de Drag & Drop
   - Arrastra la carpeta `dist/` desde Finder
   - O navega a: `/Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4/dist`
   - Click "Upload"
   
   **Opción 2 - Conectar GitHub**:
   - Primero sube a GitHub (ver Método B abajo)

4. Vercel detecta automáticamente:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - ✅ Todo ok

5. Click **"Deploy"**

6. Espera 30-60 segundos... ⏳

7. ¡Listo! 🎉
   - Ver tu app: Click en "Visit"
   - URL: `https://smartaicargo-v4-[random].vercel.app`

### Método B: Conectar con GitHub (Recomendado para Producción)

```bash
# 1. Inicializar Git (si no lo has hecho)
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4
git init

# 2. Agregar archivos
git add .
git commit -m "Initial commit - SmartAICargo v4"

# 3. Crear repo en GitHub
# Ve a: https://github.com/new
# Nombre: smartaicargo-v4
# Público o Privado
# NO inicialices con README

# 4. Push a GitHub
git remote add origin https://github.com/TU_USUARIO/smartaicargo-v4.git
git branch -M main
git push -u origin main
```

Luego en Vercel:
1. Click **"Import Git Repository"**
2. Selecciona tu repo `smartaicargo-v4`
3. Click **"Import"**
4. Configuración detectada automáticamente ✅
5. Click **"Deploy"**

---

## Paso 4: Configurar Variables de Entorno (3 minutos)

⚠️ **CRÍTICO**: Sin esto, Gemini AI y Google Maps no funcionarán.

### En Vercel Dashboard:

1. Ve a tu proyecto desplegado
2. Click en la pestaña **"Settings"**
3. En el menú lateral, click **"Environment Variables"**
4. Agregar variables:

   **Primera variable**:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: `tu_gemini_api_key_aquí` (sin comillas)
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   **Segunda variable**:
   - Name: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: `tu_google_maps_api_key_aquí`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

### 📋 Obtener API Keys (si no las tienes):

**Gemini AI**:
1. Ve a: https://ai.google.dev/gemini-api/docs/api-key
2. Click "Get API key in Google AI Studio"
3. Login con Google
4. Click "Create API key"
5. Copia la key (empieza con `AIzaSy...`)

**Google Maps**:
1. Ve a: https://console.cloud.google.com/google/maps-apis
2. Login con Google
3. Crea proyecto si no tienes
4. APIs & Services → Credentials
5. Create Credentials → API Key
6. Copia la key

---

## Paso 5: Redeploy con Variables (1 minuto)

Las variables de entorno solo se aplican en nuevo deploy.

**En Vercel Dashboard**:
1. Click en tu proyecto
2. Pestaña **"Deployments"**
3. Busca el último deployment exitoso
4. Click en los 3 puntos **"..."** al lado
5. Click **"Redeploy"**
6. Confirma

Espera 30-60 segundos...

---

## ✅ Verificación Final

### 1. Abrir tu App

Click en **"Visit"** o copia la URL: `https://tu-proyecto.vercel.app`

### 2. Probar Funcionalidades

- [ ] ✅ La app carga (no error 404)
- [ ] ✅ Puedes navegar entre páginas
- [ ] ✅ Login funciona (usa: `admin` / `password123`)
- [ ] ✅ Dashboard muestra datos
- [ ] ✅ Mapas cargan correctamente
- [ ] ✅ No hay errores en consola del navegador (F12)

### 3. Validar API Keys

Abre la consola del navegador (F12):

**Si ves estos errores**, falta configurar variables:
```
❌ CRITICAL: VITE_GEMINI_API_KEY is not configured
❌ WARNING: VITE_GOOGLE_MAPS_API_KEY is not configured
```

**Solución**: Vuelve al Paso 4 y configura las variables, luego redeploy.

---

## 🎨 Paso 6: Dominio Personalizado (Opcional)

### Opción A: Subdominio de Vercel (Gratis)

1. Settings → Domains
2. Editar dominio actual
3. Cambiar a: `smartaicargo.vercel.app` (o el nombre que quieras)
4. Save

### Opción B: Tu Propio Dominio

**Si tienes un dominio (ej: tudominio.com)**:

1. Settings → Domains
2. Add Domain
3. Ingresa: `smartaicargo.tudominio.com`
4. Vercel te da instrucciones DNS
5. Actualiza DNS en tu proveedor
6. Espera 10-60 minutos propagación
7. ✅ HTTPS automático con Let's Encrypt

---

## 🔄 Deploys Automáticos (GitHub)

Si conectaste con GitHub:

```bash
# Hacer un cambio
nano README.md  # Edita algo

# Commit y push
git add .
git commit -m "Update README"
git push

# Vercel automáticamente:
# 1. Detecta el push
# 2. Build del proyecto
# 3. Deploy en producción
# 4. Te notifica vía email
```

**Preview Branches**:
- Cada Pull Request = URL de preview única
- Prueba cambios antes de mergear

---

## 📊 Monitoreo y Analytics

### Ver Analytics (Gratis)

1. Dashboard → Tu proyecto → **Analytics**
2. Ver:
   - Page views
   - Top pages
   - Visitors
   - Countries

### Ver Logs

1. Dashboard → **Deployments**
2. Click en un deployment
3. Ver **Function Logs** (si usas serverless)

---

## ⚡ Comandos Útiles

```bash
# Redeploy rápido (sin rebuild)
vercel --prod

# Deploy a staging
vercel

# Ver logs en tiempo real
vercel logs

# Listar deployments
vercel ls

# Ver info del proyecto
vercel inspect
```

---

## 🐛 Troubleshooting

### Problema: 404 en rutas (ej: /dashboard)

**Causa**: React Router necesita configuración SPA.

**Solución**: Crear `vercel.json` en raíz:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Luego redeploy.

### Problema: Build falla

**Ver logs**:
1. Deployments → Click en el fallido
2. Ver "Build Logs"
3. Buscar error específico

**Común**: Variables de entorno en build
- Asegúrate variables estén en "Production" environment

### Problema: App no carga datos

**Causa**: API keys no configuradas o incorrectas

**Solución**:
1. Verifica variables de entorno
2. Redeploy (importante!)
3. Abre consola del navegador para ver errores

### Problema: Cuota excedida

**Free tier límites**:
- 100 GB bandwidth/mes
- 6,000 build minutes/mes
- Generalmente suficiente para 10,000+ visitantes/mes

**Si excedes**: Vercel te notifica, puedes upgrade a Pro ($20/mes)

---

## 🎯 Próximos Pasos

Una vez que tu app esté en línea:

1. **Comparte la URL** con stakeholders
2. **Configura alertas**: Settings → Notifications
3. **Habilita Web Analytics**: Settings → Analytics
4. **Optimiza performance**: 
   - Lighthouse audit
   - Vercel Speed Insights (Pro)
5. **Agrega dominio personalizado**

---

## 🎉 ¡Listo!

Tu SmartAICargo v4 está ahora:
- ✅ Desplegado en producción
- ✅ Accesible 24/7 globalmente
- ✅ Con HTTPS incluido
- ✅ Con CDN global de Vercel
- ✅ Auto-scaling

**URL de ejemplo**: `https://smartaicargo-v4.vercel.app`

Comparte esta URL con quien quieras mostrar tu proyecto! 🚀

---

## 📞 ¿Problemas?

Si algo no funciona:
1. Revisa los pasos 4 y 5 (variables de entorno)
2. Verifica Build Logs en Vercel
3. Abre consola del navegador (F12) para ver errores
4. Revisa que `npm run build` funcione localmente
