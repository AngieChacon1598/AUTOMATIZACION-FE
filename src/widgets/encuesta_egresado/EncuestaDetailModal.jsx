import React from 'react';
import { FaTimes, FaUser, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import '../../shared/unified-tables.css';
import './EncuestaEgresados.css';

const EncuestaDetailModal = ({ encuesta, egresadoNombre, onClose }) => {
  if (!encuesta) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content encuesta-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaFileAlt />
            Detalles de la Encuesta
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
          <div className="detail-grid">
            <div className="detail-item">
              <label><FaFileAlt /> ID Encuesta:</label>
              <span>{encuesta.id_encuesta}</span>
            </div>
            <div className="detail-item">
              <label><FaUser /> Código de Egresado:</label>
              <span>{encuesta.codigo_egresado || '-'}</span>
            </div>
            <div className="detail-item">
              <label><FaUser /> Egresado:</label>
              <span>{egresadoNombre}</span>
            </div>
            <div className="detail-item">
              <label><FaCalendarAlt /> Fecha de Aplicación:</label>
              <span>
                {encuesta.fecha_aplicacion 
                  ? new Date(encuesta.fecha_aplicacion).toLocaleDateString() 
                  : (encuesta.fecha_encuesta 
                    ? new Date(encuesta.fecha_encuesta).toLocaleDateString() 
                    : '-')}
              </span>
            </div>
            <div className="detail-item">
              <label>Estado:</label>
              <span className={`badge ${encuesta.estado === 'A' ? 'success' : 'secondary'}`}>
                {encuesta.estado === 'A' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            
            {/* Mostrar todos los campos adicionales de la encuesta */}
            {Object.entries(encuesta).map(([key, value]) => {
              // Omitir campos ya mostrados y campos internos
              if (['id_encuesta', 'codigo_egresado', 'fecha_aplicacion', 'fecha_encuesta', 'estado'].includes(key)) {
                return null;
              }
              
              // Formatear el nombre del campo
              const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              // Formatear el valor
              let displayValue = value;
              if (value === null || value === undefined) {
                displayValue = '-';
              } else if (typeof value === 'boolean') {
                displayValue = value ? 'Sí' : 'No';
              } else if (typeof value === 'object') {
                displayValue = JSON.stringify(value, null, 2);
              }
              
              return (
                <div key={key} className="detail-item">
                  <label>{fieldName}:</label>
                  <span>{displayValue}</span>
                </div>
              );
            })}
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

export default EncuestaDetailModal;

