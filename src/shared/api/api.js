// Este archivo mantiene compatibilidad con el código existente
// pero ahora usa los nuevos servicios actualizados

import { 
  egresadosService, 
  detallesEgresadosService 
} from './apiService';

// ========================================
// FUNCIONES DE COMPATIBILIDAD PARA EGRESADOS
// ========================================

// Función para obtener todos los egresados (compatibilidad)
export const getEgresados = async (estado) => {
  const result = await egresadosService.getEgresados({ estado });
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// Función para agregar un nuevo egresado (compatibilidad)
export const addEgresado = async (egresado) => {
  const result = await egresadosService.createEgresado(egresado);
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// Función para eliminar un egresado (compatibilidad)
export const deleteEgresado = async (codigo) => {
  const result = await egresadosService.deleteEgresado(codigo);
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// Función para restaurar un egresado (compatibilidad)
export const restoreEgresado = async (codigo) => {
  const result = await egresadosService.restoreEgresado(codigo);
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// ========================================
// FUNCIONES DE COMPATIBILIDAD PARA DETALLE_EGRESADO
// ========================================

// Función para obtener todos los detalles de egresados (compatibilidad)
export const getDetalleEgresados = async (estado, codigoEgresado) => {
  const filters = {};
  if (estado) filters.estado = estado;
  if (codigoEgresado) filters.codigo_egresado = codigoEgresado;
  
  const result = await detallesEgresadosService.getDetallesEgresados(filters);
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// Función para obtener un detalle específico (compatibilidad)
export const getDetalleEgresado = async (idDetalle) => {
  const result = await detallesEgresadosService.getDetalleEgresado(idDetalle);
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// Función para agregar un nuevo detalle de egresado (compatibilidad)
export const addDetalleEgresado = async (detalle) => {
  const result = await detallesEgresadosService.createDetalleEgresado(detalle);
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// Función para actualizar un detalle de egresado (compatibilidad)
export const updateDetalleEgresado = async (idDetalle, detalle) => {
  const result = await detallesEgresadosService.updateDetalleEgresado(idDetalle, detalle);
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// Función para eliminar lógicamente un detalle de egresado (compatibilidad)
export const deleteDetalleEgresado = async (idDetalle) => {
  const result = await detallesEgresadosService.deleteDetalleEgresado(idDetalle);
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// Función para restaurar un detalle de egresado (compatibilidad)
export const restoreDetalleEgresado = async (idDetalle) => {
  const result = await detallesEgresadosService.restoreDetalleEgresado(idDetalle);
  if (result.success) {
    return { data: result.data };
  } else {
    throw new Error(result.error);
  }
};

// Función para eliminar físicamente un detalle de egresado (deprecated)
export const deleteDetalleEgresadoFisico = async (idDetalle) => {
  console.warn('deleteDetalleEgresadoFisico está deprecated. Usa deleteDetalleEgresado para eliminación lógica.');
  return deleteDetalleEgresado(idDetalle);
};
