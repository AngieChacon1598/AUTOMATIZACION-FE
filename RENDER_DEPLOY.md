# 🚀 Guía de Despliegue en Render

Esta guía te ayudará a desplegar tu frontend en Render como un **Static Site**.

## ✅ Prerrequisitos Completados

- ✅ Backend desplegado: `https://automatizacion-dvl5.onrender.com`
- ✅ Proyecto React con Vite configurado
- ✅ Variables de entorno configuradas

## 📋 Configuración para Render

### Paso 1: Crear Static Site en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en **"+ New +"** o **"+ Add new"**
3. Selecciona **"Static Site"**

### Paso 2: Conectar Repositorio

1. **Connect a repository:**
   - Si tu repositorio ya está conectado, selecciónalo
   - Si no, conecta tu cuenta de GitHub/GitLab/Bitbucket
   - Selecciona el repositorio que contiene tu frontend

2. **Configuración básica:**
   - **Name:** `seguimiento-egresados-frontend` (o el nombre que prefieras)
   - **Branch:** `develop` (o la rama que uses para producción)
   - **Root Directory:** (dejar vacío - el frontend está en la raíz)

### Paso 3: Configurar Build y Deploy

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
build
```

> ⚠️ **Importante:** El proyecto está configurado para generar la carpeta `build` (no `dist` como es común en Vite)

### Paso 4: Configurar Variables de Entorno

En la sección **"Environment Variables"** de Render, agrega:

```
VITE_BACKEND_URL=https://automatizacion-dvl5.onrender.com
VITE_API_BASE_URL=https://automatizacion-dvl5.onrender.com/api
VITE_API_TIMEOUT=10000
VITE_CORS_ENABLED=true
NODE_ENV=production
```

> 📝 **Nota:** Las variables de entorno con prefijo `VITE_` son las que Vite expone al código del frontend.

### Paso 5: Configuración Avanzada (Opcional)

En la sección **"Advanced"**:
- **Auto-Deploy:** `Yes` (para despliegues automáticos en cada push)
- **Pull Request Previews:** `Yes` (opcional, para previsualizar PRs)

### Paso 6: Desplegar

1. Haz clic en **"Create Static Site"**
2. Render comenzará a construir y desplegar tu frontend
3. Espera a que termine el build (puede tardar 3-5 minutos)
4. Una vez completado, Render te dará una URL como: `https://tu-frontend.onrender.com`

## 🔍 Verificación del Despliegue

1. ✅ Visita la URL que Render te proporcionó
2. ✅ Verifica que el frontend se carga correctamente
3. ✅ Prueba hacer login para asegurarte de que la comunicación con el backend funciona
4. ✅ Revisa la consola del navegador (F12) para ver si hay errores

## 🐛 Solución de Problemas

### Error: "Build failed"

**Causa:** Error en el comando de build

**Solución:**
- Revisa los logs de build en Render (haz clic en el deploy y luego en "Logs")
- Verifica que todos los scripts estén en `package.json`
- Asegúrate de que las dependencias estén correctamente instaladas
- Verifica que Node.js esté en una versión compatible (Render usa Node 18+ por defecto)

### Error: "404 Not Found" al navegar

**Causa:** Rutas del SPA no configuradas

**Solución:**
- Render maneja esto automáticamente para Static Sites
- Si persiste, verifica que el `Publish Directory` sea `build`
- Asegúrate de que el `index.html` esté en la carpeta `build`

### Error: "Cannot connect to API"

**Causa:** URL del backend incorrecta o CORS

**Solución:**
- Verifica que `VITE_BACKEND_URL` esté configurada correctamente en Render
- Revisa que el backend esté funcionando: `https://automatizacion-dvl5.onrender.com`
- Verifica la configuración de CORS en el backend (ya debería estar configurado)

### El frontend muestra "localhost" en las peticiones

**Causa:** Variables de entorno no configuradas o no se están usando

**Solución:**
- Verifica que las variables de entorno estén en Render con el prefijo `VITE_`
- Asegúrate de que las variables estén configuradas ANTES del build
- Si cambias variables de entorno, necesitas hacer un nuevo deploy (Render lo hace automáticamente)

### Error: "Module not found" o errores de importación

**Causa:** Dependencias faltantes o rutas incorrectas

**Solución:**
- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que `npm install` se ejecute correctamente
- Revisa los logs de build para ver qué módulo falta

## 📝 Resumen de Configuración

| Configuración | Valor |
|--------------|-------|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |
| **Branch** | `develop` (o tu rama de producción) |
| **Auto-Deploy** | `Yes` |
| **VITE_BACKEND_URL** | `https://automatizacion-dvl5.onrender.com` |
| **VITE_API_BASE_URL** | `https://automatizacion-dvl5.onrender.com/api` |

## 🔗 URLs Importantes

- **Backend:** `https://automatizacion-dvl5.onrender.com`
- **Frontend:** `https://tu-frontend.onrender.com` (se generará después del deploy)

## 📚 Recursos Adicionales

- [Documentación de Render - Static Sites](https://render.com/docs/static-sites)
- [Documentación de Vite - Building for Production](https://vitejs.dev/guide/build.html)
- [Variables de Entorno en Vite](https://vitejs.dev/guide/env-and-mode.html)

## ✅ Checklist Pre-Deploy

Antes de desplegar, verifica:

- [ ] El backend está funcionando en `https://automatizacion-dvl5.onrender.com`
- [ ] El código está en la rama correcta (`develop` o `main`)
- [ ] El build funciona localmente: `npm run build`
- [ ] La carpeta `build` se genera correctamente
- [ ] Las variables de entorno están documentadas en `env.example`
- [ ] No hay errores de lint o compilación

## 🎉 ¡Listo!

Una vez completado el despliegue, tu frontend estará disponible en Render y podrás acceder a él desde cualquier lugar.

**Próximos pasos:**
1. ✅ Backend desplegado
2. ⏳ Frontend desplegado
3. 🔗 Conectar frontend con backend
4. 🧪 Probar todas las funcionalidades
5. 🎉 ¡Listo para producción!

