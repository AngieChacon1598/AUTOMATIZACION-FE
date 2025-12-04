import axios from 'axios';
import { BACKEND_CONFIG, getApiUrl, buildUrlWithParams } from '../backend';

// Configurar axios con interceptores para autenticación
const apiClient = axios.create({
  baseURL: BACKEND_CONFIG.BASE_URL,
  timeout: BACKEND_CONFIG.TIMEOUT,
  headers: BACKEND_CONFIG.DEFAULT_HEADERS
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔑 Token en localStorage:', token ? 'Presente' : 'Ausente');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token agregado a headers:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.warn('⚠️ No hay token disponible para la petición');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa:', response.status, response.config?.url);
    console.log('✅ Datos de respuesta:', response.data);
    return response;
  },
  (error) => {
    // Solo mostrar errores detallados si no son errores de red/CORS
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.warn('⚠️ Error de red/CORS:', error.config?.url);
    } else {
      console.error('❌ Error en respuesta:', error.response?.status, error.config?.url);
      console.error('❌ Datos de error:', error.response?.data);
      console.error('❌ Error completo:', error);
    }
    
    if (error.response?.status === 401) {
      // Solo cerrar sesión en endpoints de autenticación
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/api/auth/');
      
      if (isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========================================
// SERVICIOS PARA EGRESADOS
// ========================================

export const egresadosService = {
  // Listar egresados con filtros y paginación
  async getEgresados(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.EGRESADOS_ENDPOINTS.BASE), filters);
      console.log('🔍 Llamando a endpoint:', url);
      console.log('🔍 Filtros:', filters);
      const response = await apiClient.get(url);
      console.log('✅ Respuesta del backend:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error en getEgresados:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener egresados'
      };
    }
  },

  // Obtener un egresado específico
  async getEgresado(codigo) {
    try {
      const response = await apiClient.get(`${getApiUrl(BACKEND_CONFIG.EGRESADOS_ENDPOINTS.BASE)}/${codigo}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener egresado'
      };
    }
  },

  // Crear nuevo egresado
  async createEgresado(egresadoData) {
    try {
      const response = await apiClient.post(getApiUrl(BACKEND_CONFIG.EGRESADOS_ENDPOINTS.BASE), egresadoData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear egresado'
      };
    }
  },

  // Actualizar egresado
  async updateEgresado(codigo, egresadoData) {
    try {
      const response = await apiClient.put(`${getApiUrl(BACKEND_CONFIG.EGRESADOS_ENDPOINTS.BASE)}/${codigo}`, egresadoData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar egresado'
      };
    }
  },

  // Eliminar lógicamente
  async deleteEgresado(codigo) {
    try {
      const response = await apiClient.delete(`${getApiUrl(BACKEND_CONFIG.EGRESADOS_ENDPOINTS.BASE)}/${codigo}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar egresado'
      };
    }
  },

  // Restaurar egresado
  async restoreEgresado(codigo) {
    try {
      const response = await apiClient.put(`${getApiUrl(BACKEND_CONFIG.EGRESADOS_ENDPOINTS.RESTORE)}/${codigo}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al restaurar egresado'
      };
    }
  }
};

// ========================================
// SERVICIOS PARA EMPRESAS
// ========================================

export const empresasService = {
  // Listar empresas con filtros y paginación
  async getEmpresas(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.EMPRESAS_ENDPOINTS.BASE), filters);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener empresas'
      };
    }
  },

  // Obtener una empresa específica
  async getEmpresa(idEmpresa) {
    try {
      const response = await apiClient.get(`${getApiUrl(BACKEND_CONFIG.EMPRESAS_ENDPOINTS.BASE)}/${idEmpresa}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener empresa'
      };
    }
  },

  // Crear nueva empresa
  async createEmpresa(empresaData) {
    try {
      const response = await apiClient.post(getApiUrl(BACKEND_CONFIG.EMPRESAS_ENDPOINTS.BASE), empresaData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear empresa'
      };
    }
  },

  // Actualizar empresa
  async updateEmpresa(idEmpresa, empresaData) {
    try {
      const response = await apiClient.put(`${getApiUrl(BACKEND_CONFIG.EMPRESAS_ENDPOINTS.BASE)}/${idEmpresa}`, empresaData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar empresa'
      };
    }
  },

  // Eliminar lógicamente
  async deleteEmpresa(idEmpresa) {
    try {
      const response = await apiClient.delete(`${getApiUrl(BACKEND_CONFIG.EMPRESAS_ENDPOINTS.BASE)}/${idEmpresa}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar empresa'
      };
    }
  },

  // Restaurar empresa
  async restoreEmpresa(idEmpresa) {
    try {
      const response = await apiClient.put(`${getApiUrl(BACKEND_CONFIG.EMPRESAS_ENDPOINTS.RESTORE)}/${idEmpresa}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al restaurar empresa'
      };
    }
  }
};

// ========================================
// SERVICIOS PARA DETALLES DE EGRESADOS
// ========================================

export const detallesEgresadosService = {
  // Listar detalles con filtros y paginación
  async getDetallesEgresados(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.DETALLE_EGRESADOS_ENDPOINTS.BASE), filters);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener detalles de egresados'
      };
    }
  },

  // Obtener un detalle específico
  async getDetalleEgresado(idDetalle) {
    try {
      const response = await apiClient.get(`${getApiUrl(BACKEND_CONFIG.DETALLE_EGRESADOS_ENDPOINTS.BASE)}/${idDetalle}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener detalle de egresado'
      };
    }
  },

  // Crear nuevo detalle
  async createDetalleEgresado(detalleData) {
    try {
      const response = await apiClient.post(getApiUrl(BACKEND_CONFIG.DETALLE_EGRESADOS_ENDPOINTS.BASE), detalleData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear detalle de egresado'
      };
    }
  },

  // Actualizar detalle
  async updateDetalleEgresado(idDetalle, detalleData) {
    try {
      console.log(`📝 Intentando actualizar detalle de egresado ID: ${idDetalle}`);
      console.log(`📦 Datos a enviar:`, detalleData);
      const url = `${getApiUrl(BACKEND_CONFIG.DETALLE_EGRESADOS_ENDPOINTS.BASE)}/${idDetalle}`;
      console.log(`📡 URL de actualización: ${url}`);
      
      const response = await apiClient.put(url, detalleData);
      console.log(`✅ Actualización exitosa:`, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error al actualizar detalle de egresado:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Error completo:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al actualizar detalle de egresado';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          // Error de validación - mostrar detalles específicos
          if (data?.errors) {
            // Errores de validación por campo
            const errorFields = Object.keys(data.errors);
            const errorMessages = errorFields.map(field => {
              const fieldErrors = Array.isArray(data.errors[field]) 
                ? data.errors[field].join(', ') 
                : data.errors[field];
              return `${field}: ${fieldErrors}`;
            });
            errorMessage = `Error de validación:\n${errorMessages.join('\n')}`;
          } else if (data?.message) {
            errorMessage = `Error de validación: ${data.message}`;
          } else if (data?.error) {
            errorMessage = `Error: ${data.error}`;
          } else {
            errorMessage = 'Error de validación. Por favor, verifica que todos los campos sean correctos.';
          }
        } else if (status === 404) {
          errorMessage = 'El detalle de egresado no fue encontrado.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para actualizar este detalle.';
        } else if (status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
          if (data?.message) {
            errorMessage += ` Detalles: ${data.message}`;
          }
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        errorMessage = error.message || 'Error desconocido al actualizar el detalle.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Eliminar lógicamente
  async deleteDetalleEgresado(idDetalle, retryCount = 0) {
    const maxRetries = 2;
    const retryDelay = 1000; // 1 segundo
    
    try {
      console.log(`🗑️ Intentando eliminar detalle de egresado ID: ${idDetalle} (intento ${retryCount + 1}/${maxRetries + 1})`);
      const url = `${getApiUrl(BACKEND_CONFIG.DETALLE_EGRESADOS_ENDPOINTS.BASE)}/${idDetalle}`;
      console.log(`📡 URL de eliminación: ${url}`);
      
      const response = await apiClient.delete(url);
      console.log(`✅ Eliminación exitosa:`, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Si es un error 500 y aún tenemos reintentos disponibles, intentar nuevamente
      if (error.response?.status === 500 && retryCount < maxRetries) {
        console.warn(`⚠️ Error 500 en intento ${retryCount + 1}, reintentando en ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.deleteDetalleEgresado(idDetalle, retryCount + 1);
      }
      console.error('❌ Error al eliminar detalle de egresado:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Error completo:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al eliminar detalle de egresado';
      
      if (error.response) {
        // El servidor respondió con un código de error
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 500) {
          // Verificar si es un error de conexión a la base de datos
          const errorText = JSON.stringify(data || error.response?.data || '').toLowerCase();
          if (errorText.includes('ssl connection') || errorText.includes('connection') || errorText.includes('database')) {
            errorMessage = 'Error de conexión con la base de datos. Por favor, intenta nuevamente en unos momentos.';
          } else {
            errorMessage = 'Error interno del servidor. Por favor, contacta al administrador o intenta más tarde.';
          }
          // Intentar extraer más información del error si está disponible
          if (data?.message) {
            errorMessage += ` Detalles: ${data.message}`;
          } else if (data?.error) {
            errorMessage += ` Detalles: ${data.error}`;
          }
        } else if (status === 404) {
          errorMessage = 'El detalle de egresado no fue encontrado.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para eliminar este detalle.';
        } else if (status === 400) {
          errorMessage = data?.message || 'Solicitud inválida. Verifica los datos.';
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        // Algo más pasó
        errorMessage = error.message || 'Error desconocido al eliminar el detalle.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Restaurar detalle
  async restoreDetalleEgresado(idDetalle) {
    try {
      const response = await apiClient.put(`${getApiUrl(BACKEND_CONFIG.DETALLE_EGRESADOS_ENDPOINTS.RESTORE)}/${idDetalle}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al restaurar detalle de egresado'
      };
    }
  },

  // Eliminar físicamente
  async deleteDetalleEgresadoFisico(idDetalle) {
    try {
      const response = await apiClient.delete(`${getApiUrl(BACKEND_CONFIG.DETALLE_EGRESADOS_ENDPOINTS.FISICO)}/${idDetalle}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar físicamente el detalle de egresado'
      };
    }
  }
};

// ========================================
// SERVICIOS PARA ENCUESTAS DE EGRESADOS
// ========================================

export const encuestasEgresadosService = {
  // Listar encuestas con filtros y paginación
  async getEncuestasEgresados(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.ENCUESTAS_ENDPOINTS.BASE), filters);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener encuestas de egresados'
      };
    }
  },

  // Obtener una encuesta específica
  async getEncuestaEgresado(idEncuesta) {
    try {
      const response = await apiClient.get(`${getApiUrl(BACKEND_CONFIG.ENCUESTAS_ENDPOINTS.BASE)}/${idEncuesta}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener encuesta de egresado'
      };
    }
  },

  // Crear nueva encuesta
  async createEncuestaEgresado(encuestaData) {
    try {
      const response = await apiClient.post(getApiUrl(BACKEND_CONFIG.ENCUESTAS_ENDPOINTS.BASE), encuestaData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear encuesta de egresado'
      };
    }
  },

  // Actualizar encuesta
  async updateEncuestaEgresado(idEncuesta, encuestaData) {
    try {
      const response = await apiClient.put(`${getApiUrl(BACKEND_CONFIG.ENCUESTAS_ENDPOINTS.BASE)}/${idEncuesta}`, encuestaData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar encuesta de egresado'
      };
    }
  },

  // Eliminar lógicamente
  async deleteEncuestaEgresado(idEncuesta) {
    try {
      const response = await apiClient.delete(`${getApiUrl(BACKEND_CONFIG.ENCUESTAS_ENDPOINTS.BASE)}/${idEncuesta}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar encuesta de egresado'
      };
    }
  },

  // Restaurar encuesta
  async restoreEncuestaEgresado(idEncuesta) {
    try {
      // El backend usa PATCH /api/crud/encuestas-egresados/restaurar/:id
      const response = await apiClient.patch(`${getApiUrl(BACKEND_CONFIG.ENCUESTAS_ENDPOINTS.RESTORE)}/${idEncuesta}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al restaurar encuesta de egresado'
      };
    }
  },

  // Obtener estadísticas de encuestas
  async getEstadisticasEncuestas(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.ENCUESTAS_ENDPOINTS.ESTADISTICAS), filters);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener estadísticas de encuestas'
      };
    }
  }
};

// ========================================
// SERVICIOS PARA EVALUACIONES DE FORMACIÓN
// ========================================

export const evaluacionesFormacionService = {
  // Listar evaluaciones con filtros y paginación
  async getEvaluacionesFormacion(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.EVALUACIONES_ENDPOINTS.BASE), filters);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener evaluaciones de formación'
      };
    }
  },

  // Obtener una evaluación específica
  async getEvaluacionFormacion(idEvaluacion) {
    try {
      const response = await apiClient.get(`${getApiUrl(BACKEND_CONFIG.EVALUACIONES_ENDPOINTS.BASE)}/${idEvaluacion}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener evaluación de formación'
      };
    }
  },

  // Crear nueva evaluación
  async createEvaluacionFormacion(evaluacionData) {
    try {
      const response = await apiClient.post(getApiUrl(BACKEND_CONFIG.EVALUACIONES_ENDPOINTS.BASE), evaluacionData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear evaluación de formación'
      };
    }
  },

  // Actualizar evaluación
  async updateEvaluacionFormacion(idEvaluacion, evaluacionData) {
    try {
      const response = await apiClient.put(`${getApiUrl(BACKEND_CONFIG.EVALUACIONES_ENDPOINTS.BASE)}/${idEvaluacion}`, evaluacionData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar evaluación de formación'
      };
    }
  },

  // Eliminar lógicamente
  async deleteEvaluacionFormacion(idEvaluacion) {
    try {
      const response = await apiClient.delete(`${getApiUrl(BACKEND_CONFIG.EVALUACIONES_ENDPOINTS.BASE)}/${idEvaluacion}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar evaluación de formación'
      };
    }
  },

  // Restaurar evaluación
  async restoreEvaluacionFormacion(idEvaluacion) {
    try {
      const response = await apiClient.put(`${getApiUrl(BACKEND_CONFIG.EVALUACIONES_ENDPOINTS.BASE)}/${idEvaluacion}/restaurar`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al restaurar evaluación de formación'
      };
    }
  }
};

// ========================================
// SERVICIOS PARA CATÁLOGOS (SOLO LECTURA)
// ========================================

export const catalogosService = {
  // Obtener estados civiles
  async getEstadosCiviles(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.CATALOGOS_ENDPOINTS.ESTADOS_CIVILES), filters);
      console.log('👤 Llamando a endpoint de estados civiles:', url);
      const response = await apiClient.get(url);
      console.log('👤 Respuesta del backend para estados civiles:', response.data);
      return {
        success: true,
        data: response.data.estados_civiles || response.data
      };
    } catch (error) {
      console.error('❌ Error al obtener estados civiles:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener estados civiles'
      };
    }
  },

  // Obtener carreras profesionales
  async getCarrerasProfesionales(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.CATALOGOS_ENDPOINTS.CARRERAS_PROFESIONALES), filters);
      console.log('🎓 Llamando a endpoint de carreras:', url);
      const response = await apiClient.get(url);
      console.log('🎓 Respuesta del backend para carreras:', response.data);
      return {
        success: true,
        data: response.data.carreras || response.data
      };
    } catch (error) {
      console.error('❌ Error al obtener carreras profesionales:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener carreras profesionales'
      };
    }
  },

  // Obtener actividades económicas
  async getActividadesEconomicas(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.CATALOGOS_ENDPOINTS.ACTIVIDADES_ECONOMICAS), filters);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data.actividades_economicas || response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener actividades económicas'
      };
    }
  },

  // Obtener certificaciones
  async getCertificaciones() {
    try {
      const response = await apiClient.get(getApiUrl(BACKEND_CONFIG.CATALOGOS_ENDPOINTS.CERTIFICACIONES));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener certificaciones'
      };
    }
  }
};

// ========================================
// SERVICIOS PARA CERTIFICACIONES
// ========================================

export const certificacionesService = {
  // Listar certificaciones con filtros y paginación
  async getCertificaciones(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.CATALOGOS_ENDPOINTS.CERTIFICACIONES), filters);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data.certificaciones || response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener certificaciones'
      };
    }
  },

  // Obtener una certificación específica
  async getCertificacion(idCertificacion) {
    try {
      const response = await apiClient.get(`${getApiUrl(BACKEND_CONFIG.CATALOGOS_ENDPOINTS.CERTIFICACIONES)}/${idCertificacion}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener certificación'
      };
    }
  },

  // Crear nueva certificación
  async createCertificacion(certificacionData) {
    try {
      const response = await apiClient.post(getApiUrl(BACKEND_CONFIG.CATALOGOS_ENDPOINTS.CERTIFICACIONES), certificacionData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear certificación'
      };
    }
  }
};

// ========================================
// SERVICIOS PARA REPORTES
// ========================================

export const reportesService = {
  // Egresados por carrera
  async getEgresadosPorCarrera(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.REPORTES_ENDPOINTS.EGRESADOS_POR_CARRERA), filters);
      console.log('📊 Llamando a reporte por carrera:', url);
      const response = await apiClient.get(url);
      console.log('📊 Respuesta del reporte por carrera:', response.data);
      return {
        success: true,
        data: response.data.reporte || response.data
      };
    } catch (error) {
      console.error('❌ Error en reporte por carrera:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener reporte de egresados por carrera'
      };
    }
  },

  // Egresados por estado
  async getEgresadosPorEstado(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.REPORTES_ENDPOINTS.EGRESADOS_POR_ESTADO), filters);
      console.log('📊 Llamando a reporte por estado:', url);
      const response = await apiClient.get(url);
      console.log('📊 Respuesta del reporte por estado:', response.data);
      return {
        success: true,
        data: response.data.reporte || response.data
      };
    } catch (error) {
      console.error('❌ Error en reporte por estado:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener reporte de egresados por estado'
      };
    }
  },

  // Egresados por año
  async getEgresadosPorAnio(filters = {}) {
    try {
      const url = buildUrlWithParams(getApiUrl(BACKEND_CONFIG.REPORTES_ENDPOINTS.EGRESADOS_POR_ANIO), filters);
      console.log('📊 Llamando a reporte por año:', url);
      const response = await apiClient.get(url);
      console.log('📊 Respuesta del reporte por año:', response.data);
      return {
        success: true,
        data: response.data.reporte || response.data
      };
    } catch (error) {
      console.error('❌ Error en reporte por año:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener reporte de egresados por año'
      };
    }
  },

  // Obtener todos los reportes de una vez
  async getAllReportes(filters = {}) {
    try {
      console.log('📊 Obteniendo todos los reportes con filtros:', filters);
      const [porCarrera, porEstado, porAnio] = await Promise.all([
        this.getEgresadosPorCarrera(filters),
        this.getEgresadosPorEstado(filters),
        this.getEgresadosPorAnio(filters)
      ]);

      return {
        success: true,
        data: {
          egresadosPorCarrera: porCarrera.success ? porCarrera.data : [],
          egresadosPorEstado: porEstado.success ? porEstado.data : [],
          egresadosPorAnio: porAnio.success ? porAnio.data : []
        }
      };
    } catch (error) {
      console.error('❌ Error al obtener todos los reportes:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener reportes'
      };
    }
  }
};

export default {
  egresadosService,
  empresasService,
  detallesEgresadosService,
  encuestasEgresadosService,
  evaluacionesFormacionService,
  catalogosService,
  certificacionesService,
  reportesService
};