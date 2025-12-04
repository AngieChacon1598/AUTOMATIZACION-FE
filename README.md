# 🎓 Sistema de Seguimiento de Egresados - Frontend

## 📋 Descripción

Frontend moderno desarrollado en React para el Sistema de Seguimiento de Egresados del Instituto Superior Tecnológico. Incluye gestión completa de egresados, empresas, encuestas y reportes con una interfaz intuitiva y responsiva.

## 🚀 Características Principales

### ✅ **Funcionalidades Implementadas**

- **🔐 Autenticación JWT completa**
  - Login/Logout seguro
  - Protección de rutas
  - Gestión de tokens automática

- **👥 Gestión de Egresados**
  - Lista con filtros avanzados (nombre, apellidos, DNI, carrera)
  - Paginación inteligente
  - Crear/Editar/Eliminar/Restaurar egresados
  - Campos completos del formulario de encuesta (21 campos)

- **🏢 Gestión de Empresas**
  - CRUD completo de empresas
  - Validaciones de RUC y datos de contacto
  - Gestión de estados (activo/inactivo)

- **📊 Dashboard Interactivo**
  - Métricas en tiempo real
  - Gráficos dinámicos (barras, líneas, pie)
  - Alertas del sistema
  - Actividad reciente

- **📈 Reportes y Analytics**
  - Egresados por carrera
  - Egresados por estado
  - Egresados por año de egreso
  - Tasa de empleabilidad

- **🎨 Interfaz Moderna**
  - Diseño responsivo
  - Componentes reutilizables
  - Estados de carga
  - Mensajes de feedback
  - Animaciones suaves

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos interactivos
- **React Icons** - Iconografía
- **Tailwind CSS** - Estilos
- **CSS Modules** - Estilos modulares

## 📦 Instalación y Configuración

### 1. **Instalar Dependencias**
```bash
cd front-end
npm install
```

### 2. **Configurar Variables de Entorno**
Crear archivo `.env` en la raíz del proyecto:
```env
VITE_BACKEND_URL=http://localhost:5001
VITE_API_BASE_URL=http://localhost:5001/api
VITE_API_TIMEOUT=10000
VITE_CORS_ENABLED=true
```

### 3. **Ejecutar en Desarrollo**
```bash
npm run dev
```

### 4. **Compilar para Producción**
```bash
npm run build
```

## 🔧 Configuración del Backend

### **URL Base del Backend**
```
http://localhost:5001
```

### **Credenciales por Defecto**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### **Endpoints Principales**
- **Autenticación:** `/api/auth/*`
- **Egresados:** `/api/crud/egresados/*`
- **Empresas:** `/api/crud/empresas/*`
- **Reportes:** `/api/reportes/*`

## 📁 Estructura del Proyecto

```
front-end/
├── src/
│   ├── components/          # Componentes React
│   │   ├── auth/           # Autenticación
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── egresados/      # Gestión de egresados
│   │   ├── empresas/       # Gestión de empresas
│   │   ├── layout/         # Layout y navegación
│   │   ├── shared/         # Componentes compartidos
│   │   └── reportes/       # Reportes y analytics
│   ├── contexts/           # Contextos React
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Servicios API
│   ├── styles/             # Estilos CSS
│   ├── utils/              # Utilidades
│   └── config/             # Configuración
├── public/                 # Archivos públicos
└── package.json           # Dependencias
```

## 🎯 Componentes Principales

### **🔐 Autenticación**
- `Login.jsx` - Formulario de login
- `ProtectedRoute.jsx` - Protección de rutas
- `AuthContext.jsx` - Contexto de autenticación

### **👥 Egresados**
- `EgresadoList.jsx` - Lista con filtros y paginación
- `AgregarEgresado.jsx` - Formulario de creación
- `EditarEgresado.jsx` - Formulario de edición

### **🏢 Empresas**
- `EmpresaList.jsx` - Lista de empresas
- `EmpresaForm.jsx` - Formulario de empresa

### **📊 Dashboard**
- `Dashboard.jsx` - Dashboard principal con métricas y gráficos

### **📈 Reportes**
- `AnalyticsReportes.jsx` - Reportes detallados

## 🔄 Hooks Personalizados

### **useAuth**
```javascript
const { user, login, logout, isAuthenticated } = useAuth();
```

### **useEgresados**
```javascript
const { 
  egresados, 
  loading, 
  fetchEgresados, 
  createEgresado, 
  updateEgresado, 
  deleteEgresado 
} = useEgresados();
```

### **useEmpresas**
```javascript
const { 
  empresas, 
  loading, 
  fetchEmpresas, 
  createEmpresa, 
  updateEmpresa, 
  deleteEmpresa 
} = useEmpresas();
```

### **useReportes**
```javascript
const { 
  reportes, 
  loading, 
  fetchReportes 
} = useReportes();
```

## 📊 Servicios API

### **Servicios Principales**
- `authService.js` - Autenticación JWT
- `apiService.js` - Servicios CRUD completos
- `api.js` - Compatibilidad con código existente

### **Endpoints Disponibles**

#### **Egresados**
- `GET /api/crud/egresados` - Listar con filtros
- `POST /api/crud/egresados` - Crear egresado
- `PUT /api/crud/egresados/{codigo}` - Actualizar
- `DELETE /api/crud/egresados/{codigo}` - Eliminar lógicamente
- `PUT /api/crud/egresados/{codigo}/restaurar` - Restaurar

#### **Empresas**
- `GET /api/crud/empresas` - Listar empresas
- `POST /api/crud/empresas` - Crear empresa
- `PUT /api/crud/empresas/{id}` - Actualizar empresa
- `DELETE /api/crud/empresas/{id}` - Eliminar lógicamente
- `PUT /api/crud/empresas/{id}/restaurar` - Restaurar empresa

#### **Reportes**
- `GET /api/reportes/egresados-por-carrera` - Por carrera
- `GET /api/reportes/egresados-por-estado` - Por estado
- `GET /api/reportes/egresados-por-anio` - Por año

## 🎨 Estilos y UX

### **Archivos de Estilos**
- `ux-improvements.css` - Mejoras de UX
- `unified-tables.css` - Estilos de tablas
- `Dashboard.css` - Estilos del dashboard

### **Características UX**
- ✅ Estados de carga con spinners
- ✅ Mensajes de feedback claros
- ✅ Validaciones en tiempo real
- ✅ Animaciones suaves
- ✅ Diseño responsivo
- ✅ Accesibilidad mejorada

## 🔍 Validaciones Implementadas

### **Egresados**
- Código único (formato EG001)
- DNI de 8 dígitos
- Email válido
- Teléfonos de 9 dígitos
- Campos requeridos

### **Empresas**
- RUC de 11 dígitos
- Email válido
- Teléfonos de 9 dígitos
- Campos únicos

## 🚀 Funcionalidades Avanzadas

### **Filtros Inteligentes**
- Búsqueda por nombre, apellidos, DNI
- Filtro por carrera profesional
- Filtro por estado (activo/inactivo)
- Paginación configurable

### **Dashboard Dinámico**
- Métricas en tiempo real
- Gráficos interactivos
- Alertas automáticas
- Actividad reciente

### **Gestión de Estados**
- Eliminación lógica (no física)
- Restauración de registros
- Estados de carga
- Manejo de errores

## 📱 Responsive Design

El sistema está completamente optimizado para:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔧 Configuración Avanzada

### **Personalización de Estilos**
Los estilos se pueden personalizar modificando:
- `tailwind.config.js` - Configuración de Tailwind
- `src/styles/` - Archivos CSS personalizados

### **Configuración de API**
Modificar `src/config/backend.js` para cambiar:
- URLs del backend
- Timeouts
- Headers por defecto

## 🐛 Solución de Problemas

### **Error de Conexión**
1. Verificar que el backend esté ejecutándose en `http://localhost:5001`
2. Revisar la configuración CORS del backend
3. Verificar las credenciales de autenticación

### **Error de Autenticación**
1. Verificar que el token JWT sea válido
2. Revisar la configuración de headers
3. Comprobar la expiración del token

### **Problemas de Estilos**
1. Verificar que Tailwind CSS esté instalado
2. Revisar las importaciones de CSS
3. Comprobar la configuración de Vite

## 🚀 Despliegue en Render

### Prerrequisitos

- ✅ Backend desplegado: `https://automatizacion-dvl5.onrender.com`
- ✅ Repositorio Git conectado a Render
- ✅ Código en la rama `develop` o `main`

### Configuración Rápida

1. **Crear Static Site en Render:**
   - Ve a [Render Dashboard](https://dashboard.render.com)
   - Clic en **"+ New +"** → **"Static Site"**
   - Conecta tu repositorio

2. **Configuración del Build:**
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
   - **Branch:** `develop` (o tu rama de producción)

3. **Variables de Entorno en Render:**
   ```
   VITE_BACKEND_URL=https://automatizacion-dvl5.onrender.com
   VITE_API_BASE_URL=https://automatizacion-dvl5.onrender.com/api
   VITE_API_TIMEOUT=10000
   VITE_CORS_ENABLED=true
   NODE_ENV=production
   ```

4. **Desplegar:**
   - Clic en **"Create Static Site"**
   - Espera a que termine el build (3-5 minutos)
   - Tu frontend estará disponible en `https://tu-frontend.onrender.com`

> 📖 **Guía Completa:** Ver [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) para instrucciones detalladas y solución de problemas.

### Verificación Post-Deploy

- ✅ El frontend carga correctamente
- ✅ El login funciona y se conecta al backend
- ✅ No hay errores en la consola del navegador
- ✅ Las peticiones API apuntan al backend de producción

## 📞 Soporte

Para soporte técnico o reportar bugs:
1. Revisar la documentación del backend
2. Verificar los logs del navegador
3. Comprobar la configuración de red
4. Consultar [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) para problemas de despliegue

## 🎉 ¡Sistema Listo!

El frontend está completamente configurado y listo para usar con el backend actualizado. Incluye todas las funcionalidades CRUD, autenticación JWT, reportes dinámicos y una interfaz moderna y responsiva.

**¡Disfruta del nuevo sistema de seguimiento de egresados!** 🚀