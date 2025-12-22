#!/bin/bash

# Script de deployment rápido para Vercel

echo "🚀 Deploying SmartAICargo to Vercel..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Run this script from the smartaicargo-v4 directory"
    exit 1
fi

# 1. Build
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "📤 Next steps:"
echo ""
echo "Option 1 - Drag & Drop (Easiest):"
echo "  1. Go to https://vercel.com"
echo "  2. Sign up/login"
echo "  3. Click 'New Project'"
echo "  4. Drag the 'dist' folder"
echo "  5. Click 'Deploy'"
echo ""
echo "Option 2 - Vercel CLI:"
echo "  npm install -g vercel"
echo "  vercel"
echo ""
echo "Your build is ready in: ./dist"
echo ""
