# 🚀 Deploy SmartAICargo en 3 Pasos Simples

## ⏱️ Tiempo Total: 10 minutos

---

## PASO 1: Build del Proyecto (Terminal - 3 minutos)

Abre tu **Terminal** y ejecuta estos comandos:

```bash
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4
npm install
npm run build
```

**Resultado**: Se crea la carpeta `dist/` con tu app lista para producción.

---

## PASO 2: Deploy en Vercel (Web - 5 minutos)

### A. Crear cuenta (2 min)
1. Ve a: **https://vercel.com**
2. Click **"Sign Up"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza Vercel

### B. Subir proyecto (2 min)
1. En Vercel Dashboard, click **"Add New..." → "Project"**
2. Click en **"Deploy without Git Repository"** o busca opción de upload
3. **Arrastra la carpeta `dist/`** desde Finder
   - Ubicación: `/Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4/dist`
4. Click **"Deploy"**
5. Espera 30-60 segundos

✅ **¡Listo!** Tendrás una URL como: `https://smartaicargo-xxx.vercel.app`

---

## PASO 3: Configurar API Keys (Web - 2 minutos)

⚠️ **IMPORTANTE**: Sin esto, Gemini AI y Maps no funcionarán.

### En Vercel Dashboard:
1. Click en tu proyecto
2. Tab **"Settings"** → **"Environment Variables"**
3. Agregar **primera variable**:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: tu_gemini_api_key
   - Environments: ✅ Todos
   - Save
4. Agregar **segunda variable**:
   - Name: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: tu_google_maps_api_key
   - Environments: ✅ Todos
   - Save
5. Tab **"Deployments"** → Click **"..."** → **"Redeploy"**

---

## ✅ VERIFICACIÓN

Abre tu URL y prueba:
- [ ] Login funciona (admin / password123)
- [ ] Dashboard carga
- [ ] Mapas funcionan
- [ ] No hay errores en consola (F12)

---

## 🔑 Obtener API Keys

**Gemini AI**: https://ai.google.dev/gemini-api/docs/api-key
**Google Maps**: https://console.cloud.google.com/google/maps-apis

---

## 🐛 Problemas Comunes

**Error "command not found: npm"**
→ Instala Node.js: https://nodejs.org/

**Error 404 en rutas**
→ El archivo `vercel.json` ya está configurado correctamente

**API Keys no funcionan**
→ Asegúrate de hacer Redeploy después de agregar variables

---

## 🎉 ¡Completado!

Tu app está ahora en: `https://tu-proyecto.vercel.app`

Comparte la URL con quien quieras! 🚀
