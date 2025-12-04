import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import crudAxios from '../../shared/crudAxios';
import { 
  FaArrowLeft, 
  FaUser, 
  FaGraduationCap, 
  FaEnvelope, 
  FaBuilding, 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaCoins, 
  FaPlus,
  FaDownload,
  FaCertificate
} from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import { useCatalogos } from '../../shared/useApi.jsx';
import CertificacionModal from '../certificaciones/CertificacionModal';
import '../../shared/unified-tables.css';

function HistorialLaboral() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { catalogos } = useCatalogos();
  const [detalles, setDetalles] = useState([]);
  const [certificaciones, setCertificaciones] = useState([]);
  const [egresado, setEgresado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showCertForm, setShowCertForm] = useState(false);
  const [certToEdit, setCertToEdit] = useState(null);

  const fetchHistorial = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener datos del egresado
      const egresadoRes = await crudAxios.get(`/egresados/${codigo}`);
      setEgresado(egresadoRes.data);

      // Obtener historial laboral
      const detallesRes = await crudAxios.get(`/detalle-egresados?codigo_egresado=${codigo}`);
      setDetalles(Array.isArray(detallesRes.data.detalles) ? detallesRes.data.detalles : []);

      // Obtener certificaciones
      const certRes = await crudAxios.get(`/certificaciones?codigo_egresado=${codigo}`);
      setCertificaciones(Array.isArray(certRes.data.certificaciones) ? certRes.data.certificaciones : []);

    } catch (error) {
      console.error('Error al cargar historial:', error);
      setMessage('Error al cargar el historial del egresado');
      setDetalles([]);
      setCertificaciones([]);
      setEgresado(null);
    } finally {
      setLoading(false);
    }
  }, [codigo]);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  const handleDeleteCert = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta certificación?')) return;
    try {
      await crudAxios.delete(`/certificaciones/${id}`);
      setMessage('Certificación eliminada correctamente');
      // Recargar certificaciones
      const certRes = await crudAxios.get(`/certificaciones?codigo_egresado=${codigo}`);
      setCertificaciones(Array.isArray(certRes.data.certificaciones) ? certRes.data.certificaciones : []);
    } catch (error) {
      console.error('Error al eliminar certificación:', error);
      setMessage('Error al eliminar la certificación');
    }
  };

  const handleDownloadFile = (id) => {
    window.open(`http://localhost:5001/certificaciones/${id}/archivo`, '_blank');
  };

  const handleAddCert = () => {
    setCertToEdit(null);
    setShowCertForm(true);
  };

  const handleEditCert = (cert) => {
    setCertToEdit(cert);
    setShowCertForm(true);
  };

  const handleCertSuccess = () => {
    setShowCertForm(false);
    setCertToEdit(null);
    // Recargar certificaciones
    const fetchCerts = async () => {
      try {
        const certRes = await crudAxios.get(`/certificaciones?codigo_egresado=${codigo}`);
        setCertificaciones(Array.isArray(certRes.data.certificaciones) ? certRes.data.certificaciones : []);
      } catch (error) {
        console.error('Error al recargar certificaciones:', error);
      }
    };
    fetchCerts();
  };

  const handleAddNuevoTrabajo = () => {
    // Navegar a agregar detalle pero con el código del egresado pre-seleccionado
    navigate(`/agregar-detalle?codigo_egresado=${codigo}`);
  };

  const handleEditTrabajo = (idDetalle) => {
    navigate(`/editar-detalle/${idDetalle}`);
  };

  const handleDeleteTrabajo = async (idDetalle) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro de experiencia laboral?')) return;
    try {
      await crudAxios.delete(`/detalle-egresados/${idDetalle}`);
      setMessage('Registro de experiencia laboral eliminado correctamente');
      fetchHistorial(); // Recargar historial
    } catch (error) {
      console.error('Error al eliminar experiencia laboral:', error);
      setMessage('Error al eliminar el registro de experiencia laboral');
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <>
        <TopHeader />
        <div className="unified-content">
          <div className="loading-state">
            <p>Cargando historial laboral...</p>
          </div>
        </div>
      </>
    );
  }

  if (!egresado) {
    return (
      <>
        <TopHeader />
        <div className="unified-content">
          <div className="empty-state">
            <p>No se pudo cargar la información del egresado.</p>
            <Link to="/detalles" className="btn-volver">
              <FaArrowLeft /> Volver a Detalles
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopHeader />
      <div className="unified-content">
        {message && <div className={`message ${message.includes('exitosamente') || message.includes('correctamente') ? 'success' : 'error'}`}>{message}</div>}

        {/* Header con botón de regreso */}
        <div className="unified-list">
          <div className="unified-header">
            <div>
              <Link to="/detalles" className="btn-volver" style={{ marginBottom: '16px', display: 'inline-flex' }}>
                <FaArrowLeft /> Volver a Detalles
              </Link>
              <h2>
                <FaUser />
                Historial Laboral de Egresado
              </h2>
            </div>
          </div>

          {/* Información del egresado */}
          <div className="egresado-info-card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              <FaUser />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '700' }}>
                {egresado.codigo} - {egresado.nombre} {egresado.apellidos}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaGraduationCap />
                  <span>Carrera: {
                    egresado.carrera_id 
                      ? (catalogos?.carrerasProfesionales?.find(c => c.id_carrera === egresado.carrera_id)?.nombre_carrera || 'No especificado')
                      : 'No especificado'
                  }</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaEnvelope />
                  <span>Correo: {egresado.correo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Certificaciones */}
          <div style={{ marginBottom: '32px' }}>
            <div className="unified-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaCertificate />
                Certificaciones / Capacitaciones
              </h3>
              <button onClick={handleAddCert} className="btn-agregar">
                <FaPlus /> Agregar Certificación
              </button>
            </div>

            {certificaciones.length === 0 ? (
              <div className="empty-state">
                <p>No hay certificaciones registradas.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="unified-table certificaciones-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Institución</th>
                      <th>Fecha Obtención</th>
                      <th>Archivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificaciones.map((cert, index) => (
                      <tr key={cert.id || `cert-${index}`}>
                        <td>{cert.nombre}</td>
                        <td>{cert.institucion}</td>
                        <td>{cert.fecha_obtencion ? new Date(cert.fecha_obtencion).toLocaleDateString('es-ES') : 'N/A'}</td>
                        <td style={{ textAlign: 'center' }}>
                          {cert.archivo ? (
                            <button 
                              onClick={() => handleDownloadFile(cert.id_certificacion)}
                              className="btn"
                              title="Descargar archivo"
                            >
                              <FaDownload />
                            </button>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>Sin archivo</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sección de Historial Laboral */}
          <div>
            <div className="unified-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaBriefcase />
                Experiencia Laboral
              </h3>
              <button onClick={handleAddNuevoTrabajo} className="btn-agregar">
                <FaPlus /> Agregar Nuevo Trabajo
              </button>
            </div>

            {detalles.length === 0 ? (
              <div className="empty-state">
                <p>No se encontraron registros de historial laboral para este egresado.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="unified-table">
                  <thead>
                    <tr>
                      <th>Empresa</th>
                      <th>Cargo</th>
                      <th>País</th>
                      <th>Ciudad</th>
                      <th>Fecha de Incorporación</th>
                      <th>Fecha de Salida</th>
                      <th>Área</th>
                      <th>Sueldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((detalle, index) => (
                      <tr key={detalle.id_detalle || detalle.id || `detalle-${index}`}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaBuilding style={{ color: '#64748b' }} />
                            {detalle.empresa_actual || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaBriefcase style={{ color: '#64748b' }} />
                            {detalle.cargo_actual || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaMapMarkerAlt style={{ color: '#64748b' }} />
                            {detalle.pais_residencia || 'N/A'}
                          </div>
                        </td>
                        <td>{detalle.ciudad_residencia || 'N/A'}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCalendarAlt style={{ color: '#64748b' }} />
                            {detalle.fecha_incorporacion ? new Date(detalle.fecha_incorporacion).toLocaleDateString('es-ES') : 'N/A'}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCalendarAlt style={{ color: '#64748b' }} />
                            {detalle.fecha_egreso 
                              ? new Date(detalle.fecha_egreso).toLocaleDateString('es-ES') 
                              : <span style={{ fontStyle: 'italic', color: '#64748b' }}>Hasta la fecha</span>}
                          </div>
                        </td>
                        <td>{detalle.area_trabajo || 'N/A'}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCoins style={{ color: '#64748b' }} />
                            {detalle.sueldo_actual ? `S/ ${detalle.sueldo_actual}` : 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal para agregar/editar certificación */}
        {showCertForm && (
          <CertificacionModal
            codigoEgresado={egresado.codigo}
            certificacion={certToEdit}
            onSuccess={() => {
              setShowCertForm(false);
              setCertToEdit(null);
              fetchHistorial();
              setMessage('Certificación guardada correctamente');
            }}
            onCancel={() => {
              setShowCertForm(false);
              setCertToEdit(null);
            }}
          />
        )}
      </div>
    </>
  );
}

export default HistorialLaboral;