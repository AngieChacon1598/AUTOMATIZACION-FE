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
    // Campos requeridos
    codigo_egresado: '',
    fecha_aplicacion: new Date().toISOString().split('T')[0],
    // Campos opcionales - Situación Laboral
    trabaja_actualmente: null,
    tipo_contrato: '',
    tipo_empleo: '',
    ingreso_mensual: '',
    area_trabajo: '',
    actividad_economica_id: '',
    relacion_carrera: '',
    // Campos opcionales - Búsqueda de Empleo
    medios_busqueda: '',
    cantidad_empleos_ultimo_ano: 0,
    cantidad_empleos_carrera: 0,
    // Campos opcionales - Empresa Actual
    nombre_empresa_actual: '',
    nombre_jefe_inmediato: '',
    telefono_empresa: '',
    pagina_web_empresa: '',
    correo_empresa: '',
    // Campos opcionales - Trabajo Independiente
    tiene_negocio: false,
    cantidad_trabajadores: '',
    tipo_constitucion: '',
    actividad_economica_negocio_id: '',
    // Estado
    estado: 'A'
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
    
    if (!formData.fecha_aplicacion || formData.fecha_aplicacion.trim() === '') {
      errors.fecha_aplicacion = 'La fecha de aplicación es requerida';
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
      // Preparar datos para enviar (eliminar campos vacíos y null)
      const encuestaData = {};
      
      // Campos requeridos
      encuestaData.codigo_egresado = formData.codigo_egresado;
      encuestaData.fecha_aplicacion = formData.fecha_aplicacion;
      
      // Agregar campos opcionales solo si tienen valor
      if (formData.trabaja_actualmente !== null) encuestaData.trabaja_actualmente = formData.trabaja_actualmente;
      if (formData.tipo_contrato) encuestaData.tipo_contrato = formData.tipo_contrato;
      if (formData.tipo_empleo) encuestaData.tipo_empleo = formData.tipo_empleo;
      if (formData.ingreso_mensual) encuestaData.ingreso_mensual = formData.ingreso_mensual;
      if (formData.area_trabajo) encuestaData.area_trabajo = formData.area_trabajo;
      if (formData.actividad_economica_id) encuestaData.actividad_economica_id = parseInt(formData.actividad_economica_id);
      if (formData.relacion_carrera) encuestaData.relacion_carrera = formData.relacion_carrera;
      if (formData.medios_busqueda) encuestaData.medios_busqueda = formData.medios_busqueda;
      if (formData.cantidad_empleos_ultimo_ano !== undefined) encuestaData.cantidad_empleos_ultimo_ano = parseInt(formData.cantidad_empleos_ultimo_ano) || 0;
      if (formData.cantidad_empleos_carrera !== undefined) encuestaData.cantidad_empleos_carrera = parseInt(formData.cantidad_empleos_carrera) || 0;
      if (formData.nombre_empresa_actual) encuestaData.nombre_empresa_actual = formData.nombre_empresa_actual;
      if (formData.nombre_jefe_inmediato) encuestaData.nombre_jefe_inmediato = formData.nombre_jefe_inmediato;
      if (formData.telefono_empresa) encuestaData.telefono_empresa = formData.telefono_empresa;
      if (formData.pagina_web_empresa) encuestaData.pagina_web_empresa = formData.pagina_web_empresa;
      if (formData.correo_empresa) encuestaData.correo_empresa = formData.correo_empresa;
      if (formData.tiene_negocio !== undefined) encuestaData.tiene_negocio = formData.tiene_negocio;
      if (formData.cantidad_trabajadores) encuestaData.cantidad_trabajadores = formData.cantidad_trabajadores;
      if (formData.tipo_constitucion) encuestaData.tipo_constitucion = formData.tipo_constitucion;
      if (formData.actividad_economica_negocio_id) encuestaData.actividad_economica_negocio_id = parseInt(formData.actividad_economica_negocio_id);
      if (formData.estado) encuestaData.estado = formData.estado;

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
              <label htmlFor="fecha_aplicacion">
                Fecha de Aplicación <span className="required">*</span>
              </label>
              <input
                type="date"
                id="fecha_aplicacion"
                name="fecha_aplicacion"
                value={formData.fecha_aplicacion}
                onChange={handleChange}
                className={fieldErrors.fecha_aplicacion ? 'error' : ''}
                required
              />
              {fieldErrors.fecha_aplicacion && (
                <span className="field-error">{fieldErrors.fecha_aplicacion}</span>
              )}
            </div>
          </div>

          {/* Campos opcionales - Se pueden agregar más adelante según necesidad */}
          {/* Por ahora solo los campos requeridos están visibles */}
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

