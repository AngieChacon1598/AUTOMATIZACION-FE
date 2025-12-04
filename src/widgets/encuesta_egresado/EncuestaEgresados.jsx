import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaUndo, FaEye, FaTimes, FaPlus, FaListAlt, FaFileAlt } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import StatusIndicator from '../../components/StatusIndicator';
import { useEncuestas, useEgresados } from '../../shared/useApi.jsx';
import EncuestaDetailModal from './EncuestaDetailModal';
import '../../shared/unified-tables.css';
import './EncuestaEgresados.css';

const EncuestaEgresados = () => {
  const { 
    encuestas, 
    loading, 
    error, 
    pagination, 
    fetchEncuestas, 
    deleteEncuesta, 
    restoreEncuesta,
    changePage,
    changePageSize
  } = useEncuestas();
  
  const { egresados, fetchEgresados } = useEgresados();
  
  const [filtros, setFiltros] = useState({
    codigo_egresado: '',
    fecha_encuesta: ''
  });
  const [filter, setFilter] = useState('A');
  const [message, setMessage] = useState('');
  
  // Estado para el modal de detalles
  const [selectedEncuesta, setSelectedEncuesta] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchEgresados({ estado: 'A', per_page: 1000 });
  }, []);

  useEffect(() => {
    fetchEncuestas({
      estado: filter,
      ...filtros
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, filtros, pagination.page, pagination.per_page]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      codigo_egresado: '',
      fecha_encuesta: ''
    });
  };

  // Función para abrir el modal de detalles
  const handleViewDetails = (encuesta) => {
    setSelectedEncuesta(encuesta);
    setShowDetailModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedEncuesta(null);
  };

  const handleDeleteEncuesta = async (idEncuesta) => {
    if (!window.confirm('¿Estás seguro de eliminar esta encuesta?\n\nLa encuesta se marcará como inactiva y no aparecerá en la lista de activos, pero podrás restaurarla desde la vista de inactivos.')) return;
    
    const result = await deleteEncuesta(idEncuesta);
    if (result.success) {
      setMessage('Encuesta eliminada correctamente! Se ha movido a la lista de inactivos.');
      fetchEncuestas({
        estado: filter,
        ...filtros
      });
    } else {
      setMessage('Error al eliminar la encuesta: ' + result.error);
    }
  };

  const handleRestoreEncuesta = async (idEncuesta) => {
    const result = await restoreEncuesta(idEncuesta);
    if (result.success) {
      setMessage('Encuesta restaurada correctamente!');
      fetchEncuestas({
        estado: filter,
        ...filtros
      });
    } else {
      setMessage('Error al restaurar la encuesta: ' + result.error);
    }
  };

  const getEgresadoNombre = (codigo) => {
    if (!codigo) return 'No especificado';
    const egresado = egresados.find(e => e.codigo === codigo);
    return egresado ? `${egresado.nombre} ${egresado.apellidos}` : codigo;
  };

  // Limpiar mensaje después de 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="unified-content">
      <TopHeader 
        title="ENCUESTAS DE EGRESADOS"
        breadcrumb="GESTIÓN > ENCUESTAS DE EGRESADOS"
      />
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
          <button onClick={() => setMessage('')} className="message-close">
            <FaTimes />
          </button>
        </div>
      )}

      <div className="content-header">
        <div className="header-actions">
          <Link to="/encuestas/nueva" className="btn btn-primary">
            <FaPlus /> Nueva Encuesta
          </Link>
        </div>
        
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'A' ? 'active' : ''}`}
            onClick={() => setFilter('A')}
          >
            <FaListAlt /> Activos ({pagination.total || 0})
          </button>
          <button 
            className={`filter-tab ${filter === 'I' ? 'active' : ''}`}
            onClick={() => setFilter('I')}
          >
            <FaListAlt /> Inactivos
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label>Código de Egresado:</label>
            <input
              type="text"
              value={filtros.codigo_egresado}
              onChange={(e) => handleFiltroChange('codigo_egresado', e.target.value)}
              placeholder="Buscar por código..."
            />
          </div>
          <div className="filter-group">
            <label>Fecha de Encuesta:</label>
            <input
              type="date"
              value={filtros.fecha_encuesta}
              onChange={(e) => handleFiltroChange('fecha_encuesta', e.target.value)}
            />
          </div>
          <div className="filter-actions">
            <button onClick={limpiarFiltros} className="btn btn-secondary">
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando encuestas...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="table-container">
            <table className="unified-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código Egresado</th>
                  <th>Egresado</th>
                  <th>Fecha Encuesta</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {encuestas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No hay encuestas {filter === 'A' ? 'activas' : 'inactivas'} disponibles
                    </td>
                  </tr>
                ) : (
                  encuestas.map((encuesta) => (
                    <tr key={encuesta.id_encuesta}>
                      <td>{encuesta.id_encuesta}</td>
                      <td>{encuesta.codigo_egresado || '-'}</td>
                      <td>{getEgresadoNombre(encuesta.codigo_egresado)}</td>
                      <td>
                        {encuesta.fecha_encuesta 
                          ? new Date(encuesta.fecha_encuesta).toLocaleDateString() 
                          : '-'}
                      </td>
                      <td>
                        <StatusIndicator status={encuesta.estado} />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleViewDetails(encuesta)}
                            className="btn-icon btn-view"
                            title="Ver detalles"
                          >
                            <FaEye />
                          </button>
                          {filter === 'A' ? (
                            <>
                              <Link
                                to={`/encuestas/editar/${encuesta.id_encuesta}`}
                                className="btn-icon btn-edit"
                                title="Editar"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDeleteEncuesta(encuesta.id_encuesta)}
                                className="btn-icon btn-delete"
                                title="Eliminar"
                              >
                                <FaTrashAlt />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleRestoreEncuesta(encuesta.id_encuesta)}
                              className="btn-icon btn-restore"
                              title="Restaurar"
                            >
                              <FaUndo />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.total_pages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                <span>
                  Mostrando {(pagination.page - 1) * pagination.per_page + 1} - {Math.min(pagination.page * pagination.per_page, pagination.total)} de {pagination.total}
                </span>
                <select
                  value={pagination.per_page}
                  onChange={(e) => changePageSize(parseInt(e.target.value))}
                  className="page-size-select"
                >
                  <option value={10}>10 por página</option>
                  <option value={25}>25 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={100}>100 por página</option>
                </select>
              </div>
              <div className="pagination-buttons">
                <button
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-pagination"
                >
                  Anterior
                </button>
                <span className="page-numbers">
                  Página {pagination.page} de {pagination.total_pages}
                </span>
                <button
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.total_pages}
                  className="btn-pagination"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de detalles */}
      {showDetailModal && selectedEncuesta && (
        <EncuestaDetailModal
          encuesta={selectedEncuesta}
          egresadoNombre={getEgresadoNombre(selectedEncuesta.codigo_egresado)}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default EncuestaEgresados;

