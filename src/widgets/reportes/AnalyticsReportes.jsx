import React, { useState } from 'react';
import { 
  FaFilePdf, FaChartBar
} from 'react-icons/fa';
import EstadisticasAvanzadas from './EstadisticasAvanzadas';
import ReporteEgresadosPorCarrera from './ReporteEgresadosPorCarrera';
import ReporteEgresadosPorEstado from './ReporteEgresadosPorEstado';
import ReporteEgresadosPorAnio from './ReporteEgresadosPorAnio';
import './AnalyticsReportes.css';

const AnalyticsReportes = () => {
  const [activeTab, setActiveTab] = useState('estadisticas');

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>
            <FaChartBar /> Reportes Detallados
          </h1>
          <p>Análisis estadístico avanzado y reportes del seguimiento de egresados</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'estadisticas' ? 'active' : ''}`}
            onClick={() => setActiveTab('estadisticas')}
          >
            <FaChartBar /> Estadísticas Avanzadas
          </button>
          <button 
            className={`tab ${activeTab === 'reportes' ? 'active' : ''}`}
            onClick={() => setActiveTab('reportes')}
          >
            <FaFilePdf /> Reportes Básicos
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="tab-content">
        {activeTab === 'estadisticas' && <EstadisticasAvanzadas />}
        {activeTab === 'reportes' && (
          <div className="reports-content">
            <div className="reports-grid">
              <div className="report-section">
                <div className="report-header">
                  <h3>Reporte por Carrera</h3>
                  <p>Análisis detallado de egresados agrupados por carrera profesional</p>
                </div>
                <ReporteEgresadosPorCarrera />
              </div>
              
              <div className="report-section">
                <div className="report-header">
                  <h3>Reporte por Estado</h3>
                  <p>Distribución de egresados según su estado laboral actual</p>
                </div>
                <ReporteEgresadosPorEstado />
              </div>
              
              <div className="report-section">
                <div className="report-header">
                  <h3>Reporte por Año</h3>
                  <p>Evolución temporal de egresados y su inserción laboral</p>
                </div>
                <ReporteEgresadosPorAnio />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsReportes;
