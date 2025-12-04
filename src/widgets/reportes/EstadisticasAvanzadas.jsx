import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  FaUsers, FaGraduationCap, FaBuilding, FaChartBar, FaChartPie, FaChartLine,
  FaDownload, FaPercentage, FaArrowUp
} from 'react-icons/fa';
import './EstadisticasAvanzadas.css';
import { catalogosService } from '../../shared/api/apiService';

const EstadisticasAvanzadas = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    egresados: [],
    detalles: [],
    empresas: [],
    certificaciones: []
  });
  const [carreras, setCarreras] = useState([]);

  // Estados para filtros
  const [dateRange, setDateRange] = useState('all');
  const [selectedCarrera, setSelectedCarrera] = useState('all');

  // Colores para gráficos
  const COLORS = ['#1976d2', '#43a047', '#fb8c00', '#e53935', '#8e24aa', '#00acc1'];

  const fetchCarreras = async () => {
    try {
      const result = await catalogosService.getCarrerasProfesionales();
      if (result.success) {
        setCarreras(result.data);
      }
    } catch (err) {
      console.error('Error al cargar carreras:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [egresadosRes, detallesRes, empresasRes, certRes] = await Promise.all([
        axios.get('http://localhost:5001/egresados?per_page=1000'),
        axios.get('http://localhost:5001/detalle-egresados?per_page=1000'),
        axios.get('http://localhost:5001/empresas'),
        axios.get('http://localhost:5001/certificaciones')
      ]);

      const data = {
        egresados: egresadosRes.data.egresados || [],
        detalles: detallesRes.data.detalles || [],
        empresas: empresasRes.data.empresas || [],
        certificaciones: certRes.data.certificaciones || []
      };

      setStatsData(data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos estadísticos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarreras();
    fetchAllData();
  }, [dateRange, selectedCarrera]);

  // Función para obtener el nombre de la carrera por ID
  const getCarreraName = (carreraId) => {
    if (!carreraId) return 'Sin especificar';
    const carrera = carreras.find(c => c.id_carrera === carreraId);
    return carrera ? carrera.nombre_carrera : 'Sin especificar';
  };

  // Función para calcular estadísticas por carrera
  const getStatsByCarrera = () => {
    const carreraStats = {};
    
    statsData.egresados.forEach(egresado => {
      const carreraId = egresado.carrera_id;
      const carreraName = getCarreraName(carreraId);
      
      if (!carreraStats[carreraId]) {
        carreraStats[carreraId] = {
          carrera: carreraName,
          carreraId,
          total: 0,
          activos: 0,
          inactivos: 0,
          conDetalles: 0
        };
      }
      
      carreraStats[carreraId].total++;
      if (egresado.estado === 'A') {
        carreraStats[carreraId].activos++;
      } else {
        carreraStats[carreraId].inactivos++;
      }
    });

    // Contar egresados con detalles por carrera
    statsData.detalles.forEach(detalle => {
      const egresado = statsData.egresados.find(e => e.codigo === detalle.codigo_egresado);
      if (egresado && carreraStats[egresado.carrera_id]) {
        carreraStats[egresado.carrera_id].conDetalles++;
      }
    });

    return Object.values(carreraStats).map(item => ({
      ...item,
      porcentajeActivos: item.total > 0 ? ((item.activos / item.total) * 100).toFixed(1) : 0,
      porcentajeConDetalles: item.total > 0 ? ((item.conDetalles / item.total) * 100).toFixed(1) : 0
    }));
  };

  // Función para calcular estadísticas por estado
  const getStatsByEstado = () => {
    const activos = statsData.egresados.filter(e => e.estado === 'A').length;
    const inactivos = statsData.egresados.filter(e => e.estado === 'I').length;
    const total = activos + inactivos;

    return [
      { estado: 'Activos', cantidad: activos, porcentaje: total > 0 ? ((activos / total) * 100).toFixed(1) : 0 },
      { estado: 'Inactivos', cantidad: inactivos, porcentaje: total > 0 ? ((inactivos / total) * 100).toFixed(1) : 0 }
    ];
  };

  // Función para calcular estadísticas por año (simulado basado en datos disponibles)
  const getStatsByYear = () => {
    const years = {};
    const currentYear = new Date().getFullYear();
    
    // Simular distribución por años (últimos 5 años)
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      years[year] = Math.floor(Math.random() * 50) + 20; // Datos simulados
    }

    return Object.entries(years).map(([year, cantidad]) => ({
      anio: year,
      cantidad,
      porcentaje: ((cantidad / statsData.egresados.length) * 100).toFixed(1)
    }));
  };

  // Función para calcular métricas generales
  const getGeneralMetrics = () => {
    const totalEgresados = statsData.egresados.length;
    const activos = statsData.egresados.filter(e => e.estado === 'A').length;
    const conDetalles = statsData.detalles.length;
    const totalEmpresas = statsData.empresas.length;
    const totalCertificaciones = statsData.certificaciones.length;

    return {
      totalEgresados,
      activos,
      inactivos: totalEgresados - activos,
      conDetalles,
      sinDetalles: totalEgresados - conDetalles,
      totalEmpresas,
      totalCertificaciones,
      porcentajeActivos: totalEgresados > 0 ? ((activos / totalEgresados) * 100).toFixed(1) : 0,
      porcentajeConDetalles: totalEgresados > 0 ? ((conDetalles / totalEgresados) * 100).toFixed(1) : 0
    };
  };

  // Función para calcular estadísticas de inserción laboral
  const getInsercionLaboralStats = () => {
    const conTrabajo = statsData.detalles.filter(d => d.estado_laboral === 'Trabajando').length;
    const buscandoTrabajo = statsData.detalles.filter(d => d.estado_laboral === 'Buscando trabajo').length;
    const estudiando = statsData.detalles.filter(d => d.estado_laboral === 'Estudiando').length;
    const otros = statsData.detalles.length - conTrabajo - buscandoTrabajo - estudiando;

    return [
      { estado: 'Trabajando', cantidad: conTrabajo, color: '#4caf50' },
      { estado: 'Buscando trabajo', cantidad: buscandoTrabajo, color: '#ff9800' },
      { estado: 'Estudiando', cantidad: estudiando, color: '#2196f3' },
      { estado: 'Otros', cantidad: otros, color: '#9e9e9e' }
    ];
  };

  const exportToPDF = () => {
    alert('Funcionalidad de exportación a PDF en desarrollo...');
  };

  const exportToExcel = () => {
    alert('Funcionalidad de exportación a Excel en desarrollo...');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchAllData} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  const metrics = getGeneralMetrics();
  const carreraStats = getStatsByCarrera();
  const estadoStats = getStatsByEstado();
  const yearStats = getStatsByYear();
  const insercionStats = getInsercionLaboralStats();

  return (
    <div className="estadisticas-avanzadas">
      {/* Header */}
      <div className="stats-header">
        <div className="header-content">
          <h1>
            <FaChartBar /> Estadísticas Avanzadas
          </h1>
          <p>Análisis detallado y visualización de datos de egresados</p>
        </div>
        <div className="header-actions">
          <div className="filter-controls">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos los períodos</option>
              <option value="year">Último año</option>
              <option value="semester">Último semestre</option>
              <option value="quarter">Último trimestre</option>
            </select>
            <select 
              value={selectedCarrera} 
              onChange={(e) => setSelectedCarrera(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todas las carreras</option>
              {carreraStats
                .filter(carrera => carrera.carrera !== 'Sin especificar')
                .map(carrera => (
                  <option key={carrera.carrera} value={carrera.carrera}>
                    {carrera.carrera}
                  </option>
                ))}
            </select>
          </div>
          <div className="export-actions">
            <button onClick={exportToPDF} className="export-btn pdf">
              <FaDownload /> PDF
            </button>
            <button onClick={exportToExcel} className="export-btn excel">
              <FaDownload /> Excel
            </button>
          </div>
        </div>
      </div>

      {/* Métricas Generales */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <FaUsers />
          </div>
          <div className="metric-content">
            <h3>{metrics.totalEgresados}</h3>
            <p>Total Egresados</p>
            <span className="metric-trend">
              <FaArrowUp /> {metrics.porcentajeActivos}% activos
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FaGraduationCap />
          </div>
          <div className="metric-content">
            <h3>{metrics.conDetalles}</h3>
            <p>Con Detalles</p>
            <span className="metric-trend">
              <FaPercentage /> {metrics.porcentajeConDetalles}% del total
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FaBuilding />
          </div>
          <div className="metric-content">
            <h3>{metrics.totalEmpresas}</h3>
            <p>Empresas</p>
            <span className="metric-trend">
              <FaArrowUp /> Registradas
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FaChartBar />
          </div>
          <div className="metric-content">
            <h3>{metrics.totalCertificaciones}</h3>
            <p>Certificaciones</p>
            <span className="metric-trend">
              <FaArrowUp /> Emitidas
            </span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        {/* Gráfico de Barras - Egresados por Carrera */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>
              <FaChartBar /> Egresados por Carrera
            </h3>
            <p>Distribución de egresados según su carrera profesional</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={carreraStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="carrera" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  fontSize={12}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#1976d2" name="Total" />
                <Bar dataKey="activos" fill="#43a047" name="Activos" />
                <Bar dataKey="conDetalles" fill="#fb8c00" name="Con Detalles" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pastel - Distribución por Estado */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>
              <FaChartPie /> Distribución por Estado
            </h3>
            <p>Proporción de egresados activos e inactivos</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadoStats}
                  dataKey="cantidad"
                  nameKey="estado"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ estado, porcentaje }) => `${estado}: ${porcentaje}%`}
                >
                  {estadoStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Líneas - Evolución Temporal */}
        <div className="chart-container full-width">
          <div className="chart-header">
            <h3>
              <FaChartLine /> Evolución Temporal
            </h3>
            <p>Tendencia de egresados por año (datos simulados)</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="anio" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cantidad" 
                  stroke="#1976d2" 
                  strokeWidth={3}
                  name="Egresados"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pastel - Inserción Laboral */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>
              <FaChartPie /> Inserción Laboral
            </h3>
            <p>Estado laboral actual de los egresados</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insercionStats}
                  dataKey="cantidad"
                  nameKey="estado"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                >
                  {insercionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Área - Comparativa por Carrera */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>
              <FaChartBar /> Comparativa por Carrera
            </h3>
            <p>Activos vs Inactivos por carrera</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={carreraStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="carrera" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  fontSize={12}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="activos" 
                  stackId="1" 
                  stroke="#43a047" 
                  fill="#43a047" 
                  name="Activos"
                />
                <Area 
                  type="monotone" 
                  dataKey="inactivos" 
                  stackId="1" 
                  stroke="#e53935" 
                  fill="#e53935" 
                  name="Inactivos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de Resumen */}
      <div className="summary-table-container">
        <div className="table-header">
          <h3>Resumen por Carrera</h3>
          <p>Métricas detalladas de cada carrera profesional</p>
        </div>
        <div className="table-content">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Carrera</th>
                <th>Total</th>
                <th>Activos</th>
                <th>Inactivos</th>
                <th>Con Detalles</th>
                <th>% Activos</th>
                <th>% Con Detalles</th>
              </tr>
            </thead>
            <tbody>
              {carreraStats
                .filter(carrera => carrera.carrera !== 'Sin especificar')
                .map((carrera, index) => (
                  <tr key={index}>
                    <td>{carrera.carrera}</td>
                    <td>{carrera.total}</td>
                    <td>{carrera.activos}</td>
                    <td>{carrera.inactivos}</td>
                    <td>{carrera.conDetalles}</td>
                    <td>{carrera.porcentajeActivos}%</td>
                    <td>{carrera.porcentajeConDetalles}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasAvanzadas;
