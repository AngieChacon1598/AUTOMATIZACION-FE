// Configuración del backend Python actualizada
export const BACKEND_CONFIG = {
  // URL base del backend Python (usando variables de entorno o fallback)
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  
  // Endpoints de autenticación (4 endpoints)
  AUTH_ENDPOINTS: {
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',
    REGISTER: '/api/auth/register',
    VERIFY_TOKEN: '/api/auth/verify-token'
  },
  
  // Endpoints de egresados (6 endpoints CRUD)
  EGRESADOS_ENDPOINTS: {
    BASE: '/egresados',
    BY_CODIGO: '/egresados',
    RESTORE: '/egresados/restaurar'
  },
  
  // Endpoints de empresas (6 endpoints CRUD)
  EMPRESAS_ENDPOINTS: {
    BASE: '/empresas',
    BY_ID: '/empresas',
    RESTORE: '/empresas/restaurar'
  },
  
  // Endpoints de detalles de egresados (6 endpoints CRUD)
  DETALLE_EGRESADOS_ENDPOINTS: {
    BASE: '/detalle-egresados',
    BY_ID: '/detalle-egresados',
    RESTORE: '/detalle-egresados/restaurar',
    FISICO: '/detalle-egresados/fisico'
  },
  
  // Endpoints de encuestas (6 endpoints CRUD)
  ENCUESTAS_ENDPOINTS: {
    BASE: '/api/crud/encuestas-egresados',
    RESTORE: '/api/crud/encuestas-egresados/restaurar',
    ESTADISTICAS: '/api/crud/encuestas-egresados/estadisticas'
  },
  
  // Endpoints de evaluaciones (6 endpoints CRUD)
  EVALUACIONES_ENDPOINTS: {
    BASE: '/api/crud/evaluaciones-formacion',
    RESTORE: '/api/crud/evaluaciones-formacion'
  },
  
  // Catálogos (4 endpoints solo lectura)
  CATALOGOS_ENDPOINTS: {
    ESTADOS_CIVILES: '/estados-civiles',
    CARRERAS_PROFESIONALES: '/carreras',
    ACTIVIDADES_ECONOMICAS: '/actividades-economicas',
    CERTIFICACIONES: '/certificaciones'
  },

  // Endpoints de reportes
  REPORTES_ENDPOINTS: {
    EGRESADOS_POR_CARRERA: '/api/reportes/egresados-por-carrera',
    EGRESADOS_POR_ESTADO: '/api/reportes/egresados-por-estado',
    EGRESADOS_POR_ANIO: '/api/reportes/egresados-por-anio'
  },

  // Endpoints especiales
  ESPECIALES_ENDPOINTS: {
    NUEVO_EMPLEO: '/api/egresados',
    ENCUESTAS: '/api/encuestas'
  },
  
  // Timeout para requests (en milisegundos)
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Configuración de CORS
  CORS_ENABLED: import.meta.env.VITE_CORS_ENABLED === 'true',
  
  // Credenciales de acceso por defecto
  DEFAULT_CREDENTIALS: {
    username: 'admin',
    password: 'admin123'
  }
};

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint) => {
  return `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener la URL completa de un endpoint de API
export const getApiEndpointUrl = (endpoint) => {
  return `${BACKEND_CONFIG.API_BASE_URL}${endpoint}`;
};

// Función para verificar si el backend Python está disponible
export const checkBackendConnection = async () => {
  try {
    const response = await fetch(getApiUrl('/health'), {
      method: 'GET',
      headers: BACKEND_CONFIG.DEFAULT_HEADERS,
      timeout: BACKEND_CONFIG.TIMEOUT
    });
    
    // Si recibimos 200, el backend está funcionando
    return response.status === 200;
  } catch (error) {
    console.error('Error al verificar conexión con backend Python:', error);
    return false;
  }
};

// Función para verificar si el backend requiere autenticación
export const checkBackendAuth = async () => {
  try {
    const response = await fetch(getApiUrl(BACKEND_CONFIG.AUTH_ENDPOINTS.PROFILE), {
      method: 'GET',
      headers: BACKEND_CONFIG.DEFAULT_HEADERS
    });
    
    // Si recibimos 401, significa que el backend está funcionando pero requiere autenticación
    return response.status === 401;
  } catch (error) {
    console.error('Error al verificar autenticación del backend:', error);
    return false;
  }
};

// Función para obtener información del backend
export const getBackendInfo = async () => {
  try {
    const response = await fetch(getApiUrl('/info'), {
      method: 'GET',
      headers: BACKEND_CONFIG.DEFAULT_HEADERS
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error al obtener información del backend:', error);
    return null;
  }
};

// Función para construir parámetros de consulta
export const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

// Función para construir URL con parámetros
export const buildUrlWithParams = (baseUrl, params) => {
  const queryString = buildQueryParams(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export default BACKEND_CONFIG;
