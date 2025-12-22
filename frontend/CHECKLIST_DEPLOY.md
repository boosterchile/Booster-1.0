# ✅ Checklist Interactivo de Deploy - SmartAICargo v4

Usa esta checklist mientras deploys. Marca cada paso cuando lo completes.

---

## 📋 PRE-DEPLOY

### Terminal - Paso 1: Build Local
```bash
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4
npm install
npm run build
```

- [ ] ✅ Comando ejecutado sin errores
- [ ] ✅ Carpeta `dist/` creada
- [ ] ✅ Ves mensaje "built in X.XXs"

**Si falla**: 
- Verifica que Node.js esté instalado: `node --version`
- Reinstala dependencias: `rm -rf node_modules && npm install`

---

## 🌐 VERCEL - Pasos Web

### Paso 2: Crear Cuenta (2 min)

Abre: https://vercel.com

- [ ] ✅ Página de Vercel abierta
- [ ] ✅ Click en "Sign Up"
- [ ] ✅ Seleccioné "Continue with GitHub"
- [ ] ✅ Autoricé Vercel en GitHub
- [ ] ✅ Estoy en el Dashboard de Vercel

---

### Paso 3: Nuevo Proyecto (1 min)

En Vercel Dashboard:

- [ ] ✅ Click en "Add New..." (botón azul)
- [ ] ✅ Seleccioné "Project"
- [ ] ✅ Veo opciones de import

---

### Paso 4: Upload de Dist (30 seg)

**IMPORTANTE**: Usa Drag & Drop manual

- [ ] ✅ Busqué área de "Upload" o "Deploy without Git"
- [ ] ✅ Arrastré la carpeta `dist/` desde Finder
  
  Ubicación: `/Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4/dist`

- [ ] ✅ Vercel detectó los archivos
- [ ] ✅ Click en "Deploy"
- [ ] ✅ Esperando deploy... (30-60 seg)

---

### Paso 5: Deploy Completado (Verificación)

- [ ] ✅ Veo mensaje "Congratulations!" o similar
- [ ] ✅ Tengo una URL: `https://[algo].vercel.app`
- [ ] ✅ Click en "Visit" para ver mi app
- [ ] ✅ La app carga (aunque puede fallar Gemini/Maps aún)

**Tu URL de producción**: _________________________

---

## 🔑 CONFIGURAR API KEYS

### Paso 6: Environment Variables (3 min)

⚠️ **CRÍTICO**: Sin esto, la app no funcionará correctamente

En Vercel Dashboard:

- [ ] ✅ Volví al Dashboard de Vercel
- [ ] ✅ Click en mi proyecto "smartaicargo-v4"
- [ ] ✅ Click en tab "Settings" (arriba)
- [ ] ✅ Click en "Environment Variables" (menú lateral)

**Agregar Primera Variable**:
- [ ] ✅ Name: `VITE_GEMINI_API_KEY`
- [ ] ✅ Value: (pegué mi Gemini API key)
- [ ] ✅ Seleccioné: Production ✓ Preview ✓ Development ✓
- [ ] ✅ Click "Save"

**Agregar Segunda Variable**:
- [ ] ✅ Name: `VITE_GOOGLE_MAPS_API_KEY`
- [ ] ✅ Value: (pegué mi Google Maps API key)
- [ ] ✅ Seleccioné: Production ✓ Preview ✓ Development ✓
- [ ] ✅ Click "Save"

### ❓ ¿No tienes las API keys?

**Gemini AI**: https://ai.google.dev/gemini-api/docs/api-key
**Google Maps**: https://console.cloud.google.com/google/maps-apis

---

### Paso 7: Redeploy con Variables (1 min)

Las variables solo se aplican en nuevo deploy.

- [ ] ✅ En Vercel, click tab "Deployments"
- [ ] ✅ Busqué el deployment más reciente
- [ ] ✅ Click en "..." (3 puntos) al lado
- [ ] ✅ Click en "Redeploy"
- [ ] ✅ Click en "Redeploy" para confirmar
- [ ] ✅ Esperando... (30-60 seg)
- [ ] ✅ Deploy completado

---

## ✅ VERIFICACIÓN FINAL

### Paso 8: Probar la App

Abre tu URL: `https://[tu-proyecto].vercel.app`

**Checklist de Funcionalidad**:
- [ ] ✅ App carga sin error 404
- [ ] ✅ Puedo ver la página de inicio
- [ ] ✅ Click en "Iniciar Sesión"
- [ ] ✅ Login funciona (user: `admin`, pass: `password123`)
- [ ] ✅ Dashboard carga con datos
- [ ] ✅ Sidebar navegación funciona
- [ ] ✅ Mapas cargan sin error
- [ ] ✅ NO veo errores en consola (F12)

**Consola del Navegador** (F12 → Console):
- [ ] ✅ NO veo: "VITE_GEMINI_API_KEY is not configured"
- [ ] ✅ NO veo: "VITE_GOOGLE_MAPS_API_KEY is not configured"
- [ ] ✅ Solo warnings menores (ok)

---

## 🎨 OPCIONAL: Personalización

### Paso 9: Cambiar Nombre del Proyecto

En Vercel Dashboard → Settings → General:

- [ ] Edit en "Project Name"
- [ ] Nuevo nombre: `smartaicargo` (o el que quieras)
- [ ] Save
- [ ] Nueva URL: `https://smartaicargo.vercel.app`

---

### Paso 10: Dominio Personalizado (Si tienes uno)

En Vercel Dashboard → Settings → Domains:

- [ ] Click "Add Domain"
- [ ] Ingresé mi dominio
- [ ] Agregué registros DNS según instrucciones
- [ ] Esperé propagación (10-60 min)
- [ ] Dominio activo con HTTPS automático

---

## 📊 POST-DEPLOY

### Monitoreo y Mantenimiento

- [ ] ✅ Agregué la URL a favoritos
- [ ] ✅ Verifiqué Analytics en Vercel
- [ ] ✅ Configuré notificaciones (Settings → Notifications)
- [ ] ✅ Compartí URL con stakeholders

---

## 🐛 Si Algo Sale Mal

### Error: Build Failed
**Solución**:
1. Verifica que `npm run build` funcione localmente
2. Revisa Build Logs en Vercel
3. Busca el mensaje de error específico

### Error: 404 en Rutas
**Solución**:
1. Verifica que `vercel.json` exista en el proyecto
2. Contenido debe tener: `"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`
3. Redeploy

### Error: API Keys No Funcionan
**Solución**:
1. Verifica que las variables estén en "Production"
2. Verifica que NO haya espacios extras en los valores
3. IMPORTANTE: Debes **Redeploy** después de agregar variables
4. Toma 1-2 minutos aplicar cambios

### Error: Excedí Mi Cuota
**Solución**:
- Free tier: 100 GB bandwidth/mes
- Para apps pequeñas: Suficiente para ~10,000 visitantes/mes
- Si excedes: Upgrade a Pro ($20/mes) o optimiza assets

---

## 🎉 ¡DEPLOY EXITOSO!

### Tu App Está:
✅ En producción
✅ Accesible 24/7
✅ Con HTTPS global
✅ Con CDN de Vercel
✅ Auto-scaling

### URLs Importantes:
- **Producción**: https://[tu-proyecto].vercel.app
- **Dashboard**: https://vercel.com/dashboard
- **Analytics**: https://vercel.com/[tu-proyecto]/analytics

### Comparte:
- Envía la URL a tu equipo
- Agrega a tu portfolio
- Prueba en móvil
- Comparte en LinkedIn 🚀

---

## 📝 Notas

**Tiempo invertido**: _________ minutos

**Problemas encontrados**: 
_____________________________________

**Próximos pasos**:
- [ ] Configurar dominio personalizado
- [ ] Agregar monitoreo
- [ ] Optimizar performance (Lighthouse)
- [ ] Agregar más features

---

**Fecha de deploy**: _______________
**URL final**: ____________________
**Estado**: ✅ Funcionando / ⚠️ Revisar / ❌ Error

---

¡Felicidades por tu deploy! 🎊
