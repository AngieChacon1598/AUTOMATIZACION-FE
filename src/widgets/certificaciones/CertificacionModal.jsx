import React, { useState, useEffect } from 'react';
import { FaTimes, FaCertificate, FaUpload } from 'react-icons/fa';
import crudAxios from '../../shared/crudAxios';

const CertificacionModal = ({ codigoEgresado, certificacion, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    institucion: '',
    fecha_obtencion: '',
    archivo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (certificacion) {
      setFormData({
        nombre: certificacion.nombre || '',
        institucion: certificacion.institucion || '',
        fecha_obtencion: certificacion.fecha_obtencion 
          ? new Date(certificacion.fecha_obtencion).toISOString().split('T')[0] 
          : '',
        archivo: null
      });
    }
  }, [certificacion]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'archivo') {
      setFormData(prev => ({ ...prev, archivo: files[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.nombre.trim() || !formData.institucion.trim()) {
      setError('El nombre y la institución son requeridos');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('codigo_egresado', codigoEgresado);
      data.append('nombre', formData.nombre);
      data.append('institucion', formData.institucion);
      if (formData.fecha_obtencion) {
        data.append('fecha_obtencion', formData.fecha_obtencion);
      }
      if (formData.archivo) {
        data.append('archivo', formData.archivo);
      }

      if (certificacion && certificacion.id_certificacion) {
        // Editar
        await crudAxios.put(`/certificaciones/${certificacion.id_certificacion}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Crear
        await crudAxios.post('/certificaciones', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSuccess();
    } catch (err) {
      console.error('Error al guardar certificación:', err);
      setError(err.response?.data?.error || 'Error al guardar la certificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cert-modal" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cert-modal-header">
          <h3>
            <FaCertificate />
            {certificacion ? 'Editar Certificación' : 'Agregar Certificación'}
          </h3>
          <button className="close-btn" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <form className="cert-form" onSubmit={handleSubmit}>
          {error && (
            <div className="message error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <div className="cert-form-grid">
            <div className="cert-form-group">
              <label htmlFor="nombre">Nombre de la Certificación *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Especialización en..."
                required
                disabled={loading}
              />
            </div>

            <div className="cert-form-group">
              <label htmlFor="institucion">Institución *</label>
              <input
                type="text"
                id="institucion"
                name="institucion"
                value={formData.institucion}
                onChange={handleChange}
                placeholder="Nombre de la institución"
                required
                disabled={loading}
              />
            </div>

            <div className="cert-form-group">
              <label htmlFor="fecha_obtencion">Fecha de Obtención</label>
              <input
                type="date"
                id="fecha_obtencion"
                name="fecha_obtencion"
                value={formData.fecha_obtencion}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="cert-form-group">
              <label htmlFor="archivo">Archivo</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="archivo"
                  name="archivo"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                  className="file-input"
                  disabled={loading}
                />
                <label htmlFor="archivo" className="file-input-label">
                  <FaUpload /> {formData.archivo ? formData.archivo.name : 'Seleccionar archivo'}
                </label>
              </div>
              {certificacion?.archivo && !formData.archivo && (
                <div className="current-file">
                  Archivo actual: {certificacion.archivo}
                </div>
              )}
            </div>
          </div>

          <div className="cert-form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : certificacion ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificacionModal;

