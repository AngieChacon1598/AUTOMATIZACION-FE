import React, { useState } from 'react';
import { FaCog, FaTimes, FaSave, FaUndo, FaSync, FaChartBar, FaBell, FaClock } from 'react-icons/fa';
import { useDashboardConfig } from '../shared/useDashboardConfig';
import './DashboardConfig.css';

const DashboardConfig = ({ isOpen, onClose }) => {
  const { config, saveConfig, updateConfigSection, resetConfig } = useDashboardConfig();
  const [localConfig, setLocalConfig] = useState(config);
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState('');

  // Sincronizar config local cuando cambia la config global
  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (section, key, value) => {
    setLocalConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNestedChange = (section, subsection, key, value) => {
    setLocalConfig(prev => {
      // Si subsection es igual a section, significa que estamos actualizando directamente en section
      if (subsection === section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: value
          }
        };
      }
      // Caso de anidamiento real (aunque no lo estamos usando actualmente)
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [key]: value
          }
        }
      };
    });
  };

  const handleSave = () => {
    const success = saveConfig(localConfig);
    if (success) {
      setMessage('Configuración guardada exitosamente');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1500);
    } else {
      setMessage('Error al guardar la configuración');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de resetear la configuración a los valores por defecto?')) {
      resetConfig();
      setMessage('Configuración reseteada');
      setTimeout(() => {
        setMessage('');
        // El useEffect se encargará de actualizar localConfig cuando config cambie
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dashboard-config-overlay" onClick={onClose}>
      <div className="dashboard-config-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dashboard-config-header">
          <div className="config-header-title">
            <FaCog />
            <h2>Configuración del Dashboard</h2>
          </div>
          <button className="config-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {message && (
          <div className={`config-message ${message.includes('exitosamente') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="dashboard-config-body">
          {/* Tabs */}
          <div className="config-tabs">
            <button
              className={`config-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <FaCog /> General
            </button>
            <button
              className={`config-tab ${activeTab === 'metrics' ? 'active' : ''}`}
              onClick={() => setActiveTab('metrics')}
            >
              <FaChartBar /> Métricas
            </button>
            <button
              className={`config-tab ${activeTab === 'charts' ? 'active' : ''}`}
              onClick={() => setActiveTab('charts')}
            >
              <FaChartBar /> Gráficos
            </button>
            <button
              className={`config-tab ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
            >
              <FaBell /> Alertas
            </button>
            <button
              className={`config-tab ${activeTab === 'refresh' ? 'active' : ''}`}
              onClick={() => setActiveTab('refresh')}
            >
              <FaSync /> Actualización
            </button>
          </div>

          {/* Contenido de tabs */}
          <div className="config-content">
            {/* Tab General */}
            {activeTab === 'general' && (
              <div className="config-section">
                <h3>Configuración General</h3>
                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.general.autoRefresh}
                      onChange={(e) => handleNestedChange('general', 'general', 'autoRefresh', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Actualización automática</span>
                  </label>
                  <p className="config-help">Actualiza los datos del dashboard automáticamente</p>
                </div>

                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.general.showAlerts}
                      onChange={(e) => handleNestedChange('general', 'general', 'showAlerts', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Mostrar alertas</span>
                  </label>
                  <p className="config-help">Muestra las alertas del sistema en el dashboard</p>
                </div>

                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.general.compactMode}
                      onChange={(e) => handleNestedChange('general', 'general', 'compactMode', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Modo compacto</span>
                  </label>
                  <p className="config-help">Reduce el espaciado para mostrar más información</p>
                </div>

                <div className="config-group">
                  <label>
                    Período de reportes (años)
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={localConfig.reportPeriod.years}
                      onChange={(e) => handleNestedChange('reportPeriod', 'reportPeriod', 'years', parseInt(e.target.value) || 5)}
                    />
                  </label>
                  <p className="config-help">Años hacia atrás para incluir en los reportes</p>
                </div>
              </div>
            )}

            {/* Tab Métricas */}
            {activeTab === 'metrics' && (
              <div className="config-section">
                <h3>Métricas a Mostrar</h3>
                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.showMetrics.totalEgresados}
                      onChange={(e) => handleChange('showMetrics', 'totalEgresados', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Total de Egresados</span>
                  </label>
                </div>

                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.showMetrics.totalEmpleados}
                      onChange={(e) => handleChange('showMetrics', 'totalEmpleados', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Total de Empleados</span>
                  </label>
                </div>

                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.showMetrics.totalEmpresas}
                      onChange={(e) => handleChange('showMetrics', 'totalEmpresas', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Total de Empresas</span>
                  </label>
                </div>

                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.showMetrics.carrerasActivas}
                      onChange={(e) => handleChange('showMetrics', 'carrerasActivas', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Carreras Activas</span>
                  </label>
                </div>
              </div>
            )}

            {/* Tab Gráficos */}
            {activeTab === 'charts' && (
              <div className="config-section">
                <h3>Gráficos a Mostrar</h3>
                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.showCharts.egresadosPorCarrera}
                      onChange={(e) => handleChange('showCharts', 'egresadosPorCarrera', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Egresados por Carrera</span>
                  </label>
                </div>

                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.showCharts.distribucionPorEstado}
                      onChange={(e) => handleChange('showCharts', 'distribucionPorEstado', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Distribución por Estado</span>
                  </label>
                </div>

                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.showCharts.egresadosPorAnio}
                      onChange={(e) => handleChange('showCharts', 'egresadosPorAnio', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Egresados por Año</span>
                  </label>
                </div>

                <div className="config-divider"></div>

                <h4>Configuración de Gráficos</h4>
                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.chartSettings.showGrid}
                      onChange={(e) => handleChange('chartSettings', 'showGrid', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Mostrar cuadrícula</span>
                  </label>
                </div>

                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.chartSettings.showLegend}
                      onChange={(e) => handleChange('chartSettings', 'showLegend', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Mostrar leyenda</span>
                  </label>
                </div>

                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.chartSettings.animationEnabled}
                      onChange={(e) => handleChange('chartSettings', 'animationEnabled', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Animaciones</span>
                  </label>
                </div>
              </div>
            )}

            {/* Tab Alertas */}
            {activeTab === 'alerts' && (
              <div className="config-section">
                <h3>Umbrales de Alertas</h3>
                <div className="config-group">
                  <label>
                    Tasa de Empleabilidad Mínima (%)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={localConfig.alertThresholds.tasaEmpleabilidadMinima}
                      onChange={(e) => handleChange('alertThresholds', 'tasaEmpleabilidadMinima', parseInt(e.target.value) || 70)}
                    />
                  </label>
                  <p className="config-help">Se mostrará una alerta si la tasa es menor a este valor</p>
                </div>

                <div className="config-group">
                  <label>
                    Empresas Mínimas
                    <input
                      type="number"
                      min="0"
                      value={localConfig.alertThresholds.empresasMinimas}
                      onChange={(e) => handleChange('alertThresholds', 'empresasMinimas', parseInt(e.target.value) || 10)}
                    />
                  </label>
                  <p className="config-help">Se mostrará una alerta si hay menos empresas que este valor</p>
                </div>

                <div className="config-group">
                  <label>
                    Egresados Inactivos Máximos
                    <input
                      type="number"
                      min="0"
                      value={localConfig.alertThresholds.egresadosInactivosMaximos}
                      onChange={(e) => handleChange('alertThresholds', 'egresadosInactivosMaximos', parseInt(e.target.value) || 0)}
                    />
                  </label>
                  <p className="config-help">Se mostrará una alerta si hay más egresados inactivos que este valor</p>
                </div>

                <div className="config-divider"></div>

                <h4>Actividad Reciente</h4>
                <div className="config-group">
                  <label className="config-switch">
                    <input
                      type="checkbox"
                      checked={localConfig.recentActivity.enabled}
                      onChange={(e) => handleChange('recentActivity', 'enabled', e.target.checked)}
                    />
                    <span className="config-switch-slider"></span>
                    <span className="config-switch-label">Mostrar actividad reciente</span>
                  </label>
                </div>

                <div className="config-group">
                  <label>
                    Cantidad Máxima de Items
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={localConfig.recentActivity.maxItems}
                      onChange={(e) => handleChange('recentActivity', 'maxItems', parseInt(e.target.value) || 5)}
                    />
                  </label>
                  <p className="config-help">Número máximo de actividades a mostrar</p>
                </div>
              </div>
            )}

            {/* Tab Actualización */}
            {activeTab === 'refresh' && (
              <div className="config-section">
                <h3>Configuración de Actualización</h3>
                <div className="config-group">
                  <label>
                    Intervalo de Actualización (segundos)
                    <input
                      type="number"
                      min="10"
                      max="300"
                      step="10"
                      value={localConfig.refreshInterval / 1000}
                      onChange={(e) => handleChange('refreshInterval', 'refreshInterval', (parseInt(e.target.value) || 30) * 1000)}
                    />
                  </label>
                  <p className="config-help">Tiempo entre actualizaciones automáticas (10-300 segundos)</p>
                  <div className="config-interval-display">
                    <FaClock /> Actualización cada: {localConfig.refreshInterval / 1000} segundos
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-config-footer">
          <button className="config-btn config-btn-reset" onClick={handleReset}>
            <FaUndo /> Resetear
          </button>
          <div className="config-footer-actions">
            <button className="config-btn config-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="config-btn config-btn-save" onClick={handleSave}>
              <FaSave /> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardConfig;

