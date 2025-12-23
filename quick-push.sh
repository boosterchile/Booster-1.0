#!/bin/bash

# Script rápido para commit y push
# Uso: ./quick-push.sh "mensaje del commit"

MESSAGE=${1:-"Update: $(date '+%Y-%m-%d %H:%M:%S')"}

echo "📝 Agregando cambios..."
git add .

echo "💾 Creando commit..."
git commit -m "$MESSAGE"

echo "⬆️  Subiendo a GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ ¡Cambios subidos exitosamente!"
else
    echo "❌ Error al subir cambios"
    exit 1
fi
