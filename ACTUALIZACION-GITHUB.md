# Guía de Actualización Automática a GitHub

## 🚀 Métodos de Actualización

### Método 1: Actualización Automática Continua

Este método monitorea cambios cada 5 minutos y los sube automáticamente a GitHub.

**Iniciar el monitor automático:**

```bash
./auto-update.sh
```

**Cambiar el intervalo (ejemplo: cada 2 minutos = 120 segundos):**

```bash
./auto-update.sh 120
```

**Detener el monitor:**
Presiona `Ctrl + C` en la terminal

---

### Método 2: Push Rápido Manual

Cuando termines de hacer cambios y quieras subirlos inmediatamente:

**Con mensaje personalizado:**

```bash
./quick-push.sh "Descripción de los cambios"
```

**Con mensaje automático (timestamp):**

```bash
./quick-push.sh
```

---

### Método 3: Comandos Git Tradicionales

Si prefieres control total:

```bash
# Ver cambios
git status

# Agregar cambios
git add .

# Crear commit
git commit -m "Descripción de cambios"

# Subir a GitHub
git push origin main
```

---

## 📋 Recomendaciones

1. **Para desarrollo activo:** Usa `quick-push.sh` cuando termines cada funcionalidad
2. **Para monitoreo continuo:** Deja `auto-update.sh` corriendo en una terminal separada
3. **Para control preciso:** Usa comandos Git tradicionales

---

## ⚠️ Notas Importantes

- Los scripts automáticos crean commits con timestamps
- Asegúrate de tener conexión a internet para push
- Los cambios se suben a la rama `main`
- Verifica que tengas permisos de escritura en el repositorio

---

## 🔧 Troubleshooting

**Si obtienes error de permisos:**

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

**Si necesitas forzar el push:**

```bash
git push origin main --force
```

(⚠️ Usar con precaución)

---

## 📊 Ver Historial de Commits

```bash
git log --oneline -10
```

Esto muestra los últimos 10 commits realizados.
