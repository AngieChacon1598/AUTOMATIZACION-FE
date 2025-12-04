import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaUser, FaEnvelope, FaChild, FaGraduationCap, FaSpinner } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import { useEgresados, useCatalogos } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';
import '../../shared/ux-improvements.css';

const EditarEgresado = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();
  const { egresados, loading, error, getEgresado, updateEgresado } = useEgresados();
  const { catalogos } = useCatalogos();

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    apellidos: '',
    dni: '',
    fecha_nacimiento: '',
    sexo: '',
    direccion: '',
    telefono: '',
    telefono_referencia: '',
    correo: '',
    es_conviviente: false,
    estado_civil_id: '',
    cantidad_hijos: 0,
    tiene_discapacidad: false,
    carrera_id: '',
    anio_ingreso: '',
    anio_egreso: '',
    es_titulado: false,
    anio_titulacion: '',
    estado: 'A'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [message, setMessage] = useState('');
  const [egresadoLoaded, setEgresadoLoaded] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const loadEgresado = async () => {
      if (!codigo) return;
      
      // Resetear estado cuando cambia el código
      setEgresadoLoaded(false);
      setFormError(null);
      
      // Buscar primero en el estado local
      const egresadoLocal = egresados.find(e => e.codigo === codigo);
      
      if (egresadoLocal) {
        // Si ya está en el estado, usarlo directamente
        setFormData({
          ...egresadoLocal,
          fecha_nacimiento: egresadoLocal.fecha_nacimiento ? new Date(egresadoLocal.fecha_nacimiento).toISOString().split('T')[0] : '',
          estado_civil_id: egresadoLocal.estado_civil_id || '',
          carrera_id: egresadoLocal.carrera_id || '',
        });
        setEgresadoLoaded(true);
      } else {
        // Si no está, obtenerlo directamente por código (más eficiente que cargar todos)
        const result = await getEgresado(codigo);
        if (result.success && result.data) {
          const egresadoData = result.data;
          setFormData({
            ...egresadoData,
            fecha_nacimiento: egresadoData.fecha_nacimiento ? new Date(egresadoData.fecha_nacimiento).toISOString().split('T')[0] : '',
            estado_civil_id: egresadoData.estado_civil_id || '',
            carrera_id: egresadoData.carrera_id || '',
          });
          setEgresadoLoaded(true);
        } else {
          setFormError(result.error || 'Egresado no encontrado.');
        }
      }
    };

    loadEgresado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]); // Solo ejecutar cuando cambie el código

  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (value.trim() === '') return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (value.trim().length > 100) return 'El nombre no puede exceder 100 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) return 'El nombre solo puede contener letras y espacios';
        return '';
      case 'apellidos':
        if (value.trim() === '') return 'Los apellidos son requeridos';
        if (value.trim().length < 2) return 'Los apellidos deben tener al menos 2 caracteres';
        if (value.trim().length > 100) return 'Los apellidos no pueden exceder 100 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) return 'Los apellidos solo pueden contener letras y espacios';
        return '';
      case 'dni':
        if (value.trim() === '') return 'El DNI es requerido';
        if (!/^\d{8}$/.test(value)) return 'El DNI debe tener exactamente 8 dígitos';
        return '';
      case 'fecha_nacimiento':
        if (value === '') return '';
        const fechaNac = new Date(value);
        const hoy = new Date();
        if (fechaNac > hoy) return 'La fecha de nacimiento no puede ser futura';
        const edad = hoy.getFullYear() - fechaNac.getFullYear();
        if (edad > 120) return 'La fecha de nacimiento no es válida';
        if (edad < 15) return 'La edad debe ser al menos 15 años';
        return '';
      case 'correo':
        if (value.trim() === '') return 'El correo electrónico es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Correo electrónico no válido';
        if (value.length > 100) return 'El correo no puede exceder 100 caracteres';
        return '';
      case 'telefono':
        if (value.trim() === '') return '';
        if (!/^\d{9}$/.test(value)) return 'El teléfono debe tener 9 dígitos';
        return '';
      case 'telefono_referencia':
        if (value.trim() === '') return '';
        if (!/^\d{9}$/.test(value)) return 'El teléfono de referencia debe tener 9 dígitos';
        return '';
      case 'direccion':
        if (value.trim() === '') return '';
        if (value.trim().length > 200) return 'La dirección no puede exceder 200 caracteres';
        return '';
      case 'cantidad_hijos':
        if (value === '') return '';
        const hijos = parseInt(value);
        if (isNaN(hijos) || hijos < 0) return 'La cantidad de hijos debe ser un número positivo';
        if (hijos > 20) return 'La cantidad de hijos no puede ser mayor a 20';
        return '';
      case 'anio_ingreso':
        if (value === '') return '';
        const anioIngreso = parseInt(value);
        if (isNaN(anioIngreso)) return 'Año no válido';
        if (anioIngreso < 1900 || anioIngreso > new Date().getFullYear() + 1) {
          return 'Año fuera del rango válido';
        }
        return '';
      case 'anio_egreso':
        if (value === '') return '';
        const anioEgreso = parseInt(value);
        if (isNaN(anioEgreso)) return 'Año no válido';
        if (anioEgreso < 1900 || anioEgreso > new Date().getFullYear() + 1) {
          return 'Año fuera del rango válido';
        }
        return '';
      case 'anio_titulacion':
        if (value === '') {
          if (formData.es_titulado) {
            return 'El año de titulación es requerido si el egresado es titulado';
          }
          return '';
        }
        const anioTitulacion = parseInt(value);
        if (isNaN(anioTitulacion)) return 'Año no válido';
        if (anioTitulacion < 1900 || anioTitulacion > new Date().getFullYear() + 1) {
          return 'Año fuera del rango válido';
        }
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validar todos los campos usando validateField
    Object.keys(formData).forEach(key => {
      if (key === 'codigo' || key === 'estado' || key === 'es_conviviente' || key === 'tiene_discapacidad' || key === 'es_titulado') {
        return; // Saltar campos readonly, checkboxes y estado
      }
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
      }
    });

    // Validación especial para año de titulación si es titulado
    if (formData.es_titulado && !formData.anio_titulacion) {
      errors.anio_titulacion = 'El año de titulación es requerido si el egresado es titulado';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === 'checkbox' ? checked : value;
    
    // Validaciones en tiempo real para algunos campos
    if (type === 'text' || type === 'tel') {
      // Para DNI: solo números, máximo 8 dígitos
      if (name === 'dni') {
        processedValue = value.replace(/\D/g, '').slice(0, 8);
      }
      // Para teléfonos: solo números, máximo 9 dígitos
      else if (name === 'telefono' || name === 'telefono_referencia') {
        processedValue = value.replace(/\D/g, '').slice(0, 9);
      }
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: processedValue
      };
      
      // Si cambió es_titulado, validar anio_titulacion
      if (name === 'es_titulado' && processedValue && !newData.anio_titulacion) {
        setTimeout(() => {
          const error = validateField('anio_titulacion', newData.anio_titulacion);
          setFieldErrors(prevErrors => ({
            ...prevErrors,
            anio_titulacion: error || ''
          }));
        }, 0);
      }
      
      return newData;
    });
    
    // Validar el campo en tiempo real
    const error = validateField(name, processedValue);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setMessage('');

    // Validar el formulario
    if (!validateForm()) {
      setIsSubmitting(false);
      setFormError('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    try {
      const dataToSend = { ...formData };
      
      // Convertir IDs a números si no son vacíos
      if (dataToSend.estado_civil_id === '') dataToSend.estado_civil_id = null;
      else dataToSend.estado_civil_id = parseInt(dataToSend.estado_civil_id);

      if (dataToSend.carrera_id === '') dataToSend.carrera_id = null;
      else dataToSend.carrera_id = parseInt(dataToSend.carrera_id);

      // Convertir cantidad_hijos a número
      dataToSend.cantidad_hijos = parseInt(dataToSend.cantidad_hijos) || 0;

      // Convertir años a números si no son vacíos
      if (dataToSend.anio_ingreso === '') dataToSend.anio_ingreso = null;
      else dataToSend.anio_ingreso = parseInt(dataToSend.anio_ingreso);

      if (dataToSend.anio_egreso === '') dataToSend.anio_egreso = null;
      else dataToSend.anio_egreso = parseInt(dataToSend.anio_egreso);

      if (dataToSend.anio_titulacion === '') dataToSend.anio_titulacion = null;
      else dataToSend.anio_titulacion = parseInt(dataToSend.anio_titulacion);

      console.log('📝 Datos a enviar para actualizar:', dataToSend);
      
      const result = await updateEgresado(codigo, dataToSend);

      if (result.success) {
        setMessage('Egresado actualizado exitosamente');
        setTimeout(() => {
          navigate('/egresados');
        }, 1500);
      } else {
        setFormError(result.error || 'Error al actualizar egresado');
      }
    } catch (err) {
      console.error('❌ Error al actualizar egresado:', err);
      setFormError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/egresados');
  };

  if (loading) {
    return (
      <div className="unified-content">
        <div className="loading-container">
          <FaSpinner className="spinner" size={50} />
          <p>Cargando datos del egresado...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unified-content">
        <div className="error-container">
          <p>Error al cargar el egresado: {error}</p>
          <button onClick={() => navigate('/egresados')} className="btn btn-secondary">
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
          title={`Editar Egresado: ${formData.nombre} ${formData.apellidos}`}
          icon={<FaUser />}
          subtitle={`Código: ${formData.codigo}`}
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
            {/* Información Personal */}
            <div className="form-section">
              <h3>
                <FaUser />
                Información Personal
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigo">Código del Egresado</label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    readOnly
                    className="read-only"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="dni">DNI *</label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    required
                    maxLength="8"
                    placeholder="12345678"
                    className={fieldErrors.dni ? 'error' : ''}
                  />
                  {fieldErrors.dni && <span className="error-message">{fieldErrors.dni}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Nombre del egresado"
                    className={fieldErrors.nombre ? 'error' : ''}
                  />
                  {fieldErrors.nombre && <span className="error-message">{fieldErrors.nombre}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos *</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    placeholder="Apellidos del egresado"
                    className={fieldErrors.apellidos ? 'error' : ''}
                  />
                  {fieldErrors.apellidos && <span className="error-message">{fieldErrors.apellidos}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={fieldErrors.fecha_nacimiento ? 'error' : ''}
                  />
                  {fieldErrors.fecha_nacimiento && <span className="error-message">{fieldErrors.fecha_nacimiento}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="sexo">Sexo</label>
                  <select
                    id="sexo"
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="form-section">
              <h3>
                <FaEnvelope />
                Información de Contacto
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="correo">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    placeholder="correo@ejemplo.com"
                    className={fieldErrors.correo ? 'error' : ''}
                  />
                  {fieldErrors.correo && <span className="error-message">{fieldErrors.correo}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    maxLength="9"
                    placeholder="999999999"
                    className={fieldErrors.telefono ? 'error' : ''}
                  />
                  {fieldErrors.telefono && <span className="error-message">{fieldErrors.telefono}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefono_referencia">Teléfono de Referencia</label>
                  <input
                    type="tel"
                    id="telefono_referencia"
                    name="telefono_referencia"
                    value={formData.telefono_referencia}
                    onChange={handleChange}
                    maxLength="9"
                    placeholder="999999999"
                    className={fieldErrors.telefono_referencia ? 'error' : ''}
                  />
                  {fieldErrors.telefono_referencia && <span className="error-message">{fieldErrors.telefono_referencia}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Dirección completa"
                    maxLength="200"
                    className={fieldErrors.direccion ? 'error' : ''}
                  />
                  {fieldErrors.direccion && <span className="error-message">{fieldErrors.direccion}</span>}
                </div>
              </div>
            </div>

            {/* Información Familiar */}
            <div className="form-section">
              <h3>
                <FaChild />
                Información Familiar
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="estado_civil_id">Estado Civil</label>
                  <select
                    id="estado_civil_id"
                    name="estado_civil_id"
                    value={formData.estado_civil_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {catalogos.estadosCiviles?.map(estado => (
                      <option key={estado.id_estado_civil} value={estado.id_estado_civil}>
                        {estado.nombre_estado}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cantidad_hijos">Cantidad de Hijos</label>
                  <input
                    type="number"
                    id="cantidad_hijos"
                    name="cantidad_hijos"
                    value={formData.cantidad_hijos}
                    onChange={handleChange}
                    min="0"
                    max="20"
                    placeholder="0"
                    className={fieldErrors.cantidad_hijos ? 'error' : ''}
                  />
                  {fieldErrors.cantidad_hijos && <span className="error-message">{fieldErrors.cantidad_hijos}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="es_conviviente"
                      checked={formData.es_conviviente}
                      onChange={handleChange}
                    />
                    Es Conviviente
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="tiene_discapacidad"
                      checked={formData.tiene_discapacidad}
                      onChange={handleChange}
                    />
                    Tiene Discapacidad
                  </label>
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className="form-section">
              <h3>
                <FaGraduationCap />
                Información Académica
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="carrera_id">Carrera Profesional</label>
                  <select
                    id="carrera_id"
                    name="carrera_id"
                    value={formData.carrera_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {catalogos.carrerasProfesionales?.map(carrera => (
                      <option key={carrera.id_carrera} value={carrera.id_carrera}>
                        {carrera.nombre_carrera}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="anio_ingreso">Año de Ingreso</label>
                  <input
                    type="number"
                    id="anio_ingreso"
                    name="anio_ingreso"
                    value={formData.anio_ingreso}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="2020"
                    className={fieldErrors.anio_ingreso ? 'error' : ''}
                  />
                  {fieldErrors.anio_ingreso && <span className="error-message">{fieldErrors.anio_ingreso}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="anio_egreso">Año de Egreso</label>
                  <input
                    type="number"
                    id="anio_egreso"
                    name="anio_egreso"
                    value={formData.anio_egreso}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="2023"
                    className={fieldErrors.anio_egreso ? 'error' : ''}
                  />
                  {fieldErrors.anio_egreso && <span className="error-message">{fieldErrors.anio_egreso}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="anio_titulacion">Año de Titulación</label>
                  <input
                    type="number"
                    id="anio_titulacion"
                    name="anio_titulacion"
                    value={formData.anio_titulacion}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="2024"
                    className={fieldErrors.anio_titulacion ? 'error' : ''}
                  />
                  {fieldErrors.anio_titulacion && <span className="error-message">{fieldErrors.anio_titulacion}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="es_titulado"
                      checked={formData.es_titulado}
                      onChange={handleChange}
                    />
                    Es Titulado
                  </label>
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
                    <div className="spinner"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Actualizar Egresado
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

export default EditarEgresado;