import { useState, useEffect } from 'react';

// Configuración por defecto
const DEFAULT_CONFIG = {
  // Intervalos de actualización (en milisegundos)
  refreshInterval: 30000, // 30 segundos
  
  // Métricas a mostrar
  showMetrics: {
    totalEgresados: true,
    totalEmpleados: true,
    totalEmpresas: true,
    carrerasActivas: true
  },
  
  // Gráficos a mostrar
  showCharts: {
    egresadosPorCarrera: true,
    distribucionPorEstado: true,
    egresadosPorAnio: true
  },
  
  // Umbrales de alertas
  alertThresholds: {
    tasaEmpleabilidadMinima: 70, // Porcentaje mínimo de empleabilidad
    empresasMinimas: 10, // Cantidad mínima de empresas
    egresadosInactivosMaximos: 0 // Máximo de egresados inactivos permitidos
  },
  
  // Configuración de actividad reciente
  recentActivity: {
    maxItems: 5, // Cantidad máxima de items a mostrar
    enabled: true
  },
  
  // Configuración de gráficos
  chartSettings: {
    showGrid: true,
    showLegend: true,
    animationEnabled: true
  },
  
  // Período de tiempo para reportes
  reportPeriod: {
    years: 5, // Años hacia atrás para mostrar en reportes
    enabled: true
  },
  
  // Configuración general
  general: {
    autoRefresh: true,
    showAlerts: true,
    compactMode: false
  }
};

export const useDashboardConfig = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración desde localStorage al montar
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('dashboardConfig');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        // Combinar con valores por defecto para asegurar que todos los campos existan
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      }
    } catch (error) {
      console.error('Error al cargar configuración del dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar configuración en localStorage
  const saveConfig = (newConfig) => {
    try {
      // Combinar con valores por defecto para asegurar estructura completa
      const configToSave = { ...DEFAULT_CONFIG, ...newConfig };
      localStorage.setItem('dashboardConfig', JSON.stringify(configToSave));
      setConfig(configToSave);
      return true;
    } catch (error) {
      console.error('Error al guardar configuración del dashboard:', error);
      return false;
    }
  };

  // Actualizar una sección específica de la configuración
  const updateConfigSection = (section, values) => {
    const updatedConfig = {
      ...config,
      [section]: {
        ...config[section],
        ...values
      }
    };
    return saveConfig(updatedConfig);
  };

  // Resetear a configuración por defecto
  const resetConfig = () => {
    localStorage.removeItem('dashboardConfig');
    setConfig(DEFAULT_CONFIG);
    return true;
  };

  // Obtener un valor específico de la configuración
  const getConfigValue = (path) => {
    const keys = path.split('.');
    let value = config;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return null;
    }
    return value;
  };

  return {
    config,
    isLoading,
    saveConfig,
    updateConfigSection,
    resetConfig,
    getConfigValue
  };
};

