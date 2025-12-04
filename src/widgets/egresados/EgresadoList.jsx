// src/components/EgresadoList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaUndo, FaEye, FaTimes, FaPlus, FaListAlt, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import StatusIndicator from '../../components/StatusIndicator';
import { useEgresados, useCatalogos } from '../../shared/useApi.jsx';
import EgresadoDetailModal from './EgresadoDetailModal';
import '../../shared/unified-tables.css';

const EgresadoList = ({
  filter,
  setFilter,
  message,
  setMessage,
}) => {
  const { 
    egresados, 
    loading, 
    error, 
    pagination, 
    fetchEgresados, 
    deleteEgresado, 
    restoreEgresado,
    changePage,
    changePageSize
  } = useEgresados();
  
  const { catalogos } = useCatalogos();
  
  const [filtros, setFiltros] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    carrera_id: ''
  });

  // Estado para mantener los totales de cada estado
  const [totalActivos, setTotalActivos] = useState(0);
  const [totalInactivos, setTotalInactivos] = useState(0);

  // Estado para ocultar el error manualmente
  const [errorDismissed, setErrorDismissed] = useState(false);

  // Estado para el modal de detalles
  const [selectedEgresado, setSelectedEgresado] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Función para obtener los totales de activos e inactivos
  const fetchTotales = async () => {
    try {
      // Hacer las llamadas directamente al servicio para obtener solo los totales
      const { egresadosService } = await import('../../shared/api/apiService');
      
      const activosResult = await egresadosService.getEgresados({ estado: 'A', per_page: 1 });
      const inactivosResult = await egresadosService.getEgresados({ estado: 'I', per_page: 1 });
      
      if (activosResult.success) {
        setTotalActivos(activosResult.data.total || 0);
      }
      if (inactivosResult.success) {
        setTotalInactivos(inactivosResult.data.total || 0);
      }
    } catch (err) {
      console.error('Error al obtener totales:', err);
    }
  };

  useEffect(() => {
    console.log('🔄 EgresadoList: useEffect ejecutándose');
    console.log('🔄 Filter actual:', filter);
    console.log('🔄 Filtros actuales:', filtros);
    console.log('🔄 Egresados actuales:', egresados);
    console.log('🔄 Loading actual:', loading);
    console.log('🔄 Error actual:', error);
    console.log('🔄 Paginación actual:', pagination);
    
    const filtersToSend = {
      estado: filter,
      ...filtros
    };
    
    console.log('🔄 Filtros que se enviarán al backend:', filtersToSend);
    
    fetchEgresados(filtersToSend);
  }, [filter, filtros, pagination.page, pagination.per_page]);

  // Actualizar totales cuando cambia la paginación del estado actual
  useEffect(() => {
    if (pagination.total !== undefined) {
      if (filter === 'A') {
        setTotalActivos(pagination.total);
      } else {
        setTotalInactivos(pagination.total);
      }
    }
  }, [pagination.total, filter]);

  // Refrescar totales cuando cambia el filtro para asegurar sincronización
  useEffect(() => {
    fetchTotales();
  }, [filter]);

  // Cargar totales al montar el componente
  useEffect(() => {
    fetchTotales();
  }, []);

  // Auto-dismiss del mensaje después de 4 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 4000); // Desaparece después de 4 segundos
      
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  // Reset errorDismissed cuando hay un nuevo error
  useEffect(() => {
    if (error) {
      setErrorDismissed(false);
    }
  }, [error]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      apellidos: '',
      dni: '',
      carrera_id: ''
    });
  };

  // Función para abrir el modal de detalles
  const handleViewDetails = (egresado) => {
    setSelectedEgresado(egresado);
    setShowDetailModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedEgresado(null);
  };

  const handleDeleteEgresado = async (codigo) => {
    console.log('🗑️ Iniciando eliminación del egresado:', codigo);
    
    if (!window.confirm('¿Estás seguro de eliminar este egresado?\n\nEl egresado se marcará como inactivo y no aparecerá en la lista de activos, pero podrás restaurarlo desde la vista de inactivos.')) {
      console.log('❌ Usuario canceló la eliminación');
      return;
    }
    
    console.log('✅ Usuario confirmó la eliminación');
    
    const result = await deleteEgresado(codigo);
    console.log('📊 Resultado de la eliminación:', result);
    
    if (result.success) {
      setMessage('Egresado eliminado correctamente! Se ha movido a la lista de inactivos.');
      console.log('✅ Eliminación exitosa, refrescando lista con filtro:', filter);
      
      // Refrescar la lista para que desaparezca de la vista actual
      fetchEgresados({
        estado: filter,
        ...filtros
      });
      
      // Actualizar totales después de un breve delay para asegurar que el backend procesó el cambio
      setTimeout(() => {
        fetchTotales();
      }, 500);
    } else {
      setMessage('Error al eliminar el egresado: ' + result.error);
      console.error('❌ Error en la eliminación:', result.error);
    }
  };

  const handleRestoreEgresado = async (codigo) => {
    console.log('🔄 Iniciando restauración del egresado:', codigo);
    
    if (!window.confirm('¿Estás seguro de restaurar este egresado?\n\nEl egresado volverá a aparecer en la lista de activos.')) {
      console.log('❌ Usuario canceló la restauración');
      return;
    }
    
    console.log('✅ Usuario confirmó la restauración');
    
    const result = await restoreEgresado(codigo);
    console.log('📊 Resultado de la restauración:', result);
    
    if (result.success) {
      setMessage('Egresado restaurado correctamente! Se ha movido a la lista de activos.');
      console.log('✅ Restauración exitosa, refrescando lista con filtro:', filter);
      
      // Refrescar la lista para que desaparezca de la vista actual
      fetchEgresados({
        estado: filter,
        ...filtros
      });
      
      // Actualizar totales después de un breve delay para asegurar que el backend procesó el cambio
      setTimeout(() => {
        fetchTotales();
      }, 500);
    } else {
      setMessage('Error al restaurar el egresado: ' + result.error);
      console.error('❌ Error en la restauración:', result.error);
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
        {message && (
          <div className={`message ${message.includes('exitosamente') || message.includes('correctamente') ? 'success' : 'error'}`} style={{ position: 'relative', paddingRight: '40px' }}>
            {message}
            <button
              onClick={() => setMessage('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: 'inherit',
                opacity: 0.7,
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              title="Cerrar"
            >
              <FaTimes />
            </button>
          </div>
        )}
        {error && !errorDismissed && (
          <div className="message error" style={{ position: 'relative', paddingRight: '40px' }}>
            {error}
            <button
              onClick={() => setErrorDismissed(true)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: 'inherit',
                opacity: 0.7,
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              title="Cerrar"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <div className="unified-list">
          {/* Header unificado */}
          <div className="unified-header">
            <h2>
              <FaListAlt />
              Lista de Egresados
            </h2>
            <div className="header-actions">
              <div className="filter-buttons">
                <button 
                  onClick={() => setFilter('A')} 
                  className={`btn-activos ${filter === 'A' ? 'active' : ''}`}
                  title="Mostrar egresados activos"
                >
                  <FaUserCheck />
                  Activos ({totalActivos})
                </button>
                <button 
                  onClick={() => setFilter('I')} 
                  className={`btn-inactivos ${filter === 'I' ? 'active' : ''}`}
                  title="Mostrar egresados inactivos (eliminados)"
                >
                  <FaUserTimes />
                  Inactivos ({totalInactivos})
                </button>
              </div>
              <Link to="/egresados/nueva" className="btn-agregar">
                <FaPlus /> Agregar Egresado
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
                placeholder="Buscar por apellidos..."
                value={filtros.apellidos}
                onChange={(e) => handleFiltroChange('apellidos', e.target.value)}
              />
              <input
                type="text"
                placeholder="Buscar por DNI..."
                value={filtros.dni}
                onChange={(e) => handleFiltroChange('dni', e.target.value)}
              />
              <select
                value={filtros.carrera_id}
                onChange={(e) => handleFiltroChange('carrera_id', e.target.value)}
              >
                <option value="">Todas las carreras</option>
                {catalogos.carrerasProfesionales.map((carrera) => (
                  <option key={carrera.id_carrera} value={carrera.id_carrera}>
                    {carrera.nombre_carrera}
                  </option>
                ))}
              </select>
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
              <p>Cargando egresados...</p>
            </div>
          ) : (Array.isArray(egresados) && egresados.length === 0) ? (
            <div className="empty-state">
              {console.log('📊 Renderizando estado vacío - egresados:', egresados, 'es array:', Array.isArray(egresados), 'longitud:', egresados?.length)}
              {filter === 'A' ? (
                <>
                  <p>No hay egresados activos en el sistema.</p>
                  <p className="empty-hint">Los egresados eliminados aparecerán en la vista de inactivos.</p>
                </>
              ) : (
                <>
                  <p>No hay egresados inactivos (eliminados).</p>
                  <p className="empty-hint">Los egresados eliminados aparecerán aquí y podrás restaurarlos.</p>
                </>
              )}
              <button 
                onClick={() => setFilter(filter === 'A' ? 'I' : 'A')} 
                className="btn-switch-view"
              >
                {filter === 'A' ? 'Ver Egresados Inactivos' : 'Ver Egresados Activos'}
              </button>
            </div>
          ) : (
            <>
              {console.log('📊 Renderizando tabla - egresados:', egresados, 'es array:', Array.isArray(egresados), 'longitud:', egresados?.length)}
              <table className="unified-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>DNI</th>
                    <th>Correo</th>
                    <th>Carrera</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {egresados.map((egresado) => (
                    <tr key={egresado.codigo}>
                      <td>{egresado.codigo}</td>
                      <td>{egresado.nombre}</td>
                      <td>{egresado.apellidos}</td>
                      <td>{egresado.dni}</td>
                      <td>{egresado.correo}</td>
                      <td>
                        {catalogos.carrerasProfesionales.find(c => c.id_carrera === egresado.carrera_id)?.nombre_carrera || '-'}
                      </td>
                      <td>
                        <div className="acciones">
                          <button
                            onClick={() => handleViewDetails(egresado)}
                            className="btn view"
                            title="Ver detalles completos"
                          >
                            <FaEye />
                          </button>
                          {egresado.estado === 'I' ? (
                            <button
                              className="btn restore"
                              onClick={() => handleRestoreEgresado(egresado.codigo)}
                              title="Restaurar egresado"
                            >
                              <FaUndo />
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn delete"
                                onClick={() => handleDeleteEgresado(egresado.codigo)}
                                title="Eliminar egresado"
                              >
                                <FaTrashAlt />
                              </button>
                              <Link
                                to={`/editar/${egresado.codigo}`}
                                className="btn edit"
                                title="Editar egresado"
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

      {/* Modal de detalles del egresado */}
      {showDetailModal && (
        <EgresadoDetailModal
          egresado={selectedEgresado}
          catalogos={catalogos}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default EgresadoList;