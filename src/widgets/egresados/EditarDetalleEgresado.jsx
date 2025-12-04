import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes, FaBuilding, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaSpinner, FaSave } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import { useDetallesEgresados, useEgresados, useEmpresas } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';
import '../../shared/ux-improvements.css';

// Opciones de rangos salariales
// Guardamos el PROMEDIO del rango como valor representativo
const RANGOS_SALARIALES = [
  { value: '', label: 'Seleccione un rango', numericValue: null },
  { value: 'menos_1000', label: 'Menos de 1000', numericValue: 999 },
  { value: '1001_1500', label: 'Entre 1001 y 1500', numericValue: 1250 },
  { value: '1501_2000', label: 'Entre 1501 y 2000', numericValue: 1750 },
  { value: '2001_3000', label: 'Entre 2001 y 3000', numericValue: 2500 },
  { value: '3001_4000', label: 'Entre 3001 y 4000', numericValue: 3500 },
  { value: '4001_5000', label: 'Entre 4001 y 5000', numericValue: 4500 },
  { value: 'mas_5000', label: 'Más de 5000', numericValue: 5000 }
];

// Función para convertir valor numérico a rango
// Si el valor está en un rango, devuelve el rango correspondiente
const getRangoFromValue = (value) => {
  if (!value || value === '' || value === null) return '';
  const numValue = parseFloat(value);
  
  if (numValue < 1000) return 'menos_1000';
  if (numValue >= 1001 && numValue <= 1500) return '1001_1500';
  if (numValue >= 1501 && numValue <= 2000) return '1501_2000';
  if (numValue >= 2001 && numValue <= 3000) return '2001_3000';
  if (numValue >= 3001 && numValue <= 4000) return '3001_4000';
  if (numValue >= 4001 && numValue <= 5000) return '4001_5000';
  if (numValue > 5000) return 'mas_5000';
  
  return '';
};

function EditarDetalleEgresado() {
  const { idDetalle } = useParams();
  const navigate = useNavigate();
  const { 
    getDetalleEgresado, 
    updateDetalleEgresado, 
    loading 
  } = useDetallesEgresados();
  const { egresados, fetchEgresados } = useEgresados();
  const { empresas, fetchEmpresas } = useEmpresas();

  const [formData, setFormData] = useState({
    codigo_egresado: '',
    fecha_egreso: '',
    empresa_actual: '',
    empresa_actual_otro: '', // Para cuando se selecciona "Otro"
    cargo_actual: '',
    pais_residencia: '',
    ciudad_residencia: '',
    fecha_incorporacion: '',
    area_trabajo: '',
    sueldo_actual_rango: '', // Para el select
    sueldo_actual: '', // Para guardar el valor numérico
    estado: 'A'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [detalleLoaded, setDetalleLoaded] = useState(false);
  const [detalleData, setDetalleData] = useState(null);

  useEffect(() => {
    fetchEgresados({ estado: 'A', per_page: 1000 });
    fetchEmpresas({ estado: 'A', per_page: 1000 });
  }, []);

  // Limpiar empresa_actual_otro cuando se selecciona una empresa de la lista
  useEffect(() => {
    if (formData.empresa_actual && formData.empresa_actual !== 'OTRO') {
      setFormData(prev => ({
        ...prev,
        empresa_actual_otro: ''
      }));
    }
  }, [formData.empresa_actual]);

  // Cargar el detalle
  useEffect(() => {
    const loadDetalle = async () => {
      if (!idDetalle) return;

      setDetalleLoaded(false);
      setFormError(null);

      const result = await getDetalleEgresado(parseInt(idDetalle));
      
      if (result.success && result.data) {
        setDetalleData(result.data);
      } else {
        setFormError(result.error || 'No se pudo cargar la información del detalle');
      }
    };

    loadDetalle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idDetalle]);

  // Procesar el detalle cuando tanto el detalle como las empresas estén cargados
  useEffect(() => {
    if (detalleData && empresas.length > 0) {
      const detalle = detalleData;
      const sueldoActual = detalle.sueldo_actual ? parseFloat(detalle.sueldo_actual) : null;
      
      // Verificar si la empresa_actual está en la lista de empresas
      const empresaEnLista = empresas.find(emp => emp.nombre === detalle.empresa_actual);
      const empresaActual = empresaEnLista ? detalle.empresa_actual : (detalle.empresa_actual ? 'OTRO' : '');
      const empresaActualOtro = empresaEnLista ? '' : (detalle.empresa_actual || '');
      
      setFormData({
        codigo_egresado: detalle.codigo_egresado || '',
        fecha_egreso: detalle.fecha_egreso ? new Date(detalle.fecha_egreso).toISOString().split('T')[0] : '',
        empresa_actual: empresaActual,
        empresa_actual_otro: empresaActualOtro,
        cargo_actual: detalle.cargo_actual || '',
        pais_residencia: detalle.pais_residencia || '',
        ciudad_residencia: detalle.ciudad_residencia || '',
        fecha_incorporacion: detalle.fecha_incorporacion ? new Date(detalle.fecha_incorporacion).toISOString().split('T')[0] : '',
        area_trabajo: detalle.area_trabajo || '',
        sueldo_actual_rango: getRangoFromValue(sueldoActual),
        sueldo_actual: sueldoActual ? sueldoActual.toString() : '',
        estado: detalle.estado || 'A'
      });
      setDetalleLoaded(true);
    }
  }, [detalleData, empresas]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Función para validar solo letras y espacios (sin números ni caracteres especiales)
  const validateSoloLetras = (value) => {
    if (!value || value.trim() === '') return null; // Permitir vacío
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    return regex.test(value) ? null : 'Solo se permiten letras y espacios';
  };

  // Función para validar fecha de egreso (no mayor al año actual)
  const validateFechaEgreso = (value) => {
    if (!value || value.trim() === '') return null; // Permitir vacío
    const fecha = new Date(value);
    const añoActual = new Date().getFullYear();
    const añoFecha = fecha.getFullYear();
    if (añoFecha > añoActual) {
      return 'La fecha de egreso no puede ser mayor al año actual';
    }
    return null;
  };

  // Función para validar fecha de incorporación (no mayor al año actual)
  const validateFechaIncorporacion = (value) => {
    if (!value || value.trim() === '') return null; // Permitir vacío
    const fecha = new Date(value);
    const añoActual = new Date().getFullYear();
    const añoFecha = fecha.getFullYear();
    if (añoFecha > añoActual) {
      return 'La fecha de incorporación no puede ser mayor al año actual';
    }
    return null;
  };

  // Función para validar sueldo (no negativo ni inválido)
  const validateSueldo = (value) => {
    if (!value || value === '') return null; // Permitir vacío
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'Debe ingresar un número válido';
    }
    if (numValue < 0) {
      return 'El sueldo no puede ser negativo';
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errors = { ...validationErrors };
    
    // Si es el campo de rango salarial, convertir a valor numérico
    if (name === 'sueldo_actual_rango') {
      const rangoSeleccionado = RANGOS_SALARIALES.find(r => r.value === value);
      const nuevoSueldo = rangoSeleccionado ? rangoSeleccionado.numericValue : '';
      setFormData(prev => ({
        ...prev,
        sueldo_actual_rango: value,
        sueldo_actual: nuevoSueldo
      }));
      // Validar el sueldo después de actualizarlo
      const sueldoError = validateSueldo(nuevoSueldo);
      if (sueldoError) {
        errors.sueldo_actual = sueldoError;
      } else {
        delete errors.sueldo_actual;
      }
    } 
    // Si es el campo código de egresado, solo actualizar el código
    else if (name === 'codigo_egresado') {
      setFormData(prev => ({
        ...prev,
        codigo_egresado: value
      }));
    } 
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Validaciones en tiempo real
    let error = null;
    
    if (name === 'fecha_egreso') {
      error = validateFechaEgreso(value);
    } else if (name === 'fecha_incorporacion') {
      error = validateFechaIncorporacion(value);
    } else if (name === 'cargo_actual') {
      error = validateSoloLetras(value);
    } else if (name === 'pais_residencia') {
      error = validateSoloLetras(value);
    } else if (name === 'ciudad_residencia') {
      error = validateSoloLetras(value);
    } else if (name === 'area_trabajo') {
      error = validateSoloLetras(value);
    } else if (name === 'sueldo_actual') {
      error = validateSueldo(value);
    }

    // Actualizar errores
    if (error) {
      errors[name] = error;
    } else {
      delete errors[name];
    }
    
    setValidationErrors(errors);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.codigo_egresado) {
      errors.codigo_egresado = 'El código de egresado es requerido';
    }

    // Validar que si se selecciona "OTRO", se debe ingresar el nombre de la empresa
    if (formData.empresa_actual === 'OTRO' && !formData.empresa_actual_otro.trim()) {
      errors.empresa_actual_otro = 'Debe ingresar el nombre de la empresa';
    }

    // Validar fecha de egreso
    const fechaEgresoError = validateFechaEgreso(formData.fecha_egreso);
    if (fechaEgresoError) {
      errors.fecha_egreso = fechaEgresoError;
    }

    // Validar fecha de incorporación (no mayor al año actual)
    const fechaIncorporacionError = validateFechaIncorporacion(formData.fecha_incorporacion);
    if (fechaIncorporacionError) {
      errors.fecha_incorporacion = fechaIncorporacionError;
    }

    // Validar fecha de incorporación vs fecha de egreso
    if (formData.fecha_egreso && formData.fecha_incorporacion && !errors.fecha_incorporacion) {
      const fechaEgreso = new Date(formData.fecha_egreso);
      const fechaIncorporacion = new Date(formData.fecha_incorporacion);
      if (fechaIncorporacion < fechaEgreso) {
        errors.fecha_incorporacion = 'La fecha de incorporación no puede ser anterior a la fecha de egreso';
      }
    }

    // Validar campos de solo letras
    const cargoError = validateSoloLetras(formData.cargo_actual);
    if (cargoError) {
      errors.cargo_actual = cargoError;
    }

    const paisError = validateSoloLetras(formData.pais_residencia);
    if (paisError) {
      errors.pais_residencia = paisError;
    }

    const ciudadError = validateSoloLetras(formData.ciudad_residencia);
    if (ciudadError) {
      errors.ciudad_residencia = ciudadError;
    }

    const areaError = validateSoloLetras(formData.area_trabajo);
    if (areaError) {
      errors.area_trabajo = areaError;
    }

    // Validar sueldo
    const sueldoError = validateSueldo(formData.sueldo_actual);
    if (sueldoError) {
      errors.sueldo_actual = sueldoError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setMessage('');

    if (!validateForm()) {
      setFormError('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      // Si se seleccionó "OTRO", usar el valor de empresa_actual_otro, sino usar empresa_actual
      const empresaActual = formData.empresa_actual === 'OTRO' 
        ? formData.empresa_actual_otro 
        : formData.empresa_actual;
      
      // Solo enviar campos que han cambiado o todos los campos
      const detalleData = {
        codigo_egresado: formData.codigo_egresado,
        fecha_egreso: formData.fecha_egreso || null,
        empresa_actual: empresaActual || null,
        cargo_actual: formData.cargo_actual || null,
        pais_residencia: formData.pais_residencia || null,
        ciudad_residencia: formData.ciudad_residencia || null,
        fecha_incorporacion: formData.fecha_incorporacion || null,
        area_trabajo: formData.area_trabajo || null,
        sueldo_actual: formData.sueldo_actual ? parseFloat(formData.sueldo_actual) : null,
        estado: formData.estado || 'A'
      };

      console.log('📝 Datos a enviar para actualizar:', detalleData);

      const result = await updateDetalleEgresado(parseInt(idDetalle), detalleData);

      if (result.success) {
        setMessage('Detalle de egresado actualizado exitosamente');
        setTimeout(() => {
          navigate('/detalles');
        }, 1500);
      } else {
        setFormError(result.error || 'Error al actualizar el detalle de egresado');
      }
    } catch (err) {
      console.error('❌ Error al actualizar detalle:', err);
      setFormError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/detalles');
  };

  if (loading && !detalleLoaded) {
    return (
      <div className="unified-content">
        <div className="loading-container">
          <FaSpinner className="spinner" size={50} />
          <p>Cargando información del detalle...</p>
        </div>
      </div>
    );
  }

  if (formError && !detalleLoaded) {
    return (
      <div className="unified-content">
        <div className="error-container">
          <p>Error al cargar el detalle: {formError}</p>
          <button onClick={() => navigate('/detalles')} className="btn btn-secondary">
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-content">
      <div className="unified-list">
        <TopHeader 
          title={`Editar Detalle de Egresado: ID ${idDetalle}`}
          icon={<FaEdit />}
          subtitle={`Código: ${formData.codigo_egresado || 'Cargando...'}`}
        />

        {message && (
          <div className="message success">
            {message}
          </div>
        )}

        {formError && (
          <div className="message error">
            {formError}
          </div>
        )}

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Información Básica */}
            <div className="form-section">
              <h3>
                <FaBuilding />
                Información Básica
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigo_egresado">Código de Egresado *</label>
                  <select
                    id="codigo_egresado"
                    name="codigo_egresado"
                    value={formData.codigo_egresado}
                    onChange={handleChange}
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
                  {validationErrors.codigo_egresado && (
                    <span className="error-message">{validationErrors.codigo_egresado}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Información Laboral */}
            <div className="form-section">
              <h3>
                <FaBriefcase />
                Información Laboral
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="empresa_actual">Empresa Actual</label>
                  <select
                    id="empresa_actual"
                    name="empresa_actual"
                    value={formData.empresa_actual}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una empresa</option>
                    {empresas.map(empresa => (
                      <option key={empresa.id_empresa} value={empresa.nombre}>
                        {empresa.nombre}
                      </option>
                    ))}
                    <option value="OTRO">Otro (escribir manualmente)</option>
                  </select>
                  {formData.empresa_actual === 'OTRO' && (
                    <>
                      <input
                        type="text"
                        id="empresa_actual_otro"
                        name="empresa_actual_otro"
                        value={formData.empresa_actual_otro}
                        onChange={handleChange}
                        placeholder="Ingrese el nombre de la empresa"
                        style={{ marginTop: '8px' }}
                        required={formData.empresa_actual === 'OTRO'}
                      />
                      {validationErrors.empresa_actual_otro && (
                        <span className="error-message">{validationErrors.empresa_actual_otro}</span>
                      )}
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="cargo_actual">Cargo Actual</label>
                  <input
                    type="text"
                    id="cargo_actual"
                    name="cargo_actual"
                    value={formData.cargo_actual}
                    onChange={handleChange}
                    placeholder="Cargo o puesto de trabajo"
                  />
                  {validationErrors.cargo_actual && (
                    <span className="error-message">{validationErrors.cargo_actual}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="area_trabajo">Área de Trabajo</label>
                  <input
                    type="text"
                    id="area_trabajo"
                    name="area_trabajo"
                    value={formData.area_trabajo}
                    onChange={handleChange}
                    placeholder="Área o departamento"
                  />
                  {validationErrors.area_trabajo && (
                    <span className="error-message">{validationErrors.area_trabajo}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="sueldo_actual_rango">Sueldo Actual</label>
                  <select
                    id="sueldo_actual_rango"
                    name="sueldo_actual_rango"
                    value={formData.sueldo_actual_rango}
                    onChange={handleChange}
                  >
                    {RANGOS_SALARIALES.map(rango => (
                      <option key={rango.value} value={rango.value}>
                        {rango.label}
                      </option>
                    ))}
                  </select>
                  {validationErrors.sueldo_actual && (
                    <span className="error-message">{validationErrors.sueldo_actual}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha_incorporacion">Fecha de Incorporación</label>
                  <input
                    type="date"
                    id="fecha_incorporacion"
                    name="fecha_incorporacion"
                    value={formData.fecha_incorporacion}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {validationErrors.fecha_incorporacion && (
                    <span className="error-message">{validationErrors.fecha_incorporacion}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_egreso">Fecha de Salida (Opcional)</label>
                  <input
                    type="date"
                    id="fecha_egreso"
                    name="fecha_egreso"
                    value={formData.fecha_egreso}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>
                    Deje vacío si el egresado aún trabaja en esta empresa (hasta la fecha)
                  </small>
                  {validationErrors.fecha_egreso && (
                    <span className="error-message">{validationErrors.fecha_egreso}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Información de Residencia */}
            <div className="form-section">
              <h3>
                <FaMapMarkerAlt />
                Información de Residencia
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pais_residencia">País de Residencia</label>
                  <input
                    type="text"
                    id="pais_residencia"
                    name="pais_residencia"
                    value={formData.pais_residencia}
                    onChange={handleChange}
                    placeholder="País"
                  />
                  {validationErrors.pais_residencia && (
                    <span className="error-message">{validationErrors.pais_residencia}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="ciudad_residencia">Ciudad de Residencia</label>
                  <input
                    type="text"
                    id="ciudad_residencia"
                    name="ciudad_residencia"
                    value={formData.ciudad_residencia}
                    onChange={handleChange}
                    placeholder="Ciudad"
                  />
                  {validationErrors.ciudad_residencia && (
                    <span className="error-message">{validationErrors.ciudad_residencia}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="form-section">
              <h3>Estado</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value="A">Activo</option>
                    <option value="I">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                <FaTimes />
                Cancelar
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Actualizar Detalle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarDetalleEgresado;
