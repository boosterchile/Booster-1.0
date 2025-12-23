#!/bin/bash

# Script de actualización automática a GitHub
# Uso: ./auto-update.sh [intervalo_en_segundos]

INTERVAL=${1:-300}  # Por defecto 5 minutos (300 segundos)

echo "🚀 Iniciando monitoreo automático de cambios..."
echo "📊 Intervalo: $INTERVAL segundos"
echo "📁 Directorio: $(pwd)"
echo "________________________________"

while true; do
    # Verificar si hay cambios
    if [[ -n $(git status -s) ]]; then
        echo ""
        echo "📝 Cambios detectados en: $(date '+%Y-%m-%d %H:%M:%S')"
        
        # Mostrar archivos modificados
        git status -s
        
        # Agregar todos los cambios
        git add .
        
        # Crear commit con timestamp
        COMMIT_MSG="Auto-update: $(date '+%Y-%m-%d %H:%M:%S')"
        git commit -m "$COMMIT_MSG"
        
        # Push a GitHub
        echo "⬆️  Subiendo cambios a GitHub..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo "✅ Actualización exitosa!"
        else
            echo "❌ Error al subir cambios. Verifica tu conexión."
        fi
    else
        echo "⏸️  Sin cambios - $(date '+%H:%M:%S')"
    fi
    
    sleep $INTERVAL
done
