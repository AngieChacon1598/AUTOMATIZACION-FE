import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaUndo, FaEye, FaTimes, FaPlus, FaListAlt, FaBuilding } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import StatusIndicator from '../../components/StatusIndicator';
import { useEmpresas } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';
import './EmpresaDetailModal.css';

const EmpresaList = () => {
  const { 
    empresas, 
    loading, 
    error, 
    pagination, 
    fetchEmpresas, 
    deleteEmpresa, 
    restoreEmpresa,
    changePage,
    changePageSize
  } = useEmpresas();
  
  const [filtros, setFiltros] = useState({
    nombre: '',
    ruc: ''
  });
  const [filter, setFilter] = useState('A');
  const [message, setMessage] = useState('');
  
  // Estado para el modal de detalles
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchEmpresas({
      estado: filter,
      ...filtros
    });
  }, [filter, filtros, pagination.page, pagination.per_page]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      ruc: ''
    });
  };

  // Función para abrir el modal de detalles
  const handleViewDetails = (empresa) => {
    setSelectedEmpresa(empresa);
    setShowDetailModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedEmpresa(null);
  };

  const handleDeleteEmpresa = async (idEmpresa) => {
    if (!window.confirm('¿Estás seguro de eliminar esta empresa?')) return;
    
    const result = await deleteEmpresa(idEmpresa);
    if (result.success) {
      setMessage('Empresa eliminada correctamente!');
    } else {
      setMessage('Error al eliminar la empresa: ' + result.error);
    }
  };

  const handleRestoreEmpresa = async (idEmpresa) => {
    const result = await restoreEmpresa(idEmpresa);
    if (result.success) {
      setMessage('Empresa restaurada correctamente!');
    } else {
      setMessage('Error al restaurar la empresa: ' + result.error);
    }
  };

  const handlePageChange = (newPage) => {
    changePage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    changePageSize(newPageSize);
  };

  return (
    <>
      <TopHeader />
      <div className="unified-content">
        {message && <div className={`message ${message.includes('exitosamente') || message.includes('correctamente') ? 'success' : 'error'}`}>{message}</div>}
        {error && <div className="message error">{error}</div>}

        <div className="unified-list">
          {/* Header unificado */}
          <div className="unified-header">
            <h2>
              <FaBuilding />
              Lista de Empresas
            </h2>
            <div className="header-actions">
              <div className="filter-buttons">
                <button onClick={() => setFilter('A')} disabled={filter === 'A'}>
                  Mostrar Activas
                </button>
                <button onClick={() => setFilter('I')} disabled={filter === 'I'}>
                  Mostrar Inactivas
                </button>
              </div>
              <Link to="/empresas/nueva" className="btn-agregar">
                <FaPlus /> Agregar Empresa
              </Link>
            </div>
          </div>

          {/* Filtros unificados */}
          <div className="unified-filters">
            <div className="filters-row">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={filtros.nombre}
                onChange={(e) => handleFiltroChange('nombre', e.target.value)}
              />
              <input
                type="text"
                placeholder="Buscar por RUC..."
                value={filtros.ruc}
                onChange={(e) => handleFiltroChange('ruc', e.target.value)}
              />
              <select
                value={pagination.per_page}
                onChange={e => handlePageSizeChange(Number(e.target.value))}
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={15}>15 por página</option>
                <option value={20}>20 por página</option>
              </select>
              <button
                onClick={limpiarFiltros}
                className="btn"
                title="Limpiar filtros"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Contenido de la tabla */}
          {loading ? (
            <div className="loading-state">
              <p>Cargando empresas...</p>
            </div>
          ) : (Array.isArray(empresas) && empresas.length === 0) ? (
            <div className="empty-state">
              <p>No se encontraron empresas {filter === 'A' ? 'activas' : 'inactivas'}.</p>
              {filter === 'I' && (
                <button 
                  onClick={() => setFilter('A')} 
                  className="btn-volver"
                >
                  Ver Empresas Activas
                </button>
              )}
            </div>
          ) : (
            <>
              <table className="unified-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>RUC</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map((empresa) => (
                    <tr key={empresa.id_empresa}>
                      <td>{empresa.id_empresa}</td>
                      <td>{empresa.nombre}</td>
                      <td>{empresa.ruc}</td>
                      <td>{empresa.direccion || '-'}</td>
                      <td>{empresa.telefono || '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <StatusIndicator status={empresa.estado} />
                      </td>
                      <td>
                        <div className="acciones">
                          <button
                            onClick={() => handleViewDetails(empresa)}
                            className="btn view"
                            title="Ver detalles completos"
                          >
                            <FaEye />
                          </button>
                          {empresa.estado === 'I' ? (
                            <button
                              className="btn restore"
                              onClick={() => handleRestoreEmpresa(empresa.id_empresa)}
                              title="Restaurar empresa"
                            >
                              <FaUndo />
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn delete"
                                onClick={() => handleDeleteEmpresa(empresa.id_empresa)}
                                title="Eliminar empresa"
                              >
                                <FaTrashAlt />
                              </button>
                              <Link
                                to={`/empresas/editar/${empresa.id_empresa}`}
                                className="btn edit"
                                title="Editar empresa"
                              >
                                <FaEdit />
                              </Link>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Paginación unificada */}
              <div className="unified-pagination">
                <button 
                  onClick={() => handlePageChange(pagination.page - 1)} 
                  disabled={pagination.page === 1}
                >
                  Anterior
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={pagination.page === i + 1 ? 'active' : ''}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => handlePageChange(pagination.page + 1)} 
                  disabled={pagination.page === pagination.pages}
                >
                  Siguiente
                </button>
                <div className="pagination-info">
                  Página {pagination.page} de {pagination.pages} ({pagination.total} registros)
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de detalles de la empresa */}
      {showDetailModal && selectedEmpresa && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de la Empresa</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>ID:</label>
                  <span>{selectedEmpresa.id_empresa}</span>
                </div>
                <div className="detail-item">
                  <label>Nombre:</label>
                  <span>{selectedEmpresa.nombre}</span>
                </div>
                <div className="detail-item">
                  <label>RUC:</label>
                  <span>{selectedEmpresa.ruc || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Dirección:</label>
                  <span>{selectedEmpresa.direccion || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Teléfono:</label>
                  <span>{selectedEmpresa.telefono || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Correo:</label>
                  <span>{selectedEmpresa.correo || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Estado:</label>
                  <span>
                    <StatusIndicator status={selectedEmpresa.estado} />
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmpresaList;