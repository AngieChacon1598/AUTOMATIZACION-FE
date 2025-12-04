import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaFileAlt } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import { useEncuestas, useEgresados } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';
import './EncuestaEgresados.css';

const EncuestaEgresadosEditForm = () => {
  const { idEncuesta } = useParams();
  const navigate = useNavigate();
  const { getEncuesta, updateEncuesta } = useEncuestas();
  const { egresados, fetchEgresados } = useEgresados();
  
  const [formData, setFormData] = useState({
    codigo_egresado: '',
    fecha_encuesta: '',
    // Agregar aquí los campos específicos de tu encuesta según el backend
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [encuestaLoaded, setEncuestaLoaded] = useState(false);

  useEffect(() => {
    fetchEgresados({ estado: 'A', per_page: 1000 });
  }, []);

  // Cargar la encuesta al montar el componente
  useEffect(() => {
    const loadEncuesta = async () => {
      if (!idEncuesta) return;

      setLoading(true);
      setError('');

      const result = await getEncuesta(parseInt(idEncuesta));
      
      if (result.success && result.data) {
        const encuesta = result.data;
        setFormData({
          codigo_egresado: encuesta.codigo_egresado || '',
          fecha_encuesta: encuesta.fecha_encuesta 
            ? new Date(encuesta.fecha_encuesta).toISOString().split('T')[0] 
            : '',
          // Agregar aquí los demás campos según tu modelo
        });
        setEncuestaLoaded(true);
      } else {
        setError(result.error || 'No se pudo cargar la información de la encuesta');
      }
      
      setLoading(false);
    };

    loadEncuesta();
  }, [idEncuesta]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const processedValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.codigo_egresado || formData.codigo_egresado.trim() === '') {
      errors.codigo_egresado = 'El código de egresado es requerido';
    }
    
    if (!formData.fecha_encuesta || formData.fecha_encuesta.trim() === '') {
      errors.fecha_encuesta = 'La fecha de encuesta es requerida';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar (eliminar campos vacíos)
      const encuestaData = {
        codigo_egresado: formData.codigo_egresado,
        fecha_encuesta: formData.fecha_encuesta,
        // Agregar aquí los demás campos según tu modelo
      };

      console.log('📝 Datos a enviar para actualizar encuesta:', encuestaData);

      const result = await updateEncuesta(parseInt(idEncuesta), encuestaData);

      if (result.success) {
        setMessage('✅ Encuesta actualizada exitosamente');
        setTimeout(() => {
          navigate('/encuestas');
        }, 1500);
      } else {
        setError(result.error || 'Error al actualizar la encuesta');
      }
    } catch (err) {
      console.error('❌ Error al actualizar encuesta:', err);
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/encuestas');
  };

  if (loading && !encuestaLoaded) {
    return (
      <div className="unified-content">
        <TopHeader 
          title="EDITAR ENCUESTA DE EGRESADO"
          breadcrumb="GESTIÓN > ENCUESTAS > EDITAR"
        />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando información de la encuesta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-content">
      <TopHeader 
        title="EDITAR ENCUESTA DE EGRESADO"
        breadcrumb="GESTIÓN > ENCUESTAS > EDITAR"
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

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>
            <FaFileAlt />
            Información de la Encuesta
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="codigo_egresado">
                Código de Egresado <span className="required">*</span>
              </label>
              <select
                id="codigo_egresado"
                name="codigo_egresado"
                value={formData.codigo_egresado}
                onChange={handleChange}
                className={fieldErrors.codigo_egresado ? 'error' : ''}
                required
              >
                <option value="">Seleccione un egresado</option>
                {egresados
                  .filter(egresado => egresado.estado === 'A')
                  .map(egresado => (
                    <option key={egresado.codigo} value={egresado.codigo}>
                      {egresado.codigo} - {egresado.nombre} {egresado.apellidos}
                    </option>
                  ))}
              </select>
              {fieldErrors.codigo_egresado && (
                <span className="field-error">{fieldErrors.codigo_egresado}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="fecha_encuesta">
                Fecha de Encuesta <span className="required">*</span>
              </label>
              <input
                type="date"
                id="fecha_encuesta"
                name="fecha_encuesta"
                value={formData.fecha_encuesta}
                onChange={handleChange}
                className={fieldErrors.fecha_encuesta ? 'error' : ''}
                required
              />
              {fieldErrors.fecha_encuesta && (
                <span className="field-error">{fieldErrors.fecha_encuesta}</span>
              )}
            </div>
          </div>

          {/* Agregar aquí los demás campos del formulario según tu modelo de encuesta */}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            <FaTimes /> Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (
              <>
                <FaSave /> Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EncuestaEgresadosEditForm;

