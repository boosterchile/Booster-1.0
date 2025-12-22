# 🌐 Guía de Deployment: SmartAICargo en la Web

Esta guía cubre múltiples opciones para desplegar SmartAICargo, desde la más simple (y gratis) hasta opciones enterprise en Google Cloud y AWS.

---

## 🎯 Opciones Recomendadas

| Opción | Dificultad | Costo | Mejor Para |
|--------|-----------|-------|------------|
| **Vercel** | ⭐ Fácil | Gratis | Desarrollo, demos, MVP |
| **Netlify** | ⭐ Fácil | Gratis | Similar a Vercel |
| **Google Cloud Run** | ⭐⭐ Media | ~$5-10/mes | Producción pequeña |
| **AWS Amplify** | ⭐⭐ Media | ~$5-10/mes | Integración AWS |
| **Google App Engine** | ⭐⭐⭐ Media-Alta | ~$10-20/mes | Producción escalable |
| **AWS S3 + CloudFront** | ⭐⭐⭐ Alta | ~$1-5/mes | Producción optimizada |

---

# 🚀 Opción 1: Vercel (RECOMENDADO - Más Fácil)

**Ventajas**:
- ✅ **100% Gratis** para proyectos personales
- ✅ Deploy en **1 minuto**
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Preview automático de PRs

## Paso 1: Preparar el Proyecto

```bash
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4

# Build de producción
npm run build
```

Esto genera una carpeta `dist/` con todos los archivos estáticos.

## Paso 2: Crear cuenta en Vercel

1. Ve a https://vercel.com
2. Click en **"Sign Up"**
3. Usa **"Continue with GitHub"** (recomendado)
4. Autoriza Vercel

## Paso 3: Deploy desde la Web UI

### Opción A: Drag & Drop (Más Simple)

1. En Vercel, click en **"Add New" → "Project"**
2. Click en **"Browse"** o arrastra la carpeta `dist/`
3. Vercel detecta automáticamente que es un proyecto Vite
4. Click en **"Deploy"**
5. ¡Listo! En ~30 segundos tendrás una URL como: `https://smartaicargo-v4.vercel.app`

### Opción B: Conectar con Git (Mejor para Producción)

1. Primero, sube tu código a GitHub:
   ```bash
   cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4
   git init
   git add .
   git commit -m "Initial commit - SmartAICargo v4"
   
   # Crea un repo en GitHub y luego:
   git remote add origin https://github.com/TU_USUARIO/smartaicargo-v4.git
   git push -u origin main
   ```

2. En Vercel:
   - Click en **"Import Project"**
   - Selecciona tu repositorio de GitHub
   - Vercel detecta automáticamente la configuración
   - Click en **"Deploy"**

3. Configure variables de entorno:
   - En el dashboard de Vercel → Tu proyecto → **Settings** → **Environment Variables**
   - Agregar:
     - `VITE_GEMINI_API_KEY` = tu_api_key
     - `VITE_GOOGLE_MAPS_API_KEY` = tu_api_key

4. **Redeploy** para que tome las variables.

## Paso 4: Configurar Dominio Personalizado (Opcional)

1. En Vercel → Tu proyecto → **Settings** → **Domains**
2. Agregar tu dominio (ej: `smartaicargo.com`)
3. Seguir instrucciones DNS de Vercel
4. HTTPS automático con Let's Encrypt

---

# 🟦 Opción 2: Google Cloud Run

**Ideal para**: Apps con tráfico variable, escalamiento automático

**Costo estimado**: $5-10/mes (con free tier: $0 primeros 2M requests)

## Paso 1: Preparar el Proyecto

Crear un `Dockerfile` en la raíz del proyecto:

```dockerfile
# /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4/Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Stage 2: Servir con nginx
FROM nginx:alpine

# Copiar build al servidor
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
```

Crear `nginx.conf`:

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Configuración para SPA (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Paso 2: Setup de Google Cloud

```bash
# Instalar Google Cloud SDK
# macOS:
brew install --cask google-cloud-sdk

# Inicializar
gcloud init

# Login
gcloud auth login

# Crear proyecto (reemplaza con tu ID único)
gcloud projects create smartaicargo-prod --name="SmartAICargo"

# Set proyecto activo
gcloud config set project smartaicargo-prod

# Habilitar APIs necesarias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

## Paso 3: Build y Deploy

```bash
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4

# Build imagen Docker
gcloud builds submit --tag gcr.io/smartaicargo-prod/smartaicargo-v4

# Deploy a Cloud Run
gcloud run deploy smartaicargo-v4 \
  --image gcr.io/smartaicargo-prod/smartaicargo-v4 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "VITE_GEMINI_API_KEY=tu_key,VITE_GOOGLE_MAPS_API_KEY=tu_key"
```

Obtendrás una URL como: `https://smartaicargo-v4-xxxxx-uc.a.run.app`

## Paso 4: Configurar Dominio Personalizado

```bash
# Mapear dominio
gcloud run domain-mappings create \
  --service smartaicargo-v4 \
  --domain smartaicargo.com \
  --region us-central1

# Seguir instrucciones DNS que te da
```

---

# 🟧 Opción 3: AWS Amplify

**Ideal para**: Integración con ecosistema AWS

## Paso 1: Instalar AWS Amplify CLI

```bash
npm install -g @aws-amplify/cli

# Configurar credenciales AWS
amplify configure
```

## Paso 2: Inicializar Amplify en el Proyecto

```bash
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4

amplify init

# Responder:
# - Enter a name: smartaicargo-v4
# - Environment: prod
# - Editor: Visual Studio Code
# - App type: javascript
# - Framework: react
# - Source Directory: src
# - Distribution Directory: dist
# - Build Command: npm run build
# - Start Command: npm run dev
```

## Paso 3: Agregar Hosting

```bash
amplify add hosting

# Responder:
# - Select plugin: Hosting with Amplify Console
# - Type: Manual deployment
```

## Paso 4: Deploy

```bash
npm run build
amplify publish
```

Obtendrás una URL como: `https://main.xxxxxx.amplifyapp.com`

## Paso 5: Variables de Entorno

1. Ve a AWS Amplify Console
2. Tu app → **Environment variables**
3. Agregar:
   - `VITE_GEMINI_API_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`
4. Redeploy

---

# 🔷 Opción 4: AWS S3 + CloudFront (Más Optimizado)

**Ideal para**: Máximo performance, bajo costo

## Paso 1: Build del Proyecto

```bash
cd /Users/felipevicencio/.gemini/antigravity/playground/ruby-crater/smartaicargo-v4
npm run build
```

## Paso 2: Crear S3 Bucket

```bash
# Instalar AWS CLI
brew install awscli

# Configurar
aws configure

# Crear bucket (nombre debe ser único globalmente)
aws s3 mb s3://smartaicargo-v4-app

# Configurar para hosting estático
aws s3 website s3://smartaicargo-v4-app \
  --index-document index.html \
  --error-document index.html
```

## Paso 3: Subir Archivos

```bash
# Subir dist/
aws s3 sync dist/ s3://smartaicargo-v4-app \
  --acl public-read \
  --cache-control "max-age=31536000,public,immutable"

# index.html sin cache
aws s3 cp dist/index.html s3://smartaicargo-v4-app/index.html \
  --acl public-read \
  --cache-control "no-cache"
```

## Paso 4: Configurar CloudFront (CDN)

1. Ve a AWS Console → CloudFront
2. **Create Distribution**
3. Configuración:
   - **Origin**: Tu bucket S3
   - **Viewer Protocol**: Redirect HTTP to HTTPS
   - **Price Class**: Use all edge locations
   - **Alternate Domain**: tu-dominio.com (opcional)
4. **Create Distribution**
5. Espera ~15 minutos para propagación

Obtendrás una URL como: `https://d111111abcdef8.cloudfront.net`

## Paso 5: Script de Deploy Automatizado

Crea `deploy-aws.sh`:

```bash
#!/bin/bash

# Build
echo "🔨 Building..."
npm run build

# Upload to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://smartaicargo-v4-app \
  --delete \
  --acl public-read \
  --cache-control "max-age=31536000,public,immutable" \
  --exclude "index.html"

# Upload index.html sin cache
aws s3 cp dist/index.html s3://smartaicargo-v4-app/index.html \
  --acl public-read \
  --cache-control "no-cache"

# Invalidar CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id TU_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deploy complete!"
echo "🌐 URL: https://d111111abcdef8.cloudfront.net"
```

```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

---

# 📊 Comparación de Costos Mensuales

| Opción | Tráfico Bajo | Tráfico Medio | Tráfico Alto |
|--------|--------------|---------------|--------------|
| **Vercel (gratis)** | $0 | $0 (hasta 100GB) | $20+ |
| **Netlify (gratis)** | $0 | $0 (hasta 100GB) | $19+ |
| **Google Cloud Run** | $0* | $5-10 | $20-50 |
| **AWS Amplify** | $0.15 | $5-10 | $20-40 |
| **AWS S3+CloudFront** | $1 | $5 | $10-20 |

*Con free tier de Google Cloud

---

# 🎯 Recomendación por Caso de Uso

## Para Demos y Desarrollo
→ **Vercel** o **Netlify**
- Gratis
- Deploy en 1 minuto
- HTTPS automático

## Para Producción Pequeña/Media
→ **Google Cloud Run** o **AWS Amplify**
- Escalamiento automático
- Pay-as-you-go
- Fácil de gestionar

## Para Producción Enterprise
→ **AWS S3 + CloudFront**
- Máximo performance
- Menor costo a escala
- Control total

---

# ✅ Checklist Post-Deploy

- [ ] App accesible vía HTTPS
- [ ] Variables de entorno configuradas
- [ ] Gemini AI funciona correctamente
- [ ] Google Maps carga sin errores
- [ ] Rutas de React Router funcionan (no 404)
- [ ] PWA installable (opcional)
- [ ] Dominio personalizado configurado (opcional)
- [ ] Monitoreo configurado (opcional)

---

# 🔒 Seguridad en Producción

⚠️ **IMPORTANTE**: Las API keys están expuestas en el frontend.

**Soluciones**:

1. **Para Gemini AI**: Crear un backend proxy
   ```
   Frontend → Tu Backend → Gemini AI
   ```

2. **Limitar API Keys por dominio**:
   - Google Cloud Console → API Keys
   - Restringir por URL: `https://tu-dominio.com/*`

3. **Rate Limiting**: Configurar en Google Cloud

---

¿Qué opción prefieres? ¿Quieres que te ayude con alguna en específico?
