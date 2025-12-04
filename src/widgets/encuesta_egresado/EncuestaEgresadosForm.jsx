import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaFileAlt } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import { useEncuestas, useEgresados } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';
import './EncuestaEgresados.css';

const EncuestaEgresadosForm = () => {
  const navigate = useNavigate();
  const { createEncuesta } = useEncuestas();
  const { egresados, fetchEgresados } = useEgresados();
  
  const [formData, setFormData] = useState({
    codigo_egresado: '',
    fecha_encuesta: new Date().toISOString().split('T')[0],
    // Agregar aquí los campos específicos de tu encuesta según el backend
    // Estos son campos de ejemplo, ajusta según tu modelo de datos
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchEgresados({ estado: 'A', per_page: 1000 });
  }, []);

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

      console.log('📝 Datos a enviar para crear encuesta:', encuestaData);

      const result = await createEncuesta(encuestaData);

      if (result.success) {
        setMessage('✅ Encuesta creada exitosamente');
        setTimeout(() => {
          navigate('/encuestas');
        }, 1500);
      } else {
        setError(result.error || 'Error al crear la encuesta');
      }
    } catch (err) {
      console.error('❌ Error al crear encuesta:', err);
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/encuestas');
  };

  return (
    <div className="unified-content">
      <TopHeader 
        title="NUEVA ENCUESTA DE EGRESADO"
        breadcrumb="GESTIÓN > ENCUESTAS > NUEVA"
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
          {/* Ejemplo:
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="campo_ejemplo">Campo Ejemplo</label>
              <input
                type="text"
                id="campo_ejemplo"
                name="campo_ejemplo"
                value={formData.campo_ejemplo || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          */}
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
                <FaSave /> Guardar Encuesta
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EncuestaEgresadosForm;

