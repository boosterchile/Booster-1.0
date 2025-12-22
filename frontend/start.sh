#!/bin/bash

# SmartAICargo v4 - Script de inicio rápido

echo "🚀 Iniciando SmartAICargo v4..."
echo ""

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado"
    echo "Por favor ejecuta este script desde el directorio smartaicargo-v4"
    exit 1
fi

# 2. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias"
    exit 1
fi

# 3. Verificar .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  ADVERTENCIA: .env.local no encontrado"
    echo ""
    echo "Crea un archivo .env.local con tus API keys:"
    echo ""
    echo "VITE_GEMINI_API_KEY=tu_api_key_aqui"
    echo "VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui"
    echo ""
    echo "Puedes copiar .env.example como plantilla:"
    echo "  cp .env.example .env.local"
    echo ""
    read -p "¿Continuar sin .env.local? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 4. Iniciar servidor de desarrollo
echo ""
echo "✨ Iniciando servidor de desarrollo..."
echo "🌐 La aplicación estará disponible en: http://localhost:5173"
echo ""
echo "Para detener el servidor presiona Ctrl+C"
echo ""

npm run dev
