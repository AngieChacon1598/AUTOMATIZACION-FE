# ✅ Verificación del Módulo de Encuestas

## 📋 Estado Actual del Proyecto

### ✅ Lo que YA existe:

1. **Servicio de API** (`src/shared/api/apiService.js`):
   - ✅ `encuestasEgresadosService` con todos los métodos CRUD
   - ✅ Endpoint configurado: `/api/crud/encuestas-egresados`

2. **Configuración de Backend** (`src/shared/backend.js`):
   - ✅ `ENCUESTAS_ENDPOINTS` configurado

3. **Rutas en App.jsx**:
   - ✅ Ruta `/encuestas` existe
   - ✅ Ruta `/encuestas/:tipo` existe

4. **Componentes existentes**:
   - ✅ `src/widgets/encuestas/Encuestas.jsx` (lista de tipos)
   - ✅ `src/widgets/encuestas/EncuestaFormulario.jsx`

### ⚠️ Lo que FALTA verificar/crear:

1. **Hook personalizado**:
   - ❓ ¿Existe `useEncuestas` en `src/shared/useApi.jsx`?

2. **Componentes del nuevo módulo**:
   - ❓ ¿Existe `src/widgets/encuesta_egresado/` o necesita crearse?
   - ❓ ¿Existen los archivos mencionados en la guía?

3. **Endpoint del backend**:
   - ⚠️ **IMPORTANTE**: La guía dice que el endpoint debe ser `/encuestas` (sin `/api`)
   - ⚠️ Pero el código actual usa `/api/crud/encuestas-egresados`
   - ⚠️ **Necesitas verificar cuál es el endpoint correcto en tu backend**

4. **Navbar**:
   - ❓ ¿Tiene el enlace a `/encuestas`?

---

## 🔍 Verificaciones Necesarias ANTES de Modificar

### 1. Verificar Endpoint del Backend

**Pregunta clave**: ¿Cuál es el endpoint correcto en tu backend?

- Opción A: `/encuestas` (según la guía)
- Opción B: `/api/crud/encuestas-egresados` (según código actual)

**Cómo verificar**:
```bash
# Prueba con curl o Postman
curl https://automatizacion-dvl5.onrender.com/encuestas
curl https://automatizacion-dvl5.onrender.com/api/crud/encuestas-egresados
```

### 2. Verificar si existe el hook useEncuestas

**Archivo**: `src/shared/useApi.jsx`

**Buscar**: Función `useEncuestas` o similar

### 3. Verificar estructura de carpetas

**Buscar si existe**:
```
src/widgets/encuesta_egresado/
  - EncuestaEgresados.jsx
  - EncuestaEgresadosForm.jsx
  - EncuestaEgresadosEditForm.jsx
  - EncuestaDetailModal.jsx
  - index.js
  - EncuestaEgresados.css
```

---

## 📝 Plan de Acción (SIN modificar otros módulos)

### Paso 1: Verificar Endpoint del Backend
- [ ] Probar endpoint `/encuestas` en el backend
- [ ] Probar endpoint `/api/crud/encuestas-egresados` en el backend
- [ ] Confirmar cuál es el correcto

### Paso 2: Actualizar Configuración (si es necesario)
- [ ] Si el endpoint es diferente, actualizar `src/shared/backend.js`
- [ ] **Solo modificar la línea de ENCUESTAS_ENDPOINTS**

### Paso 3: Crear/Verificar Hook useEncuestas
- [ ] Verificar si existe en `src/shared/useApi.jsx`
- [ ] Si no existe, crear el hook
- [ ] **Solo agregar al final del archivo, sin modificar otros hooks**

### Paso 4: Crear Componentes del Módulo
- [ ] Crear carpeta `src/widgets/encuesta_egresado/` (si no existe)
- [ ] Crear componentes según la guía
- [ ] **No modificar componentes existentes en `src/widgets/encuestas/`**

### Paso 5: Actualizar Rutas (si es necesario)
- [ ] Verificar si las rutas actuales funcionan
- [ ] Agregar nuevas rutas si es necesario
- [ ] **No modificar rutas de otros módulos**

### Paso 6: Verificar Navbar
- [ ] Verificar que tenga enlace a `/encuestas`
- [ ] Agregar si falta
- [ ] **No modificar otros enlaces**

---

## ⚠️ IMPORTANTE: Reglas de Modificación

1. ✅ **SÍ puedes modificar**:
   - Archivos relacionados SOLO con encuestas
   - Agregar nuevos archivos
   - Actualizar configuración de endpoints

2. ❌ **NO puedes modificar**:
   - Componentes de egresados
   - Componentes de empresas
   - Componentes de certificaciones
   - Componentes de reportes
   - Otros módulos que funcionan

3. ✅ **SÍ puedes agregar**:
   - Nuevos hooks al final de `useApi.jsx`
   - Nuevas rutas en `App.jsx`
   - Nuevos componentes

---

## 🚀 Próximos Pasos

1. **Primero**: Verificar el endpoint correcto del backend
2. **Segundo**: Confirmar qué componentes ya existen
3. **Tercero**: Crear solo lo que falta
4. **Cuarto**: Probar localmente antes de hacer push

---

**¿Quieres que verifique estos puntos ahora o prefieres hacerlo tú primero?**

