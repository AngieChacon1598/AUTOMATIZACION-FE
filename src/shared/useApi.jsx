import { useState, useEffect, useContext, createContext } from 'react';
import { authService } from './api/authService';

// Crear contexto de autenticación
const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Verificar si el token sigue siendo válido
        const tokenResult = await authService.verifyToken();
        if (tokenResult.success) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // Token inválido, limpiar datos
          authService.logout();
        }
      }
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para manejar datos de egresados
export const useEgresados = () => {
  const [egresados, setEgresados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });

  const fetchEgresados = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Hook useEgresados: Iniciando fetchEgresados');
      console.log('🚀 Filtros recibidos:', filters);
      console.log('🚀 Paginación actual:', pagination);
      
      // Usar page y per_page de los filtros si están presentes, sino usar el estado interno
      const page = filters.page !== undefined ? filters.page : pagination.page;
      const per_page = filters.per_page !== undefined ? filters.per_page : pagination.per_page;
      
      const { egresadosService } = await import('./api/apiService');
      const result = await egresadosService.getEgresados({ 
        ...filters, 
        page,
        per_page
      });
      
      console.log('📊 Resultado del servicio:', result);
      
      if (result.success) {
        console.log('✅ Datos recibidos:', result.data);
        setEgresados(result.data.egresados || result.data);
        setPagination({
          page: result.data.page || page,
          per_page: result.data.per_page || per_page,
          total: result.data.total || 0,
          pages: result.data.pages || 0
        });
        console.log('✅ Egresados actualizados:', result.data.egresados || result.data);
      } else {
        console.error('❌ Error en el servicio:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('❌ Error en fetchEgresados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEgresado = async (codigo) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Hook useEgresados: Obteniendo egresado con código:', codigo);
      const { egresadosService } = await import('./api/apiService');
      const result = await egresadosService.getEgresado(codigo);
      
      if (result.success) {
        console.log('✅ Egresado obtenido:', result.data);
        // La respuesta puede venir como { egresado: {...} } o directamente el objeto egresado
        const egresadoData = result.data.egresado || result.data;
        
        // Actualizar el estado con un array que contiene solo este egresado
        // pero solo si no está ya en la lista
        setEgresados(prev => {
          const exists = prev.find(e => e.codigo === codigo);
          if (exists) {
            // Actualizar el existente
            return prev.map(e => e.codigo === codigo ? egresadoData : e);
          }
          return [egresadoData];
        });
        
        return { success: true, data: egresadoData };
      } else {
        console.error('❌ Error al obtener egresado:', result.error);
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error en getEgresado:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener egresado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createEgresado = async (egresadoData) => {
    try {
      const { egresadosService } = await import('./api/apiService');
      const result = await egresadosService.createEgresado(egresadoData);
      if (result.success) {
        await fetchEgresados(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateEgresado = async (codigo, egresadoData) => {
    try {
      const { egresadosService } = await import('./api/apiService');
      const result = await egresadosService.updateEgresado(codigo, egresadoData);
      if (result.success) {
        await fetchEgresados(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteEgresado = async (codigo) => {
    try {
      const { egresadosService } = await import('./api/apiService');
      const result = await egresadosService.deleteEgresado(codigo);
      if (result.success) {
        await fetchEgresados(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const restoreEgresado = async (codigo) => {
    try {
      const { egresadosService } = await import('./api/apiService');
      const result = await egresadosService.restoreEgresado(codigo);
      if (result.success) {
        await fetchEgresados(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const changePageSize = (newPageSize) => {
    setPagination(prev => ({ ...prev, per_page: newPageSize, page: 1 }));
  };

  // useEffect(() => {
  //   fetchEgresados();
  // }, [pagination.page, pagination.per_page]);

  return {
    egresados,
    loading,
    error,
    pagination,
    fetchEgresados,
    getEgresado,
    createEgresado,
    updateEgresado,
    deleteEgresado,
    restoreEgresado,
    changePage,
    changePageSize
  };
};

// Hook para manejar datos de empresas
export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });

  const fetchEmpresas = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar page y per_page de los filtros si están presentes, sino usar el estado interno
      const page = filters.page !== undefined ? filters.page : pagination.page;
      const per_page = filters.per_page !== undefined ? filters.per_page : pagination.per_page;
      
      const { empresasService } = await import('./api/apiService');
      const result = await empresasService.getEmpresas({ 
        ...filters, 
        page,
        per_page
      });
      
      if (result.success) {
        setEmpresas(result.data.empresas || result.data);
        setPagination({
          page: result.data.page || page,
          per_page: result.data.per_page || per_page,
          total: result.data.total || 0,
          pages: result.data.pages || 0
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEmpresa = async (empresaData) => {
    try {
      const { empresasService } = await import('./api/apiService');
      const result = await empresasService.createEmpresa(empresaData);
      if (result.success) {
        await fetchEmpresas(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getEmpresa = async (idEmpresa) => {
    try {
      const { empresasService } = await import('./api/apiService');
      const result = await empresasService.getEmpresa(idEmpresa);
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateEmpresa = async (idEmpresa, empresaData) => {
    try {
      const { empresasService } = await import('./api/apiService');
      const result = await empresasService.updateEmpresa(idEmpresa, empresaData);
      if (result.success) {
        await fetchEmpresas(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteEmpresa = async (idEmpresa) => {
    try {
      const { empresasService } = await import('./api/apiService');
      const result = await empresasService.deleteEmpresa(idEmpresa);
      if (result.success) {
        // Refrescar lista manteniendo los filtros actuales
        await fetchEmpresas({ 
          estado: 'A', // Mantener solo activas después de eliminar
          page: pagination.page,
          per_page: pagination.per_page
        });
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const restoreEmpresa = async (idEmpresa) => {
    try {
      const { empresasService } = await import('./api/apiService');
      const result = await empresasService.restoreEmpresa(idEmpresa);
      if (result.success) {
        // Refrescar lista manteniendo los filtros actuales
        await fetchEmpresas({ 
          estado: 'I', // Mantener solo inactivas después de restaurar
          page: pagination.page,
          per_page: pagination.per_page
        });
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const changePageSize = (newPageSize) => {
    setPagination(prev => ({ ...prev, per_page: newPageSize, page: 1 }));
  };

  useEffect(() => {
    fetchEmpresas();
  }, [pagination.page, pagination.per_page]);

  return {
    empresas,
    loading,
    error,
    pagination,
    fetchEmpresas,
    getEmpresa,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    restoreEmpresa,
    changePage,
    changePageSize
  };
};

// Hook para manejar detalles de egresados
export const useDetallesEgresados = () => {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });

  const fetchDetallesEgresados = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Hook useDetallesEgresados: Iniciando fetchDetallesEgresados');
      console.log('🔍 Filtros recibidos:', filters);
      
      // Usar page y per_page de los filtros si están presentes, sino usar el estado interno
      const page = filters.page !== undefined ? filters.page : pagination.page;
      const per_page = filters.per_page !== undefined ? filters.per_page : pagination.per_page;
      
      const { detallesEgresadosService } = await import('./api/apiService');
      const result = await detallesEgresadosService.getDetallesEgresados({ 
        ...filters, 
        page,
        per_page
      });
      
      console.log('📊 Resultado del servicio:', result);
      
      if (result.success) {
        console.log('✅ Datos recibidos:', result.data);
        setDetalles(result.data.detalles || []);
        setPagination({
          page: result.data.page || pagination.page,
          per_page: result.data.per_page || pagination.per_page,
          total: result.data.total || 0,
          pages: result.data.pages || 0
        });
      } else {
        console.error('❌ Error en el servicio:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('❌ Error en fetchDetallesEgresados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDetalleEgresado = async (idDetalle) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Hook useDetallesEgresados: Obteniendo detalle con ID:', idDetalle);
      const { detallesEgresadosService } = await import('./api/apiService');
      const result = await detallesEgresadosService.getDetalleEgresado(idDetalle);
      
      if (result.success) {
        console.log('✅ Detalle obtenido:', result.data);
        return { success: true, data: result.data };
      } else {
        console.error('❌ Error al obtener detalle:', result.error);
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error en getDetalleEgresado:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener detalle';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createDetalleEgresado = async (detalleData) => {
    try {
      const { detallesEgresadosService } = await import('./api/apiService');
      const result = await detallesEgresadosService.createDetalleEgresado(detalleData);
      if (result.success) {
        await fetchDetallesEgresados(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateDetalleEgresado = async (idDetalle, detalleData) => {
    try {
      const { detallesEgresadosService } = await import('./api/apiService');
      const result = await detallesEgresadosService.updateDetalleEgresado(idDetalle, detalleData);
      if (result.success) {
        await fetchDetallesEgresados(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteDetalleEgresado = async (idDetalle) => {
    try {
      const { detallesEgresadosService } = await import('./api/apiService');
      const result = await detallesEgresadosService.deleteDetalleEgresado(idDetalle);
      if (result.success) {
        await fetchDetallesEgresados(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const restoreDetalleEgresado = async (idDetalle) => {
    try {
      const { detallesEgresadosService } = await import('./api/apiService');
      const result = await detallesEgresadosService.restoreDetalleEgresado(idDetalle);
      if (result.success) {
        await fetchDetallesEgresados(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteDetalleEgresadoFisico = async (idDetalle) => {
    try {
      const { detallesEgresadosService } = await import('./api/apiService');
      const result = await detallesEgresadosService.deleteDetalleEgresadoFisico(idDetalle);
      if (result.success) {
        await fetchDetallesEgresados(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const changePageSize = (newPageSize) => {
    setPagination(prev => ({ ...prev, per_page: newPageSize, page: 1 }));
  };

  return {
    detalles,
    loading,
    error,
    pagination,
    fetchDetallesEgresados,
    getDetalleEgresado,
    createDetalleEgresado,
    updateDetalleEgresado,
    deleteDetalleEgresado,
    restoreDetalleEgresado,
    deleteDetalleEgresadoFisico,
    changePage,
    changePageSize
  };
};

// Hook para manejar catálogos
export const useCatalogos = () => {
  const [catalogos, setCatalogos] = useState({
    estadosCiviles: [],
    carrerasProfesionales: [],
    actividadesEconomicas: [],
    certificaciones: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCatalogos = async (carrerasFilters = {}, estadosCivilesFilters = {}, actividadesFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📚 Hook useCatalogos: Iniciando fetchCatalogos');
      const { catalogosService } = await import('./api/apiService');
      
      const [estadosCiviles, carrerasProfesionales, actividadesEconomicas, certificaciones] = await Promise.all([
        catalogosService.getEstadosCiviles(estadosCivilesFilters),
        catalogosService.getCarrerasProfesionales(carrerasFilters),
        catalogosService.getActividadesEconomicas(actividadesFilters),
        catalogosService.getCertificaciones()
      ]);

      console.log('📚 Resultados de catálogos:');
      console.log('📚 Estados civiles:', estadosCiviles);
      console.log('📚 Carreras profesionales:', carrerasProfesionales);
      console.log('📚 Actividades económicas:', actividadesEconomicas);
      console.log('📚 Certificaciones:', certificaciones);

      setCatalogos({
        estadosCiviles: estadosCiviles.success ? estadosCiviles.data : [],
        carrerasProfesionales: carrerasProfesionales.success ? carrerasProfesionales.data : [],
        actividadesEconomicas: actividadesEconomicas.success ? actividadesEconomicas.data : [],
        certificaciones: certificaciones.success ? certificaciones.data : []
      });

      console.log('📚 Catálogos actualizados:', {
        estadosCiviles: estadosCiviles.success ? estadosCiviles.data : [],
        carrerasProfesionales: carrerasProfesionales.success ? carrerasProfesionales.data : [],
        actividadesEconomicas: actividadesEconomicas.success ? actividadesEconomicas.data : [],
        certificaciones: certificaciones.success ? certificaciones.data : []
      });
    } catch (err) {
      console.error('❌ Error en fetchCatalogos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogos();
  }, []);

  return {
    catalogos,
    loading,
    error,
    fetchCatalogos
  };
};

// Hook para manejar certificaciones
export const useCertificaciones = () => {
  const [certificaciones, setCertificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCertificaciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { certificacionesService } = await import('./api/apiService');
      const result = await certificacionesService.getCertificaciones();
      
      if (result.success) {
        setCertificaciones(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCertificacion = async (certificacionData) => {
    try {
      const { certificacionesService } = await import('./api/apiService');
      const result = await certificacionesService.createCertificacion(certificacionData);
      if (result.success) {
        await fetchCertificaciones(); // Refrescar lista
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchCertificaciones();
  }, []);

  return {
    certificaciones,
    loading,
    error,
    fetchCertificaciones,
    createCertificacion
  };
};

// Hook para manejar reportes
export const useReportes = () => {
  const [reportes, setReportes] = useState({
    egresadosPorCarrera: [],
    egresadosPorEstado: [],
    egresadosPorAnio: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReportes = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const { reportesService } = await import('./api/apiService');
      
      // Usar el nuevo método optimizado
      const result = await reportesService.getAllReportes(filters);
      
      if (result.success) {
        setReportes(result.data);
        console.log('📊 Reportes cargados exitosamente:', result.data);
      } else {
        setError(result.error);
        console.error('❌ Error al cargar reportes:', result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Error en fetchReportes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  return {
    reportes,
    loading,
    error,
    fetchReportes
  };
};
