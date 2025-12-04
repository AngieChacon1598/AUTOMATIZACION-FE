# ✅ Checklist de Despliegue en Render

## 📋 Antes de Desplegar

- [x] ✅ Backend desplegado en `https://automatizacion-dvl5.onrender.com`
- [x] ✅ Build funciona localmente (`npm run build`)
- [x] ✅ Carpeta `build` se genera correctamente
- [x] ✅ Variables de entorno documentadas en `env.example`
- [x] ✅ Configuración de Vite optimizada para producción
- [x] ✅ Código en la rama `develop` (o la rama que uses)

## 🚀 Pasos para Desplegar en Render

### 1. Crear Static Site
- [ ] Ir a [Render Dashboard](https://dashboard.render.com)
- [ ] Clic en **"+ New +"** → **"Static Site"**
- [ ] Conectar repositorio (GitHub/GitLab/Bitbucket)

### 2. Configuración Básica
- [ ] **Name:** `seguimiento-egresados-frontend` (o el nombre que prefieras)
- [ ] **Branch:** `develop` (o tu rama de producción)
- [ ] **Root Directory:** (dejar vacío)

### 3. Configuración de Build
- [ ] **Build Command:** `npm install && npm run build`
- [ ] **Publish Directory:** `build`

### 4. Variables de Entorno
Agregar en la sección "Environment Variables":

```
VITE_BACKEND_URL=https://automatizacion-dvl5.onrender.com
VITE_API_BASE_URL=https://automatizacion-dvl5.onrender.com/api
VITE_API_TIMEOUT=10000
VITE_CORS_ENABLED=true
NODE_ENV=production
```

### 5. Configuración Avanzada (Opcional)
- [ ] **Auto-Deploy:** `Yes`
- [ ] **Pull Request Previews:** `Yes` (opcional)

### 6. Desplegar
- [ ] Clic en **"Create Static Site"**
- [ ] Esperar a que termine el build (3-5 minutos)
- [ ] Anotar la URL proporcionada: `https://tu-frontend.onrender.com`

## ✅ Verificación Post-Deploy

- [ ] El frontend carga correctamente en la URL de Render
- [ ] No hay errores en la consola del navegador (F12)
- [ ] El login funciona y se conecta al backend
- [ ] Las peticiones API apuntan a `https://automatizacion-dvl5.onrender.com`
- [ ] Todas las funcionalidades principales funcionan:
  - [ ] Dashboard
  - [ ] Lista de egresados
  - [ ] Lista de empresas
  - [ ] Reportes
  - [ ] Encuestas

## 📝 Resumen de Configuración

| Configuración | Valor |
|--------------|-------|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |
| **Branch** | `develop` |
| **Backend URL** | `https://automatizacion-dvl5.onrender.com` |

## 🔗 URLs

- **Backend:** `https://automatizacion-dvl5.onrender.com`
- **Frontend:** `https://tu-frontend.onrender.com` (se generará después del deploy)

## 🐛 Si Algo Sale Mal

Consulta [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) para:
- Solución de problemas comunes
- Errores de build
- Problemas de conexión con el backend
- Errores de variables de entorno

## 📚 Documentación

- [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) - Guía completa de despliegue
- [README.md](./README.md) - Documentación general del proyecto

---

**¡Listo para desplegar!** 🚀

