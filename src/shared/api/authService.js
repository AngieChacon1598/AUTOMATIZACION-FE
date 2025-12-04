import axios from 'axios';
import { BACKEND_CONFIG, getApiUrl } from '../backend';

// Crear instancia específica para autenticación
const authClient = axios.create({
  baseURL: BACKEND_CONFIG.BASE_URL,
  timeout: BACKEND_CONFIG.TIMEOUT,
  headers: BACKEND_CONFIG.DEFAULT_HEADERS
});

// Interceptor para agregar token en requests de autenticación
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas de autenticación
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Error de autenticación detectado, cerrando sesión...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login
  async login(username, password) {
    try {
      console.log('Intentando login con:', { username, password: '***' });
      console.log('URL del backend:', getApiUrl(BACKEND_CONFIG.AUTH_ENDPOINTS.LOGIN));
      
      const response = await authClient.post(getApiUrl(BACKEND_CONFIG.AUTH_ENDPOINTS.LOGIN), {
        username,
        password
      });

      console.log('Respuesta del backend:', response);

      if (response.status === 200) {
        const { token, user } = response.data;
        
        console.log('Login exitoso, guardando datos...');
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error) {
      console.error('Error completo en login:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.message || 'Error de validación'
            };
          case 401:
            return {
              success: false,
              error: data.message || 'Credenciales inválidas'
            };
          case 423:
            return {
              success: false,
              error: data.message || 'Cuenta bloqueada temporalmente'
            };
          case 500:
            return {
              success: false,
              error: 'Error interno del servidor'
            };
          default:
            return {
              success: false,
              error: data.message || 'Error desconocido'
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: 'No se pudo conectar con el servidor'
        };
      } else {
        return {
          success: false,
          error: 'Error de conexión'
        };
      }
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Obtener perfil del usuario
  async getProfile() {
    try {
      const response = await authClient.get(getApiUrl(BACKEND_CONFIG.AUTH_ENDPOINTS.PROFILE));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener perfil'
      };
    }
  },

  // Verificar token
  async verifyToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No hay token' };
      }

      const response = await authClient.post(getApiUrl(BACKEND_CONFIG.AUTH_ENDPOINTS.VERIFY_TOKEN), {
        token
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al verificar token:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Token inválido'
      };
    }
  },

  // Registrar nuevo usuario
  async register(userData) {
    try {
      const response = await authClient.post(getApiUrl(BACKEND_CONFIG.AUTH_ENDPOINTS.REGISTER), userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario'
      };
    }
  },

  // Obtener usuario actual del localStorage
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Verificar si el usuario tiene un rol específico
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.rol === role;
  },

  // Verificar si el usuario es administrador
  isAdmin() {
    return this.hasRole('admin');
  }
};

export default authService;
