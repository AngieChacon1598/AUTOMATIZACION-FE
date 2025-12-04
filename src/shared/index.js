// Utils
export { default as crudAxios } from './crudAxios';

// Función para mostrar notificaciones de error CORS
export const showCorsErrorNotification = (endpoint) => {
  const notification = {
    id: Date.now(),
    type: 'error',
    title: 'Error de Conexión',
    message: `No se pudo conectar con el endpoint: ${endpoint}. Verifique la configuración CORS del backend.`,
    timestamp: new Date().toLocaleTimeString(),
    autoClose: true
  };
  
  // Disparar evento personalizado para mostrar notificación
  window.dispatchEvent(new CustomEvent('showNotification', { detail: notification }));
};

// Función para verificar si un error es de CORS
export const isCorsError = (error) => {
  return error.code === 'ERR_NETWORK' || 
         error.message === 'Network Error' ||
         (error.response === undefined && error.request);
};