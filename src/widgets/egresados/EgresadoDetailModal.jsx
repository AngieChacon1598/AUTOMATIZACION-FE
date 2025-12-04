import React from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaGraduationCap, FaIdCard, FaHeart, FaChild, FaWheelchair, FaBuilding, FaCertificate } from 'react-icons/fa';
import '../../shared/unified-tables.css';

const EgresadoDetailModal = ({ egresado, catalogos, onClose }) => {
  if (!egresado) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content egresado-detail-modal">
        <div className="modal-header">
          <h2>
            <FaUser />
            Detalles del Egresado
          </h2>
          <button 
            onClick={onClose}
            className="close-btn"
            title="Cerrar"
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="egresado-detail-grid">
            {/* Información Personal */}
            <div className="detail-section">
              <h3>
                <FaUser />
                Información Personal
              </h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label><FaIdCard /> Código:</label>
                  <span>{egresado.codigo}</span>
                </div>
                <div className="detail-item">
                  <label><FaUser /> Nombre:</label>
                  <span>{egresado.nombre}</span>
                </div>
                <div className="detail-item">
                  <label><FaUser /> Apellidos:</label>
                  <span>{egresado.apellidos}</span>
                </div>
                <div className="detail-item">
                  <label><FaIdCard /> DNI:</label>
                  <span>{egresado.dni}</span>
                </div>
                <div className="detail-item">
                  <label><FaCalendarAlt /> Fecha de Nacimiento:</label>
                  <span>{egresado.fecha_nacimiento ? new Date(egresado.fecha_nacimiento).toLocaleDateString() : 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <label>Sexo:</label>
                  <span>{egresado.sexo === 'M' ? 'Masculino' : egresado.sexo === 'F' ? 'Femenino' : 'No especificado'}</span>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="detail-section">
              <h3>
                <FaEnvelope />
                Información de Contacto
              </h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label><FaEnvelope /> Correo Electrónico:</label>
                  <span>{egresado.correo}</span>
                </div>
                <div className="detail-item">
                  <label><FaPhone /> Teléfono:</label>
                  <span>{egresado.telefono || 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <label><FaPhone /> Teléfono de Referencia:</label>
                  <span>{egresado.telefono_referencia || 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <label><FaMapMarkerAlt /> Dirección:</label>
                  <span>{egresado.direccion || 'No especificado'}</span>
                </div>
              </div>
            </div>

            {/* Información Familiar */}
            <div className="detail-section">
              <h3>
                <FaHeart />
                Información Familiar
              </h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Estado Civil:</label>
                  <span>{egresado.estado_civil_id ? (catalogos?.estadosCiviles?.find(e => e.id_estado_civil === egresado.estado_civil_id)?.nombre_estado || `ID: ${egresado.estado_civil_id}`) : 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <label><FaChild /> Cantidad de Hijos:</label>
                  <span>{egresado.cantidad_hijos || 0}</span>
                </div>
                <div className="detail-item">
                  <label>Es Conviviente:</label>
                  <span className={`badge ${egresado.es_conviviente ? 'success' : 'secondary'}`}>
                    {egresado.es_conviviente ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className="detail-item">
                  <label><FaWheelchair /> Tiene Discapacidad:</label>
                  <span className={`badge ${egresado.tiene_discapacidad ? 'warning' : 'success'}`}>
                    {egresado.tiene_discapacidad ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className="detail-section">
              <h3>
                <FaGraduationCap />
                Información Académica
              </h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label><FaBuilding /> Carrera:</label>
                  <span>{egresado.carrera_id ? (catalogos?.carrerasProfesionales?.find(c => c.id_carrera === egresado.carrera_id)?.nombre_carrera || `ID: ${egresado.carrera_id}`) : 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <label><FaCalendarAlt /> Año de Ingreso:</label>
                  <span>{egresado.anio_ingreso || 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <label><FaCalendarAlt /> Año de Egreso:</label>
                  <span>{egresado.anio_egreso || 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <label><FaCertificate /> Es Titulado:</label>
                  <span className={`badge ${egresado.es_titulado ? 'success' : 'secondary'}`}>
                    {egresado.es_titulado ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className="detail-item">
                  <label><FaCalendarAlt /> Año de Titulación:</label>
                  <span>{egresado.anio_titulacion || 'No especificado'}</span>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="detail-section">
              <h3>Estado del Registro</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Estado:</label>
                  <span className={`badge ${egresado.estado === 'A' ? 'success' : 'secondary'}`}>
                    {egresado.estado === 'A' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            onClick={onClose}
            className="btn btn-secondary"
          >
            <FaTimes />
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EgresadoDetailModal;

