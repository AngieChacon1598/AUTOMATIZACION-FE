import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaPlus, FaCertificate, FaListAlt } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import { useCertificaciones } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';

const CertificacionList = () => {
  const { 
    certificaciones, 
    loading, 
    error, 
    fetchCertificaciones 
  } = useCertificaciones();

  const [message, setMessage] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta certificación?')) {
      try {
        // Aquí implementarías la lógica de eliminación cuando esté disponible
        console.log('Eliminar certificación:', id);
        setMessage('Certificación eliminada exitosamente');
        setTimeout(() => setMessage(''), 3000);
        await fetchCertificaciones();
      } catch (error) {
        setMessage('Error al eliminar certificación');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="unified-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando certificaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unified-content">
        <div className="message error">
          <FaCertificate />
          Error al cargar certificaciones: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="unified-content">
      <div className="unified-list">
        <TopHeader 
          title="Gestión de Certificaciones"
          icon={<FaCertificate />}
          subtitle="Administra las certificaciones profesionales"
        />

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="unified-header">
          <h2>
            <FaListAlt />
            Lista de Certificaciones
          </h2>
          <div className="header-actions">
            <Link to="/certificaciones/nueva" className="btn-agregar">
              <FaPlus />
              Nueva Certificación
            </Link>
          </div>
        </div>

        {certificaciones.length === 0 ? (
          <div className="empty-state">
            <FaCertificate />
            <p>No hay certificaciones registradas</p>
            <Link to="/certificaciones/nueva" className="btn-volver">
              <FaPlus />
              Crear Primera Certificación
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="unified-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Egresado</th>
                  <th>Certificación</th>
                  <th>Institución</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {certificaciones.map((certificacion) => (
                  <tr key={certificacion.id_certificacion}>
                    <td>{certificacion.id_certificacion}</td>
                    <td>{certificacion.codigo_egresado}</td>
                    <td>{certificacion.nombre}</td>
                    <td>{certificacion.institucion}</td>
                    <td>{certificacion.fecha_obtencion ? new Date(certificacion.fecha_obtencion).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`badge ${certificacion.estado === 'A' ? 'success' : 'secondary'}`}>
                        {certificacion.estado === 'A' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="acciones">
                        <Link 
                          to={`/certificaciones/editar/${certificacion.id_certificacion}`}
                          className="btn edit"
                          title="Editar certificación"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(certificacion.id_certificacion)}
                          className="btn delete"
                          title="Eliminar certificación"
                        >
                          <FaTrashAlt />
                        </button>
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
  );
};

export default CertificacionList;
