# 📋 Plan de Implementación del Módulo de Encuestas

## 🎯 Objetivo
Alinear el frontend con el nuevo módulo de encuestas del backend, **SIN modificar otros módulos que funcionan**.

---

## 📝 Cambios Necesarios

### 1. ✅ Actualizar Endpoint en `src/shared/backend.js`
**Cambio**: Actualizar `ENCUESTAS_ENDPOINTS.BASE` de `/api/crud/encuestas-egresados` a `/encuestas`

**Razón**: Según la guía, el endpoint debe ser `/encuestas` (sin `/api`)

**Archivo a modificar**: Solo la línea 39 de `src/shared/backend.js`

```javascript
// ANTES:
BASE: '/api/crud/encuestas-egresados',

// DESPUÉS:
BASE: '/encuestas',
```

---

### 2. ✅ Crear Hook `useEncuestas` en `src/shared/useApi.jsx`
**Acción**: Agregar al final del archivo (sin modificar otros hooks)

**Funcionalidad**: Hook personalizado para gestionar encuestas

---

### 3. ✅ Agregar Enlace en Navbar
**Archivo**: `src/components/Navbar.jsx`

**Acción**: Agregar un nuevo `<li>` con enlace a `/encuestas`

**Ubicación**: Después de "Detalles de Egresados" y antes de "Centro Laboral"

**Código a agregar**:
```jsx
<li>
  <Link to="/encuestas">
    <FaFileAlt /> Encuestas
  </Link>
</li>
```

---

### 4. ⚠️ Verificar/Actualizar Componentes de Encuestas

**Opciones**:

**Opción A**: Si los componentes del nuevo módulo ya existen en otra ubicación
- Verificar si existen en `src/widgets/encuesta_egresado/`
- Si existen, verificar que estén correctamente configurados

**Opción B**: Si los componentes NO existen
- Crear los componentes según la guía:
  - `EncuestaEgresados.jsx` (lista)
  - `EncuestaEgresadosForm.jsx` (crear)
  - `EncuestaEgresadosEditForm.jsx` (editar)
  - `EncuestaDetailModal.jsx` (ver detalles)
  - `index.js` (exportaciones)
  - `EncuestaEgresados.css` (estilos)

**Opción C**: Actualizar componentes existentes
- Si `src/widgets/encuestas/Encuestas.jsx` necesita actualizarse
- **CUIDADO**: No romper la funcionalidad existente

---

### 5. ✅ Verificar Rutas en `src/app/App.jsx`
**Estado actual**: Las rutas `/encuestas` ya existen

**Acción**: Verificar que las rutas apunten a los componentes correctos

---

## 🔒 Reglas de Modificación

### ✅ SÍ se puede modificar:
1. `src/shared/backend.js` - Solo la línea de ENCUESTAS_ENDPOINTS
2. `src/shared/useApi.jsx` - Solo agregar hook al final
3. `src/components/Navbar.jsx` - Solo agregar enlace
4. Crear nuevos archivos en `src/widgets/encuesta_egresado/`

### ❌ NO se puede modificar:
1. Componentes de egresados
2. Componentes de empresas
3. Componentes de certificaciones
4. Componentes de reportes
5. Otros hooks en `useApi.jsx`
6. Otras rutas en `App.jsx`
7. Otros enlaces en `Navbar.jsx`

---

## 🚀 Orden de Implementación

1. **Paso 1**: Actualizar endpoint en `backend.js` (1 línea)
2. **Paso 2**: Crear hook `useEncuestas` (agregar al final)
3. **Paso 3**: Agregar enlace en Navbar (1 elemento)
4. **Paso 4**: Verificar/crear componentes (según necesidad)
5. **Paso 5**: Verificar rutas (solo verificar)
6. **Paso 6**: Probar localmente
7. **Paso 7**: Commit y push

---

## ❓ Preguntas Pendientes

1. **Endpoint**: ¿Confirmas que el endpoint es `/encuestas` y no `/api/crud/encuestas-egresados`?

2. **Componentes**: ¿Los componentes del nuevo módulo ya existen o necesito crearlos?

3. **Estructura**: ¿Prefieres mantener `src/widgets/encuestas/` o crear `src/widgets/encuesta_egresado/`?

---

## ✅ Checklist Final

Antes de hacer push:
- [ ] Endpoint actualizado
- [ ] Hook creado
- [ ] Enlace en Navbar agregado
- [ ] Componentes verificados/creados
- [ ] Rutas verificadas
- [ ] Probado localmente
- [ ] Sin errores en consola
- [ ] Otros módulos siguen funcionando

---

**¿Procedo con estos cambios o prefieres verificar algo primero?**

