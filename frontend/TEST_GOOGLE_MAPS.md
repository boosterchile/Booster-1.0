# Cómo Probar la API de Google Maps en Booster 1.0

Este documento describe los pasos para verificar que la integración con la API de Google Maps está funcionando correctamente.

## 1. Verificación de Configuración

Asegúrate de que el archivo `.env.local` en la carpeta `frontend` contenga tu clave de API válida:

```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

> **Nota:** La clave proporcionada actualmente comienza con `AIzaSyBV...`.

## 2. Ejecutar la Aplicación

El servidor de desarrollo ya debería estar ejecutándose. Si no es así, inicia el frontend:

```bash
cd frontend
npm run dev
```

La aplicación estará disponible típicamente en `http://localhost:3000` (revisar la consola para el puerto exacto).

## 3. Navegar a la Vista de Mapa

La funcionalidad de mapas se encuentra principalmente en la sección de **Envíos** (Shipments).

1. Abre tu navegador y ve a: `http://localhost:3000`
2. Inicia sesión (puedes usar las credenciales de prueba o registrarte si es necesario, o navegar directamente si no hay auth estricta en dev).
3. En el menú lateral, haz clic en **Envíos** o navega directamente a: `http://localhost:3000/shipments`

## 4. Qué Esperar

* Deberías ver una lista de envíos a la izquierda.
* Al seleccionar un envío (por ejemplo, `SMRTCGO-001`), el panel derecho debería cargar un mapa de Google Maps mostrando la ubicación del envío con un marcador.
* Si ves un mapa gris o un mensaje de error, revisa la sección de solución de problemas.

## 5. Solución de Problemas Comunes

Si el mapa no carga, abre la consola del desarrollador del navegador (F12 o Clic derecho -> Inspeccionar -> Consola) y busca errores:

* **RefererNotAllowedMapError**: Significa que la clave API tiene restricciones de HTTP Referrer que no incluyen `localhost`. Deberás agregar `http://localhost:3000/*` a las restricciones de tu clave en la Google Cloud Console.
* **ApiNotActivatedMapError**: La API de "Maps JavaScript API" no está habilitada en tu proyecto de Google Cloud.
* **BillingNotEnabledMapError**: El proyecto de Google Cloud no tiene una cuenta de facturación asociada.
* **InvalidKeyMapError**: La clave API es incorrecta o ha sido borrada.

## 6. Componentes Relacionados

* `components/GoogleMapComponent.tsx`: El componente reutilizable del mapa.
* `pages/VisibilitySecurityPage.tsx`: La página que implementa el mapa.
* `App.tsx`: Donde se configura el `APIProvider`.
