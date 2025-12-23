#!/bin/bash

# Script para iniciar Booster 1.0 (Backend + Frontend)

echo "🚀 Iniciando Booster 1.0..."

# Matar procesos en puertos 3000 y 3001 si existen
pkill -f "node" || true

# Iniciar Backend
echo "📡 Iniciando Backend en puerto 3001..."
cd backend
npm install > /dev/null 2>&1
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Esperar un momento para asegurar que el backend suba
sleep 3

# Iniciar Frontend
echo "💻 Iniciando Frontend en puerto 3000..."
cd ../frontend
npm install > /dev/null 2>&1
npm run dev -- --host 0.0.0.0 --port 3000 > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"

echo "___________________________________________________"
echo "🌐 PLATAFORMA DISPONIBLE EN:"
echo "👉 http://localhost:3000"
echo "___________________________________________________"
echo "⚠️  Para detener: Ejecuta 'pkill -f node' o cierra esta terminal"

# Mantener script corriendo para ver logs si se desea, o salir
# Aquí simplemente salimos para dejar los procesos en background pero informamos al usuario.
