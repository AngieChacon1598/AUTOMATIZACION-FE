import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaUndo, FaPlus, FaInfoCircle, FaTimes, FaEye, FaFileDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import StatusIndicator from '../../components/StatusIndicator';
import { useDetallesEgresados, useEgresados, useCatalogos } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';
import './DetalleEgresadoList.css';

function DetalleEgresadoList() {
  const {
    detalles,
    loading,
    error,
    pagination,
    fetchDetallesEgresados,
    deleteDetalleEgresado,
    restoreDetalleEgresado,
    changePage,
    changePageSize
  } = useDetallesEgresados();

  const { egresados, fetchEgresados } = useEgresados();
  const { catalogos } = useCatalogos();
  
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('A');
  const [codigoFilter, setCodigoFilter] = useState('');
  const [carreraFilter, setCarreraFilter] = useState('');
  const [todosDetalles, setTodosDetalles] = useState([]); // Estado para almacenar todos los detalles
  const [currentPage, setCurrentPage] = useState(1); // Estado local para la página actual
  const [itemsPerPage, setItemsPerPage] = useState(10); // Estado local para items por página
  const [showFormatModal, setShowFormatModal] = useState(false); // Modal para seleccionar formato

  useEffect(() => {
    fetchEgresados({ estado: 'A', per_page: 1000 });
  }, []);

  // Cargar TODOS los detalles activos para poder compararlos y obtener el último trabajo de cada egresado
  useEffect(() => {
    const loadAllDetalles = async () => {
      try {
        const filters = {
          estado: filter,
          ...(codigoFilter && { codigo_egresado: codigoFilter }),
          page: 1,
          per_page: 10000 // Cargar muchos registros para tener todos disponibles
        };
        console.log('🔄 Cargando detalles con filtros:', filters);
        await fetchDetallesEgresados(filters);
      } catch (error) {
        console.error('Error al cargar detalles:', error);
      }
    };
    
    loadAllDetalles();
  }, [filter, codigoFilter]);

  // Actualizar todosDetalles cuando detalles cambie - esto sincroniza el estado
  useEffect(() => {
    if (Array.isArray(detalles)) {
      // Siempre actualizar para reflejar el estado actual
      setTodosDetalles(detalles);
      console.log('📋 Actualizando todosDetalles:', detalles.length, 'registros');
      if (detalles.length > 0) {
        // Mostrar algunos ejemplos para debug
        const ejemploLucia = detalles.find(d => d.codigo_egresado === 'EG005');
        if (ejemploLucia) {
          console.log('✅ Encontrado registro de Lucía (EG005):', {
            id: ejemploLucia.id_detalle,
            empresa: ejemploLucia.empresa_actual,
            fecha_incorporacion: ejemploLucia.fecha_incorporacion
          });
        } else {
          console.log('⚠️ No se encontró registro de Lucía (EG005) en los detalles cargados');
          console.log('📝 Códigos de egresados presentes:', [...new Set(detalles.map(d => d.codigo_egresado))]);
        }
      }
    }
  }, [detalles]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este detalle?\n\nEl detalle se marcará como inactivo y no aparecerá en la lista de activos, pero podrás restaurarlo desde la vista de inactivos.')) return;
    
    console.log(`🗑️ Iniciando eliminación del detalle ID: ${id}`);
    
    try {
      const result = await deleteDetalleEgresado(id);
      console.log('📊 Resultado de la eliminación:', result);
      
      if (result.success) {
        setMessage('✅ Detalle eliminado correctamente! Se ha movido a la lista de inactivos.');
        // Recargar todos los detalles después de eliminar
        const filters = {
          estado: filter,
          ...(codigoFilter && { codigo_egresado: codigoFilter }),
          page: 1,
          per_page: 10000
        };
        await fetchDetallesEgresados(filters);
      } else {
        console.error('❌ Error en la eliminación:', result.error);
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error inesperado al eliminar detalle:', error);
      setMessage('❌ Error inesperado al eliminar el detalle. Por favor, intenta nuevamente.');
    }
  };

  const handleRestore = async (id) => {
    try {
      const result = await restoreDetalleEgresado(id);
      if (result.success) {
        setMessage('Detalle restaurado correctamente!');
        // Recargar todos los detalles después de restaurar
        const filters = {
          estado: filter,
          ...(codigoFilter && { codigo_egresado: codigoFilter }),
          page: 1,
          per_page: 10000
        };
        await fetchDetallesEgresados(filters);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al restaurar detalle:', error);
      setMessage('Error al restaurar el detalle');
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Resetear a la primera página al cambiar filtro
  };

  const limpiarFiltros = () => {
    setCodigoFilter('');
    setCarreraFilter('');
    setCurrentPage(1);
  };

  const getEgresadoNombre = (codigo) => {
    if (!codigo) return 'No especificado';
    const egresado = egresados.find(e => e.codigo === codigo);
    return egresado ? `${egresado.nombre} ${egresado.apellidos}` : codigo;
  };

  const getEgresadoCarrera = (codigo) => {
    if (!codigo) return 'No especificado';
    const egresado = egresados.find(e => e.codigo === codigo);
    if (!egresado || !egresado.carrera_id) return 'No especificado';
    
    const carrera = catalogos?.carrerasProfesionales?.find(c => c.id_carrera === egresado.carrera_id);
    return carrera?.nombre_carrera || 'No especificado';
  };

  // Función para abrir el modal de selección de formato
  const openFormatModal = () => {
    if (ultimosTrabajosFiltrados.length === 0) {
      setMessage('No hay datos para exportar');
      return;
    }
    setShowFormatModal(true);
  };

  // Función para cerrar el modal
  const closeFormatModal = () => {
    setShowFormatModal(false);
  };

  // Función para descargar el reporte en formato Excel (CSV mejorado)
  const downloadExcel = () => {
    try {
      closeFormatModal();
      
      // Preparar los datos para el CSV
      const csvHeaders = [
        'ID',
        'Código Egresado',
        'Nombre Egresado',
        'Carrera',
        'Empresa Actual',
        'Cargo Actual',
        'Área de Trabajo',
        'Sueldo Actual',
        'País de Residencia',
        'Ciudad de Residencia',
        'Fecha de Incorporación',
        'Fecha de Egreso',
        'Estado'
      ];

      // Convertir los datos a filas CSV
      const csvRows = ultimosTrabajosFiltrados.map(detalle => {
        const egresado = egresados.find(e => e.codigo === detalle.codigo_egresado);
        const nombreEgresado = detalle.egresado_nombre || getEgresadoNombre(detalle.codigo_egresado);
        const carrera = getEgresadoCarrera(detalle.codigo_egresado);
        
        return [
          detalle.id_detalle || '',
          detalle.codigo_egresado || '',
          nombreEgresado,
          carrera,
          detalle.empresa_actual || 'No especificada',
          detalle.cargo_actual || 'No especificado',
          detalle.area_trabajo || 'No especificado',
          detalle.sueldo_actual ? `S/ ${parseFloat(detalle.sueldo_actual).toFixed(2)}` : 'No especificado',
          detalle.pais_residencia || 'No especificado',
          detalle.ciudad_residencia || 'No especificado',
          detalle.fecha_incorporacion ? new Date(detalle.fecha_incorporacion).toLocaleDateString('es-PE') : 'No especificada',
          detalle.fecha_egreso ? new Date(detalle.fecha_egreso).toLocaleDateString('es-PE') : 'No especificada',
          detalle.estado === 'A' ? 'Activo' : 'Inactivo'
        ];
      });

      // Función para escapar valores CSV (manejar comas y comillas)
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };

      // Crear el contenido CSV
      const csvContent = [
        csvHeaders.map(escapeCSV).join(','),
        ...csvRows.map(row => row.map(escapeCSV).join(','))
      ].join('\n');

      // Crear el BOM para UTF-8 (para Excel)
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      
      // Crear el enlace de descarga
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      // Nombre del archivo con fecha actual
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Reporte_Detalles_Egresados_${fecha}.xls`;
      link.setAttribute('download', nombreArchivo);
      
      // Descargar el archivo
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage('Reporte Excel descargado exitosamente');
    } catch (error) {
      console.error('Error al generar el reporte Excel:', error);
      setMessage('Error al generar el reporte Excel');
    }
  };

  // Función para descargar el reporte en formato PDF
  const downloadPDF = () => {
    try {
      closeFormatModal();
      
      // Crear una ventana nueva para el PDF
      const printWindow = window.open('', '_blank');
      
      // Preparar los datos
      const reportData = ultimosTrabajosFiltrados.map(detalle => {
        const nombreEgresado = detalle.egresado_nombre || getEgresadoNombre(detalle.codigo_egresado);
        const carrera = getEgresadoCarrera(detalle.codigo_egresado);
        
        return {
          id: detalle.id_detalle || 'N/A',
          codigo: detalle.codigo_egresado || 'N/A',
          nombre: nombreEgresado,
          carrera: carrera,
          empresa: detalle.empresa_actual || 'No especificada',
          cargo: detalle.cargo_actual || 'No especificado',
          area: detalle.area_trabajo || 'No especificado',
          sueldo: detalle.sueldo_actual ? `S/ ${parseFloat(detalle.sueldo_actual).toFixed(2)}` : 'No especificado',
          pais: detalle.pais_residencia || 'No especificado',
          ciudad: detalle.ciudad_residencia || 'No especificado',
          fechaInc: detalle.fecha_incorporacion ? new Date(detalle.fecha_incorporacion).toLocaleDateString('es-PE') : 'No especificada',
          fechaEgr: detalle.fecha_egreso ? new Date(detalle.fecha_egreso).toLocaleDateString('es-PE') : 'No especificada',
          estado: detalle.estado === 'A' ? 'Activo' : 'Inactivo'
        };
      });

      const fecha = new Date().toLocaleDateString('es-PE');
      const totalRegistros = reportData.length;
      const filtroEstado = filter === 'A' ? 'Activos' : 'Inactivos';

      // HTML para el PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Reporte de Detalles de Egresados</title>
          <style>
            @media print {
              @page {
                margin: 1cm;
                size: A4 landscape;
              }
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 10px;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #1976d2;
              padding-bottom: 10px;
            }
            .header h1 {
              color: #1976d2;
              margin: 0;
              font-size: 18px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th {
              background-color: #1976d2;
              color: white;
              padding: 8px 4px;
              text-align: left;
              font-size: 9px;
              border: 1px solid #ddd;
            }
            td {
              padding: 6px 4px;
              border: 1px solid #ddd;
              font-size: 8px;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>REPORTE DE DETALLES DE EGRESADOS</h1>
            <p>Fecha de generación: ${fecha}</p>
            <p>Total de registros: ${totalRegistros} (${filtroEstado})</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Carrera</th>
                <th>Empresa</th>
                <th>Cargo</th>
                <th>Área</th>
                <th>Sueldo</th>
                <th>País</th>
                <th>Ciudad</th>
                <th>F. Incorporación</th>
                <th>F. Egreso</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map(row => `
                <tr>
                  <td>${row.id}</td>
                  <td>${row.codigo}</td>
                  <td>${row.nombre}</td>
                  <td>${row.carrera}</td>
                  <td>${row.empresa}</td>
                  <td>${row.cargo}</td>
                  <td>${row.area}</td>
                  <td>${row.sueldo}</td>
                  <td>${row.pais}</td>
                  <td>${row.ciudad}</td>
                  <td>${row.fechaInc}</td>
                  <td>${row.fechaEgr}</td>
                  <td>${row.estado}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Sistema de Seguimiento de Egresados - Generado el ${fecha}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Esperar a que se cargue el contenido y luego imprimir
      setTimeout(() => {
        printWindow.print();
        setMessage('Reporte PDF generado exitosamente');
      }, 250);
      
    } catch (error) {
      console.error('Error al generar el reporte PDF:', error);
      setMessage('Error al generar el reporte PDF');
    }
  };

  // Función para obtener solo el último trabajo de cada egresado
  const getUltimosTrabajos = (detallesArray) => {
    if (!Array.isArray(detallesArray) || detallesArray.length === 0) {
      console.log('⚠️ getUltimosTrabajos: Array vacío o inválido');
      return [];
    }

    console.log('🔍 getUltimosTrabajos: Procesando', detallesArray.length, 'registros');
    
    // Agrupar por codigo_egresado
    const trabajosPorEgresado = {};
    
    detallesArray.forEach(detalle => {
      const codigo = detalle.codigo_egresado;
      
      if (!codigo) {
        console.warn('⚠️ Detalle sin codigo_egresado:', detalle);
        return; // Saltar registros sin código
      }
      
      if (!trabajosPorEgresado[codigo]) {
        trabajosPorEgresado[codigo] = detalle;
      } else {
        // Comparar para determinar cuál es más reciente
        const actual = trabajosPorEgresado[codigo];
        
        // Función helper para obtener fecha de incorporación como Date
        const getFechaIncorporacion = (d) => {
          if (d.fecha_incorporacion) {
            const fecha = new Date(d.fecha_incorporacion);
            return isNaN(fecha.getTime()) ? null : fecha;
          }
          return null;
        };
        
        const fechaActual = getFechaIncorporacion(actual);
        const fechaNueva = getFechaIncorporacion(detalle);
        
        // Priorizar por fecha de incorporación (más reciente = más nuevo)
        if (fechaNueva && fechaActual) {
          if (fechaNueva > fechaActual) {
            trabajosPorEgresado[codigo] = detalle;
          } else if (fechaNueva.getTime() === fechaActual.getTime()) {
            // Si las fechas son iguales, usar id_detalle como desempate
            if (detalle.id_detalle > actual.id_detalle) {
              trabajosPorEgresado[codigo] = detalle;
            }
          }
        } else if (fechaNueva && !fechaActual) {
          // Si el nuevo tiene fecha y el actual no, usar el nuevo
          trabajosPorEgresado[codigo] = detalle;
        } else if (!fechaNueva && fechaActual) {
          // Si el actual tiene fecha y el nuevo no, mantener el actual
          // No hacer nada
        } else {
          // Ninguno tiene fecha, usar id_detalle como criterio
          if (detalle.id_detalle > actual.id_detalle) {
            trabajosPorEgresado[codigo] = detalle;
          }
        }
      }
    });

    const resultado = Object.values(trabajosPorEgresado);
    console.log('✅ getUltimosTrabajos: Resultado final', resultado.length, 'egresados únicos');
    
    // Convertir el objeto a array y ordenar por fecha de incorporación descendente
    return resultado.sort((a, b) => {
      const fechaA = a.fecha_incorporacion ? new Date(a.fecha_incorporacion) : null;
      const fechaB = b.fecha_incorporacion ? new Date(b.fecha_incorporacion) : null;
      
      if (fechaB && fechaA) {
        if (fechaB > fechaA) return 1;
        if (fechaB < fechaA) return -1;
        // Si las fechas son iguales, usar id_detalle
        return b.id_detalle - a.id_detalle;
      } else if (fechaB && !fechaA) {
        return 1;
      } else if (!fechaB && fechaA) {
        return -1;
      } else {
        // Ninguno tiene fecha, ordenar por id_detalle
        return b.id_detalle - a.id_detalle;
      }
    });
  };

  // Obtener solo los últimos trabajos de todos los detalles cargados
  const ultimosTrabajosSinFiltro = getUltimosTrabajos(todosDetalles);
  
  // Aplicar filtros adicionales (carrera)
  const ultimosTrabajosFiltrados = ultimosTrabajosSinFiltro.filter(detalle => {
    // Si hay filtro de carrera, filtrar por ella
    if (carreraFilter) {
      const egresado = egresados.find(e => e.codigo === detalle.codigo_egresado);
      if (!egresado || egresado.carrera_id !== parseInt(carreraFilter)) {
        return false;
      }
    }
    return true;
  });
  
  // Calcular paginación del lado del cliente
  const totalItems = ultimosTrabajosFiltrados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const ultimosTrabajos = ultimosTrabajosFiltrados.slice(startIndex, endIndex);
  
  // Resetear a la página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, codigoFilter, carreraFilter]);
  
  console.log('📊 Estado actual:', {
    todosDetalles: todosDetalles.length,
    ultimosTrabajosFiltrados: ultimosTrabajosFiltrados.length,
    ultimosTrabajosMostrados: ultimosTrabajos.length,
    currentPage,
    itemsPerPage,
    totalPages,
    filter,
    codigoFilter,
    carreraFilter
  });

  return (
    <>
      <TopHeader />
      <div className="unified-content">
        {message && (
          <div className={`message ${message.includes('exitosamente') || message.includes('correctamente') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {error && (!Array.isArray(detalles) || detalles.length === 0) && (
          <div className="message error">
            Error: {error}
          </div>
        )}

        <div className="unified-list">
          {/* Header unificado */}
          <div className="unified-header">
            <h2>
              <FaInfoCircle />
              Detalles de Egresados
            </h2>
            <div className="header-actions">
              <div className="filter-buttons">
                <button 
                  onClick={() => handleFilterChange('A')} 
                  className={`btn-activos ${filter === 'A' ? 'active' : ''}`}
                >
                  Mostrar Activos
                </button>
                <button 
                  onClick={() => handleFilterChange('I')} 
                  className={`btn-inactivos ${filter === 'I' ? 'active' : ''}`}
                >
                  Mostrar Inactivos
                </button>
              </div>
              <button
                onClick={openFormatModal}
                className="btn-agregar"
                style={{ marginRight: '10px', backgroundColor: '#059669' }}
                title="Descargar reporte"
              >
                <FaFileDownload /> Descargar Reporte
              </button>
              <Link to="/agregar-detalle" className="btn-agregar">
                <FaPlus /> Agregar Detalle
              </Link>
            </div>
          </div>

          {/* Filtros unificados */}
          <div className="unified-filters">
            <div className="filters-row">
              <input
                type="text"
                placeholder="Buscar por código de egresado..."
                value={codigoFilter}
                onChange={(e) => setCodigoFilter(e.target.value)}
              />
              <select
                value={carreraFilter}
                onChange={(e) => {
                  setCarreraFilter(e.target.value);
                  changePage(1);
                }}
                style={{ minWidth: '200px' }}
              >
                <option value="">Todas las carreras</option>
                {catalogos?.carrerasProfesionales?.map((carrera) => (
                  <option key={carrera.id_carrera} value={carrera.id_carrera}>
                    {carrera.nombre_carrera}
                  </option>
                ))}
              </select>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const newPageSize = Number(e.target.value);
                  setItemsPerPage(newPageSize);
                  setCurrentPage(1); // Resetear a la primera página al cambiar el tamaño
                }}
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={15}>15 por página</option>
                <option value={20}>20 por página</option>
                <option value={25}>25 por página</option>
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
              <p>Cargando detalles...</p>
            </div>
          ) : (Array.isArray(ultimosTrabajos) && ultimosTrabajos.length === 0) ? (
            <div className="empty-state">
              <p>No se encontraron detalles {filter === 'A' ? 'activos' : 'inactivos'}.</p>
              {filter === 'I' && (
                <button 
                  onClick={() => handleFilterChange('A')} 
                  className="btn-volver"
                >
                  Ver Detalles Activos
                </button>
              )}
            </div>
          ) : (
            <>
              <table className="unified-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th className="col-egresado">Egresado</th>
                    <th>Empresa Actual</th>
                    <th>Cargo</th>
                    <th>Ciudad</th>
                    <th>Salario</th>
                    <th>Área Trabajo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimosTrabajos.map((detalle) => (
                    <tr key={detalle.id_detalle}>
                      <td>{detalle.id_detalle}</td>
                      <td className="col-egresado">
                        {detalle.egresado_nombre || getEgresadoNombre(detalle.codigo_egresado)}
                        <br />
                        <small style={{ color: '#666' }}>{detalle.codigo_egresado}</small>
                      </td>
                      <td>{detalle.empresa_actual || 'No especificada'}</td>
                      <td>{detalle.cargo_actual || 'No especificado'}</td>
                      <td>{detalle.ciudad_residencia || 'No especificado'}</td>
                      <td>{detalle.sueldo_actual ? `S/ ${parseFloat(detalle.sueldo_actual).toFixed(2)}` : 'No especificado'}</td>
                      <td>{detalle.area_trabajo || 'No especificado'}</td>
                      <td>
                        <div className="acciones">
                          <Link
                            to={`/historial/${detalle.codigo_egresado}`}
                            className="btn historial"
                            title="Ver historial laboral"
                          >
                            <FaEye />
                          </Link>
                          {detalle.estado === 'I' ? (
                            <button
                              className="btn restore"
                              onClick={() => handleRestore(detalle.id_detalle)}
                              title="Restaurar detalle"
                            >
                              <FaUndo />
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn delete"
                                onClick={() => handleDelete(detalle.id_detalle)}
                                title="Eliminar detalle"
                              >
                                <FaTrashAlt />
                              </button>
                              <Link
                                to={`/editar-detalle/${detalle.id_detalle}`}
                                className="btn edit"
                                title="Editar detalle"
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
              {ultimosTrabajosFiltrados.length > 0 && (
                <div className="unified-pagination">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                    disabled={currentPage === 1}
                    className="btn-pagination"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`btn-pagination ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                    disabled={currentPage === totalPages}
                    className="btn-pagination"
                  >
                    Siguiente
                  </button>
                  <span className="pagination-info">
                    Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} {totalItems === 1 ? 'egresado' : 'egresados'}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de selección de formato */}
      {showFormatModal && (
        <div className="modal-overlay" onClick={closeFormatModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Seleccionar Formato de Reporte</h3>
              <button className="modal-close" onClick={closeFormatModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>Seleccione el formato en el que desea descargar el reporte:</p>
              <div className="format-options">
                <button 
                  className="format-option pdf" 
                  onClick={downloadPDF}
                >
                  <FaFilePdf />
                  <div>
                    <strong>PDF</strong>
                    <span>Formato de documento portátil</span>
                  </div>
                </button>
                <button 
                  className="format-option excel" 
                  onClick={downloadExcel}
                >
                  <FaFileExcel />
                  <div>
                    <strong>Excel</strong>
                    <span>Formato de hoja de cálculo</span>
                  </div>
                </button>
              </div>
              <div className="modal-info">
                <p><strong>Total de registros:</strong> {ultimosTrabajosFiltrados.length}</p>
                <p><strong>Filtro aplicado:</strong> {filter === 'A' ? 'Activos' : 'Inactivos'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetalleEgresadoList;
