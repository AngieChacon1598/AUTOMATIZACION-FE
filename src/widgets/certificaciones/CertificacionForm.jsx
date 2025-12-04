import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaCertificate } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import { useCertificaciones, useEgresados } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';

const CertificacionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createCertificacion } = useCertificaciones();
  const { egresados } = useEgresados();
  
  const [formData, setFormData] = useState({
    codigo_egresado: '',
    nombre: '',
    institucion: '',
    fecha_obtencion: '',
    archivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      // Aquí cargarías los datos de la certificación cuando esté disponible
      console.log('Cargando certificación:', id);
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createCertificacion(formData);
      
      if (result.success) {
        setMessage('Certificación creada exitosamente');
        setTimeout(() => {
          navigate('/certificaciones');
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al crear certificación');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/certificaciones');
  };

  return (
    <div className="unified-content">
      <div className="unified-list">
        <TopHeader 
          title={isEditing ? "Editar Certificación" : "Nueva Certificación"}
          icon={<FaCertificate />}
          subtitle={isEditing ? "Modifica los datos de la certificación" : "Crea una nueva certificación profesional"}
        />

        {message && (
          <div className="message success">
            {message}
          </div>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="codigo_egresado">Egresado *</label>
                <select
                  id="codigo_egresado"
                  name="codigo_egresado"
                  value={formData.codigo_egresado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar egresado</option>
                  {egresados.map(egresado => (
                    <option key={egresado.codigo} value={egresado.codigo}>
                      {egresado.codigo} - {egresado.nombre} {egresado.apellidos}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="fecha_obtencion">Fecha de Obtención *</label>
                <input
                  type="date"
                  id="fecha_obtencion"
                  name="fecha_obtencion"
                  value={formData.fecha_obtencion}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre de la Certificación *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Certificación en Desarrollo Web"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="institucion">Institución *</label>
                <input
                  type="text"
                  id="institucion"
                  name="institucion"
                  value={formData.institucion}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Universidad Nacional"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="archivo">Archivo (opcional)</label>
              <input
                type="text"
                id="archivo"
                name="archivo"
                value={formData.archivo}
                onChange={handleChange}
                placeholder="Nombre del archivo adjunto"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={loading}
              >
                <FaTimes />
                Cancelar
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    {isEditing ? 'Actualizar' : 'Crear'} Certificación
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CertificacionForm;
