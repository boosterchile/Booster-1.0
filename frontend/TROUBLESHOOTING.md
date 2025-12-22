# 🛠️ Troubleshooting - SmartAICargo v4

> Soluciones a problemas comunes en SmartAICargo v4

## 🔴 Error: Cannot read properties of undefined (reading 'getRootNode')

### Síntomas
```
TypeError: Cannot read properties of undefined (reading 'getRootNode')
at http://localhost:3001/node_modules/.vite/deps/vis_gl_react-google-maps.js
```

### Causa
Este error ocurre cuando el componente de Google Maps (`@vis.gl/react-google-maps`) intenta acceder al DOM antes de que React haya terminado de montar el componente completamente.

### ✅ Solución Implementada

Hemos actualizado `GoogleMapComponent.tsx` con:

1. **Estado de montaje**: Verifica que el componente esté completamente montado antes de renderizar el mapa
2. **Loading state**: Muestra "Cargando mapa..." mientras se inicializa
3. **Memoización**: Previene re-renders innecesarios con `React.memo()`
4. **Propiedad `reuseMaps`**: Mejora la reutilización de instancias del mapa

### Pasos de Verificación

1. **Recargar la aplicación**:
   ```bash
   # Ctrl+C para detener el servidor
   npm run dev
   ```

2. **Limpiar caché de Vite** (si el problema persiste):
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Hard refresh en el navegador**:
   - Chrome/Edge: `Cmd+Shift+R` (Mac) o `Ctrl+Shift+R` (Windows)
   - Firefox: `Cmd+Shift+R` (Mac) o `Ctrl+F5` (Windows)

---

## 🗺️ Google Maps API Key Issues

### Error: "Visualización de Mapa No Disponible"

**Causa**: La API Key de Google Maps no está configurada o es inválida.

**Solución**:

1. Verificar que `.env.local` existe:
   ```bash
   ls -la .env.local
   ```

2. Asegurar que contiene:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   VITE_GEMINI_API_KEY=tu_gemini_key_aqui
   ```

3. Obtener una API Key válida:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Habilita "Maps JavaScript API"
   - Crea credenciales → API Key
   - **Importante**: Habilita también "Places API (New)"

4. Reiniciar servidor:
   ```bash
   npm run dev
   ```

---

## 🔐 Backend Connection Issues

### Error: "Network error during login"

**Síntomas**: No puedes hacer login, errores de red en consola.

**Diagnóstico**:

1. Verificar qué backend estás usando:
   ```bash
   # En smartaicargo-v4/.env.local
   cat .env.local | grep BACKEND
   ```

2. Si usas backend REAL (`VITE_USE_REAL_BACKEND=true`):
   
   **Verificar que el backend esté corriendo**:
   ```bash
   # En otra terminal
   cd ../smartaicargo-backend
   npm run dev
   ```
   
   Deberías ver:
   ```
   🚀 SmartAICargo API server running on port 3001
   ```

3. Si usas backend MOCK (por defecto):
   - No necesitas hacer nada, funciona en memoria
   - Si quieres cambiar a backend real, ver [BACKEND_CONFIG.md](./BACKEND_CONFIG.md)

---

## 🧪 React Query DevTools No Aparece

**Causa**: Solo están disponibles en modo desarrollo.

**Solución**:

1. Verificar que estás en modo desarrollo:
   ```bash
   npm run dev  # NO npm run build
   ```

2. Las DevTools aparecen en la esquina inferior derecha
3. Si no las ves, presiona `Shift+D` o revisa la consola

---

## ⚡ Vite/Build Issues

### Error: "Module not found" o imports rojos

**Solución 1: Reinstalar dependencias**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Solución 2: Limpiar caché de Vite**:
```bash
rm -rf node_modules/.vite dist
npm run dev
```

### Error: Puerto 5173 ya en uso

**Solución**:
```bash
# Matar proceso en puerto 5173
lsof -ti:5173 | xargs kill -9

# O usar otro puerto
npm run dev -- --port 5174
```

---

## 🔄 Hot Module Replacement (HMR) No Funciona

**Síntomas**: Cambios en el código no se reflejan automáticamente.

**Solución**:

1. **Hard refresh**: `Cmd+Shift+R`
2. **Reiniciar servidor**:
   ```bash
   # Ctrl+C
   npm run dev
   ```
3. **Verificar que no hay errores de TypeScript** en la terminal

---

## 📱 Responsive Issues

### El layout se ve mal en móvil

**Verificación**:

1. Abrir DevTools → Toggle device toolbar
2. Probar diferentes tamaños:
   - iPhone 12 Pro (390x844)
   - iPad Air (820x1180)
   - Desktop (1920x1080)

**Solución común**: Los componentes ya tienen clases responsive (`sm:`, `lg:`), asegúrate de que el viewport está configurado:

```html
<!-- index.html debe tener -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 🎨 Estilos Tailwind No Aplican

**Causa**: Posible purge incorrecto o clase mal escrita.

**Verificación**:

1. Buscar errores en la consola del navegador
2. Inspeccionar elemento para ver qué clases se aplican
3. Verificar que la clase existe en Tailwind CSS

**Solución**:
```bash
# Reiniciar dev server
npm run dev
```

---

## 🔍 Debugging Tips

### Habilitar logs detallados

1. **React Query**:
   ```typescript
   // En providers/QueryProvider.tsx
   <ReactQueryDevtools initialIsOpen={true} />
   ```

2. **Console logs**:
   ```typescript
   console.log('Debug:', variable);
   ```

3. **React DevTools** (extensión de Chrome):
   - Inspeccionar componentes
   - Ver props y state
   - Ver árbol de componentes

### Verificar errores en la consola

```bash
# En el navegador
# Cmd+Option+J (Mac) o F12 (Windows)
```

Buscar:
- ❌ Errores rojos
- ⚠️ Warnings amarillos
- 🔵 Logs informativos

---

## 📊 Performance Issues

### La app va lenta

**Diagnóstico**:

1. Abrir React DevTools → Profiler
2. Grabar una sesión
3. Identificar componentes que re-renderizan mucho

**Soluciones comunes**:

- Ya implementamos `React.memo()` en componentes clave
- React Query cachea automáticamente
- Lazy loading está activo en todas las páginas

**Optimización adicional**:
```bash
# Build de producción optimizado
npm run build
npm run preview
```

---

## 🗄️ PostgreSQL/Prisma Issues

### Error: "Can't reach database server"

**Causa**: PostgreSQL no está corriendo o la URL es incorrecta.

**Solución**:

1. **Iniciar PostgreSQL**:
   ```bash
   brew services start postgresql@15
   ```

2. **Verificar conexión**:
   ```bash
   psql -l
   ```

3. **Verificar DATABASE_URL**:
   ```bash
   # En smartaicargo-backend/.env
   cat .env | grep DATABASE_URL
   ```

4. **Regenerar Prisma Client**:
   ```bash
   cd smartaicargo-backend
   npm run prisma:generate
   ```

---

## 🆘 Si Nada Funciona

### Reset completo

```bash
# 1. Limpiar todo
rm -rf node_modules package-lock.json .vite dist

# 2. Reinstalar
npm install

# 3. Ejecutar
npm run dev
```

### Restaurar a versión estable

```bash
# Si usas git
git stash
git pull origin main
npm install
npm run dev
```

---

## 📞 Recursos Adicionales

| Recurso | Link |
|---------|------|
| **Documentación React** | https://react.dev |
| **Vite Docs** | https://vitejs.dev |
| **TanStack Query** | https://tanstack.com/query |
| **Tailwind CSS** | https://tailwindcss.com |
| **@vis.gl/react-google-maps** | https://visgl.github.io/react-google-maps |

---

## ✅ Checklist de Verificación

Antes de reportar un error, verifica:

- [ ] Reiniciaste el servidor de desarrollo
- [ ] Hiciste hard refresh en el navegador
- [ ] No hay errores de TypeScript en la terminal
- [ ] `.env.local` tiene las API keys correctas
- [ ] `node_modules` está instalado correctamente
- [ ] Puerto 5173 no está siendo usado por otro proceso
- [ ] Revisaste la consola del navegador
- [ ] El backend está corriendo (si usas backend real)

---

**Última actualización**: 2025-11-25

Si encuentras un error no documentado aquí, por favor reporta con:
- Mensaje de error completo
- Pasos para reproducir
- Capturas de pantalla
- Versión de Node.js: `node --version`
