import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaUndo, FaEye, FaTimes, FaPlus, FaListAlt, FaFileAlt, FaSearch } from 'react-icons/fa';
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
    trabaja: 'todos',
    tiene_negocio: 'todos',
    estado: 'todos'
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
      trabaja: 'todos',
      tiene_negocio: 'todos',
      estado: 'todos'
    });
  };

  const handleFiltrar = () => {
    // Por ahora solo recarga con los filtros actuales
    fetchEncuestas({
      estado: filter === 'A' ? 'A' : 'I',
      ...filtros
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
    <div className="encuestas-container">
      <TopHeader 
        title="Encuestas de Egresados"
        breadcrumb="GESTIÓN > ENCUESTAS"
      />
      
      <div className="unified-content">
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
          <button onClick={() => setMessage('')} className="message-close">
            <FaTimes />
          </button>
        </div>
      )}

      <div className="content-header-encuestas">
        <div className="header-actions-encuestas">
          <Link to="/encuestas/nueva" className="btn-nueva-encuesta">
            <FaListAlt /> Nueva encuesta
          </Link>
        </div>
      </div>

      <div className="filters-section-encuestas">
        <div className="filters-row-encuestas">
          <div className="filter-group-encuestas">
            <label>Código egresado</label>
            <input
              type="text"
              value={filtros.codigo_egresado}
              onChange={(e) => handleFiltroChange('codigo_egresado', e.target.value)}
              placeholder="Buscar por código..."
              className="filter-input-encuestas"
            />
          </div>
          <div className="filter-group-encuestas">
            <label>Trabaja</label>
            <select
              value={filtros.trabaja}
              onChange={(e) => handleFiltroChange('trabaja', e.target.value)}
              className="filter-select-encuestas"
            >
              <option value="todos">Trabaja (todos)</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="filter-group-encuestas">
            <label>Tiene Negocio</label>
            <select
              value={filtros.tiene_negocio}
              onChange={(e) => handleFiltroChange('tiene_negocio', e.target.value)}
              className="filter-select-encuestas"
            >
              <option value="todos">Tiene Negocio (todos)</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="filter-group-encuestas">
            <label>Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              className="filter-select-encuestas"
            >
              <option value="todos">Estado (todos)</option>
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </select>
          </div>
          <div className="filter-actions-encuestas">
            <button onClick={handleFiltrar} className="btn-filtrar">
              <FaListAlt /> Filtrar
            </button>
            <button onClick={limpiarFiltros} className="btn-limpiar">
              Limpiar
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
                  <th>CÓDIGO EGRESADO</th>
                  <th>FECHA</th>
                  <th>TRABAJA</th>
                  <th>TIENE NEGOCIO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {encuestas.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No hay encuestas disponibles
                    </td>
                  </tr>
                ) : (
                  encuestas.map((encuesta) => {
                    // Obtener valores según la estructura real del backend
                    const trabaja = encuesta.trabaja_actualmente !== undefined 
                      ? (encuesta.trabaja_actualmente ? 'Sí' : 'No')
                      : 'No';
                    
                    const tieneNegocio = encuesta.tiene_negocio !== undefined 
                      ? (encuesta.tiene_negocio ? 'Sí' : 'No')
                      : 'No';
                    
                    // El backend usa fecha_aplicacion, no fecha_encuesta
                    const fechaFormateada = encuesta.fecha_aplicacion 
                      ? new Date(encuesta.fecha_aplicacion).toISOString().split('T')[0]
                      : (encuesta.fecha_encuesta 
                        ? new Date(encuesta.fecha_encuesta).toISOString().split('T')[0]
                        : '-');
                    
                    return (
                      <tr key={encuesta.id_encuesta || encuesta.id}>
                        <td>{encuesta.id_encuesta || encuesta.id}</td>
                        <td>{encuesta.codigo_egresado || encuesta.codigo || '-'}</td>
                        <td>{fechaFormateada}</td>
                        <td>{trabaja}</td>
                        <td>{tieneNegocio}</td>
                        <td>
                          <div className="action-buttons-encuestas">
                            <button
                              onClick={() => handleViewDetails(encuesta)}
                              className="btn-icon-encuestas btn-view-encuestas"
                              title="Ver detalles"
                            >
                              <FaEye />
                            </button>
                            <Link
                              to={`/encuestas/editar/${encuesta.id_encuesta || encuesta.id}`}
                              className="btn-icon-encuestas btn-edit-encuestas"
                              title="Editar"
                            >
                              <FaEdit />
                            </Link>
                            {(encuesta.estado === 'A' || !encuesta.estado) ? (
                              <button
                                onClick={() => handleDeleteEncuesta(encuesta.id_encuesta || encuesta.id)}
                                className="btn-icon-encuestas btn-delete-encuestas"
                                title="Eliminar"
                              >
                                <FaTrashAlt />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRestoreEncuesta(encuesta.id_encuesta || encuesta.id)}
                                className="btn-icon-encuestas btn-restore-encuestas"
                                title="Restaurar"
                              >
                                <FaUndo />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {(pagination.total_pages > 1 || pagination.total > 0) && (
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
              {pagination.total_pages > 1 && (
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
              )}
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
    </div>
  );
};

export default EncuestaEgresados;

