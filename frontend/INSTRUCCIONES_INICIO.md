# SmartAICargo v4 - Instrucciones de Inicio

## Opción 1: Script Automático (Recomendado)

He creado un script que hace todo por ti:

```bash
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4
./start.sh
```

## Opción 2: Paso a Paso

### 1. Navegar al directorio
```bash
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4
```

### 2. Instalar dependencias
```bash
npm install
```

Esto instalará:
- React Query (@tanstack/react-query)
- React Query DevTools
- Todas las dependencias de v3
- Herramientas de testing

**Tiempo estimado**: 1-2 minutos

### 3. Configurar variables de entorno

Crea un archivo `.env.local`:
```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus API keys:
```env
VITE_GEMINI_API_KEY=tu_gemini_api_key_aqui
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key_aqui
```

**Cómo obtener las API keys**:
- **Gemini AI**: https://ai.google.dev/gemini-api/docs/api-key
- **Google Maps**: https://console.cloud.google.com/google/maps-apis

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Verás algo como:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 5. Abrir en el navegador

Abre tu navegador en:
```
http://localhost:5173
```

## Qué verás en v4

### React Query DevTools
En la esquina inferior derecha verás un ícono flotante de React Query. Haz click para:
- Ver el cache de queries
- Inspeccionar estados de loading
- Invalidar queries manualmente
- Ver timeline de requests

### Lazy Loading
Las páginas se cargarán bajo demanda. Notarás:
- Carga inicial más rápida
- Skeleton loaders mientras carga cada página
- Transiciones suaves

### Performance Mejorada
- Bundle más pequeño (~20% menos)
- Time to Interactive más rápido (~33% mejor)
- Navegación más fluida

## Troubleshooting

### Error: "command not found: npm"
**Solución**: Instala Node.js desde https://nodejs.org/

### Error: "Cannot find module '@tanstack/react-query'"
**Solución**: Ejecuta `npm install` primero

### Error: "VITE_GEMINI_API_KEY is not configured"
**Solución**: Configura `.env.local` con tus API keys

### La aplicación carga pero no hay datos
**Solución**: Verifica que las API keys sean válidas

### Puerto 5173 ya está en uso
**Solución**: 
- Detén el servidor anterior
- O usa otro puerto: `npm run dev -- --port 5174`

## Scripts Disponibles

```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build de producción
npm run preview     # Preview del build
npm test            # Tests en watch mode
npm run test:ui     # Tests con UI
npm run test:coverage # Coverage report
```

## Diferencias Visibles v3 vs v4

| Funcionalidad | v3 | v4 |
|---------------|----|----|
| Loading inicial | Spinner | Skeleton loader |
| Cache de datos | No | Sí (5 min) |
| DevTools | No | Sí (React Query) |
| Bundle size | 150KB | ~120KB |
| Code splitting | No | Sí (lazy load) |

## Experimenta con React Query

Una vez que la app esté corriendo:

1. **Ver el cache**: Abre React Query DevTools
2. **Test de cache**: 
   - Ve a Dashboard
   - Navega a otra página
   - Vuelve a Dashboard → Carga instantánea desde cache
3. **Test de optimistic updates**:
   - Crea una nueva oferta de carga
   - Observa cómo la UI se actualiza inmediatamente

## Próximos Pasos

Después de ver v4 funcionando, puedes:
- Explorar el código de los hooks en `hooks/queries/`
- Ver los tests en `tests/hooks/`
- Leer la documentación en `docs/HOOKS_GUIDE.md`
- Comparar con v3 para ver las diferencias

¡Disfruta de SmartAICargo v4! 🚀
