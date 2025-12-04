import axios from 'axios';
import { BACKEND_CONFIG } from './backend.js';

// Crear una instancia de axios completamente independiente para operaciones CRUD
const crudAxios = axios.create({
  baseURL: BACKEND_CONFIG.BASE_URL,
  timeout: BACKEND_CONFIG.TIMEOUT,
  headers: BACKEND_CONFIG.DEFAULT_HEADERS
});

// Configurar interceptores específicos para esta instancia (sin cerrar sesión)
crudAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta que NO cierra sesión
crudAxios.interceptors.response.use(
  (response) => {
    console.log('Respuesta exitosa CRUD:', response.status, response.config?.url);
    return response;
  },
  (error) => {
    console.warn('Error en operación CRUD (no se cierra sesión):', error.response?.status, error.config?.url);
    // IMPORTANTE: NO cerrar sesión automáticamente
    return Promise.reject(error);
  }
);

export default crudAxios;
