import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaBriefcase, FaBuilding, FaExclamationTriangle,
  FaCheckCircle, FaClock, FaArrowUp, FaFileAlt, FaChartBar, FaChartLine, FaCog
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import DashboardConfig from '../components/DashboardConfig';
import { useDashboardConfig } from '../shared/useDashboardConfig';
import './Dashboard.css';

const Dashboard = () => {
  const { config } = useDashboardConfig();
  const [egresados, setEgresados] = useState([]);
  const [egresadosLoading, setEgresadosLoading] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [empresasLoading, setEmpresasLoading] = useState(false);
  const [carreras, setCarreras] = useState([]); // Agregar estado para carreras
  const [stats, setStats] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [reportes, setReportes] = useState({
    egresadosPorCarrera: [],
    egresadosPorEstado: [],
    egresadosPorAnio: []
  });
  const [reportesLoading, setReportesLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Función para cargar carreras del catálogo
  const fetchCarreras = async () => {
    try {
      const { catalogosService } = await import('../shared/api/apiService');
      const result = await catalogosService.getCarrerasProfesionales();
      
      if (result.success) {
        setCarreras(result.data);
        console.log('📊 Dashboard: Carreras cargadas:', result.data);
      } else {
        console.error('❌ Dashboard: Error al cargar carreras:', result.error);
      }
    } catch (err) {
      console.error('❌ Dashboard: Error al cargar carreras:', err);
    }
  };

  // Función para obtener todos los egresados sin paginación
  const fetchAllEgresados = async () => {
    setEgresadosLoading(true);
    try {
      const { egresadosService } = await import('../shared/api/apiService');
      const result = await egresadosService.getEgresados({ 
        per_page: 1000 // Obtener hasta 1000 egresados para el dashboard
      });
      
      if (result.success) {
        setEgresados(result.data.egresados || result.data);
        console.log('📊 Dashboard: Egresados cargados:', result.data.egresados || result.data);
      } else {
        console.error('❌ Dashboard: Error al cargar egresados:', result.error);
      }
    } catch (err) {
      console.error('❌ Dashboard: Error al cargar egresados:', err);
    } finally {
      setEgresadosLoading(false);
    }
  };

  // Función para cargar empresas de manera segura
  const fetchEmpresasSeguro = async () => {
    setEmpresasLoading(true);
    try {
      const { empresasService } = await import('../shared/api/apiService');
      const result = await empresasService.getEmpresas({ 
        per_page: 1000 // Obtener hasta 1000 empresas para el dashboard
      });
      
      if (result.success) {
        setEmpresas(result.data.empresas || result.data);
        console.log('📊 Dashboard: Empresas cargadas:', result.data.empresas || result.data);
      } else {
        console.warn('⚠️ Dashboard: No se pudieron cargar las empresas:', result.error);
        setEmpresas([]);
      }
    } catch (error) {
      console.warn('⚠️ Dashboard: Error al cargar empresas:', error);
      setEmpresas([]);
    } finally {
      setEmpresasLoading(false);
    }
  };

  // Función para cargar reportes de manera segura
  const fetchReportesSeguro = async () => {
    setReportesLoading(true);
    try {
      const { reportesService } = await import('../shared/api/apiService');
      
      // Usar el nuevo método optimizado
      const result = await reportesService.getAllReportes();
      
      if (result.success) {
        setReportes(result.data);
        console.log('📊 Dashboard: Reportes cargados exitosamente:', result.data);
      } else {
        console.warn('⚠️ Dashboard: Error al cargar reportes:', result.error);
        setReportes({
          egresadosPorCarrera: [],
          egresadosPorEstado: [],
          egresadosPorAnio: []
        });
      }
    } catch (error) {
      console.warn('⚠️ Dashboard: No se pudieron cargar los reportes:', error);
      // Mantener arrays vacíos para evitar errores
    } finally {
      setReportesLoading(false);
    }
  };

  const calculateStats = () => {
    const totalEgresados = egresados.length;
    const egresadosActivos = egresados.filter(e => e.estado === 'A').length;
    const egresadosInactivos = egresados.filter(e => e.estado === 'I').length;
    const totalEmpresas = empresas.length;
    
    // Calcular tasa de empleabilidad basada en reportes (si están disponibles)
    const empleadosPorCarrera = reportes.egresadosPorCarrera || [];
    const totalEmpleados = empleadosPorCarrera.reduce((sum, item) => sum + (item.cantidad || 0), 0);
    const tasaEmpleabilidad = totalEgresados > 0 ? (totalEmpleados / totalEgresados * 100).toFixed(1) : 0;

    setStats({
      totalEgresados,
      egresadosActivos,
      egresadosInactivos,
      totalEmpresas,
      tasaEmpleabilidad,
      totalEmpleados
    });
  };

  const generateAlerts = () => {
    if (!config.general?.showAlerts) {
      setAlerts([]);
      return;
    }

    const alertsList = [];
    const thresholds = config.alertThresholds || {};

    // Egresados inactivos
    if (stats.egresadosInactivos > (thresholds.egresadosInactivosMaximos || 0)) {
      alertsList.push({
        type: 'warning',
        icon: FaExclamationTriangle,
        title: 'Egresados inactivos',
        message: `${stats.egresadosInactivos} egresados están marcados como inactivos`,
        count: stats.egresadosInactivos
      });
    }

    // Baja tasa de empleabilidad
    const tasaMinima = thresholds.tasaEmpleabilidadMinima || 70;
    if (parseFloat(stats.tasaEmpleabilidad) < tasaMinima) {
      alertsList.push({
        type: 'warning',
        icon: FaExclamationTriangle,
        title: 'Tasa de empleabilidad baja',
        message: `La tasa de empleabilidad es del ${stats.tasaEmpleabilidad}%`,
        count: parseFloat(stats.tasaEmpleabilidad)
      });
    }

    // Pocas empresas registradas
    const empresasMinimas = thresholds.empresasMinimas || 10;
    if (stats.totalEmpresas < empresasMinimas) {
      alertsList.push({
        type: 'info',
        icon: FaBuilding,
        title: 'Pocas empresas registradas',
        message: `Solo ${stats.totalEmpresas} empresas están registradas en el sistema`,
        count: stats.totalEmpresas
      });
    }

    setAlerts(alertsList);
  };

  const generateRecentActivity = () => {
    if (!config.recentActivity?.enabled) {
      setRecentActivity([]);
      return;
    }

    const activities = [];
    const maxItems = config.recentActivity?.maxItems || 5;

    // Actividad reciente simulada basada en datos reales
    const recentEgresados = egresados.slice(0, 3);
    recentEgresados.forEach(eg => {
      activities.push({
        type: 'egresado',
        icon: FaUsers,
        title: 'Egresado registrado',
        message: `${eg.nombre} ${eg.apellidos}`,
        time: 'Hace 2 horas'
      });
    });

    const recentEmpresas = empresas.slice(0, 2);
    recentEmpresas.forEach(emp => {
      activities.push({
        type: 'empresa',
        icon: FaBuilding,
        title: 'Empresa registrada',
        message: emp.nombre,
        time: 'Hace 1 día'
      });
    });

    setRecentActivity(activities.slice(0, maxItems));
  };

  useEffect(() => {
    fetchAllEgresados();
    fetchEmpresasSeguro();
    fetchReportesSeguro();
    fetchCarreras(); // Agregar carga de carreras
  }, []);

  // Auto-refresh basado en configuración
  useEffect(() => {
    if (!config.general?.autoRefresh) return;

    const interval = config.refreshInterval || 30000;
    const refreshTimer = setInterval(() => {
      if (config.general?.autoRefresh) {
        fetchAllEgresados();
        fetchEmpresasSeguro();
        fetchReportesSeguro();
      }
    }, interval);

    return () => clearInterval(refreshTimer);
  }, [config.general?.autoRefresh, config.refreshInterval]);

  useEffect(() => {
    if (egresados.length > 0 || empresas.length > 0 || carreras.length > 0) {
      calculateStats();
    }
  }, [egresados, empresas, reportes, carreras]);

  useEffect(() => {
    generateAlerts();
  }, [stats, config.general?.showAlerts, config.alertThresholds]);

  useEffect(() => {
    generateRecentActivity();
  }, [egresados, empresas, config.recentActivity]);

  const prepareChartData = () => {
    const carreraData = reportes.egresadosPorCarrera || [];
    const estadoData = reportes.egresadosPorEstado || [];
    const anioData = reportes.egresadosPorAnio || [];

    console.log('📊 Dashboard - Datos de reportes recibidos:', {
      egresadosPorCarrera: carreraData,
      egresadosPorEstado: estadoData,
      egresadosPorAnio: anioData
    });

    // Función para obtener el nombre de la carrera por ID
    const getCarreraName = (carreraId) => {
      const carrera = carreras.find(c => c.id_carrera === carreraId);
      return carrera ? carrera.nombre_carrera : null; // Retornar null si no existe
    };

    // Filtrar solo las carreras que existen en el catálogo
    const processedCarreraData = carreraData
      .filter(item => getCarreraName(item.carrera_id) !== null) // Solo carreras que existen
      .map(item => ({
        name: getCarreraName(item.carrera_id),
        cantidad: item.total
      }));

    const processedData = {
      carreraData: processedCarreraData,
      estadoData: estadoData.map(item => ({
        name: item.estado === 'A' ? 'Activos' : 'Inactivos',
        cantidad: item.total,
        fill: item.estado === 'A' ? '#059669' : '#dc2626'
      })),
      anioData: anioData.map(item => ({
        name: item.anio_egreso?.toString(),
        cantidad: item.total
      }))
    };

    console.log('📊 Dashboard - Datos procesados para gráficos:', processedData);
    return processedData;
  };

  const chartData = prepareChartData();

  if (reportesLoading || egresadosLoading || empresasLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Sistema de Seguimiento de Egresados</h1>
          <p>Dashboard automatizado - Instituto Superior Tecnológico</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-config"
            onClick={() => setShowConfig(true)}
            title="Configurar Dashboard"
          >
            <FaCog /> Configuración
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="metrics-grid">
        {config.showMetrics?.totalEgresados !== false && (
          <div className="metric-card">
            <div className="metric-icon">
              <FaUsers />
            </div>
            <div className="metric-content">
              <h3>{stats.totalEgresados || 0}</h3>
              <p>Total Egresados</p>
              <span className="metric-change positive">
                <FaArrowUp /> {stats.egresadosActivos || 0} activos
              </span>
            </div>
          </div>
        )}

        {config.showMetrics?.totalEmpleados !== false && (
          <div className="metric-card">
            <div className="metric-icon">
              <FaBriefcase />
            </div>
            <div className="metric-content">
              <h3>{stats.totalEmpleados || 0}</h3>
              <p>Empleados Activos</p>
              <span className="metric-change positive">
                <FaArrowUp /> {stats.tasaEmpleabilidad || 0}% empleabilidad
              </span>
            </div>
          </div>
        )}

        {config.showMetrics?.totalEmpresas !== false && (
          <div className="metric-card">
            <div className="metric-icon">
              <FaBuilding />
            </div>
            <div className="metric-content">
              <h3>{stats.totalEmpresas || 0}</h3>
              <p>Empresas Registradas</p>
              <span className="metric-change positive">
                <FaArrowUp /> Centros laborales
              </span>
            </div>
          </div>
        )}

        {config.showMetrics?.carrerasActivas !== false && (
          <div className="metric-card">
            <div className="metric-icon">
              <FaChartBar />
            </div>
            <div className="metric-content">
              <h3>{carreras.length}</h3>
              <p>Carreras Activas</p>
              <span className="metric-change positive">
                <FaArrowUp /> Programas académicos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Gráficos y alertas */}
      <div className="dashboard-content">
        <div className="dashboard-left">
          {/* Gráficos principales */}
          <div className="charts-section">
            {config.showCharts?.egresadosPorCarrera !== false && (
              <div className="chart-card">
                <h3>Egresados por Carrera</h3>
                {chartData.carreraData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.carreraData}>
                      {config.chartSettings?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" />}
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      {config.chartSettings?.showLegend !== false && <Legend />}
                      <Bar 
                        dataKey="cantidad" 
                        fill="#2563eb"
                        animationDuration={config.chartSettings?.animationEnabled !== false ? 1000 : 0}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    <p>No hay datos disponibles para mostrar</p>
                  </div>
                )}
              </div>
            )}

            {config.showCharts?.distribucionPorEstado !== false && (
              <div className="chart-card">
                <h3>Distribución por Estado</h3>
                {chartData.estadoData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.estadoData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cantidad"
                        animationDuration={config.chartSettings?.animationEnabled !== false ? 1000 : 0}
                      >
                        {chartData.estadoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      {config.chartSettings?.showLegend !== false && <Legend />}
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    <p>No hay datos disponibles para mostrar</p>
                  </div>
                )}
              </div>
            )}

            {config.showCharts?.egresadosPorAnio !== false && (
              <div className="chart-card">
                <h3>Egresados por Año</h3>
                {chartData.anioData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.anioData}>
                      {config.chartSettings?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" />}
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      {config.chartSettings?.showLegend !== false && <Legend />}
                      <Line 
                        type="monotone" 
                        dataKey="cantidad" 
                        stroke="#059669" 
                        strokeWidth={2}
                        animationDuration={config.chartSettings?.animationEnabled !== false ? 1000 : 0}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    <p>No hay datos disponibles para mostrar</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-right">
          {/* Alertas */}
          <div className="alerts-section">
            <h3>Alertas del Sistema</h3>
            <div className="alerts-list">
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <div key={index} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      <alert.icon />
                    </div>
                    <div className="alert-content">
                      <h4>{alert.title}</h4>
                      <p>{alert.message}</p>
                      <span className="alert-count">{alert.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-alerts">
                  <FaCheckCircle />
                  <p>No hay alertas pendientes</p>
                </div>
              )}
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="activity-section">
            <h3>Actividad Reciente</h3>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <activity.icon />
                    </div>
                    <div className="activity-content">
                      <p><strong>{activity.title}</strong></p>
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activity">
                  <FaClock />
                  <p>No hay actividad reciente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          <Link to="/" className="action-card">
            <FaUsers />
            <span>Gestionar Egresados</span>
          </Link>
          <Link to="/detalles" className="action-card">
            <FaBriefcase />
            <span>Información Laboral</span>
          </Link>
          <Link to="/empresas" className="action-card">
            <FaBuilding />
            <span>Gestionar Empresas</span>
          </Link>
          <Link to="/analytics" className="action-card">
            <FaFileAlt />
            <span>Reportes Detallados</span>
          </Link>
        </div>
      </div>

      {/* Modal de configuración */}
      <DashboardConfig 
        isOpen={showConfig} 
        onClose={() => setShowConfig(false)} 
      />
    </div>
  );
};

export default Dashboard;