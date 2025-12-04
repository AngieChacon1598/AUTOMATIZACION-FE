import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaUser, FaPlus } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import { useEgresados, useCatalogos } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';

const AgregarEgresado = () => {
  const navigate = useNavigate();
  const { createEgresado } = useEgresados();
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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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
      // Para código: solo letras y números, sin espacios
      else if (name === 'codigo') {
        processedValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
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

  const validateField = (name, value) => {
    switch (name) {
      case 'codigo':
        if (value.trim() === '') return 'El código es requerido';
        if (value.trim().length < 3) return 'El código debe tener al menos 3 caracteres';
        if (!/^[A-Z0-9]+$/i.test(value.trim())) return 'El código solo puede contener letras y números';
        return '';
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
        if (value.trim() === '') return '';
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
      case 'carrera_id':
        return value === '' ? 'La carrera profesional es requerida' : '';
      case 'anio_ingreso':
        if (value === '') return '';
        const anioIngreso = parseInt(value);
        if (isNaN(anioIngreso)) return 'Año no válido';
        if (anioIngreso < 1900 || anioIngreso > new Date().getFullYear() + 1) {
          return 'Año fuera del rango válido';
        }
        if (formData.anio_egreso && parseInt(formData.anio_egreso) < anioIngreso) {
          return 'El año de ingreso debe ser menor o igual al año de egreso';
        }
        return '';
      case 'anio_egreso':
        if (value === '') return '';
        const anioEgreso = parseInt(value);
        if (isNaN(anioEgreso)) return 'Año no válido';
        if (anioEgreso < 1900 || anioEgreso > new Date().getFullYear() + 1) {
          return 'Año fuera del rango válido';
        }
        if (formData.anio_ingreso && parseInt(formData.anio_ingreso) > anioEgreso) {
          return 'El año de egreso debe ser mayor o igual al año de ingreso';
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
        if (formData.anio_egreso && parseInt(formData.anio_egreso) > anioTitulacion) {
          return 'El año de titulación debe ser mayor o igual al año de egreso';
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
      if (key === 'estado' || key === 'es_conviviente' || key === 'tiene_discapacidad' || key === 'es_titulado') {
        return; // Saltar checkboxes y estado
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validar el formulario
    if (!validateForm()) {
      setLoading(false);
      setError('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    try {
      // Preparar los datos para enviar
      const egresadoData = {
        ...formData,
        cantidad_hijos: parseInt(formData.cantidad_hijos) || 0,
        anio_ingreso: formData.anio_ingreso ? parseInt(formData.anio_ingreso) : null,
        anio_egreso: formData.anio_egreso ? parseInt(formData.anio_egreso) : null,
        anio_titulacion: formData.anio_titulacion ? parseInt(formData.anio_titulacion) : null,
        estado_civil_id: formData.estado_civil_id ? parseInt(formData.estado_civil_id) : null,
        carrera_id: formData.carrera_id ? parseInt(formData.carrera_id) : null
      };

      console.log('📝 Datos del egresado a crear:', egresadoData);
      
      const result = await createEgresado(egresadoData);
      
      if (result.success) {
        setMessage('Egresado creado exitosamente');
        setTimeout(() => {
          navigate('/egresados');
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('❌ Error al crear egresado:', err);
      setError('Error al crear egresado');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/egresados');
  };

  return (
    <div className="unified-content">
      <div className="unified-list">
        <TopHeader 
          title="Nuevo Egresado"
          icon={<FaUser />}
          subtitle="Registra un nuevo egresado en el sistema"
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
            {/* Información Personal */}
            <div className="form-section">
              <h3>
                <FaUser />
                Información Personal
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigo">Código del Egresado *</label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    placeholder="Ej: EG001"
                    className={fieldErrors.codigo ? 'error' : ''}
                  />
                  {fieldErrors.codigo && <span className="error-message">{fieldErrors.codigo}</span>}
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
                <FaUser />
                Información de Contacto
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="correo">Correo Electrónico</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
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
                <FaUser />
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
                <FaUser />
                Información Académica
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="carrera_id">Carrera Profesional *</label>
                  <select
                    id="carrera_id"
                    name="carrera_id"
                    value={formData.carrera_id}
                    onChange={handleChange}
                    className={fieldErrors.carrera_id ? 'error' : ''}
                  >
                    <option value="">Seleccionar</option>
                    {catalogos.carrerasProfesionales?.map(carrera => (
                      <option key={carrera.id_carrera} value={carrera.id_carrera}>
                        {carrera.nombre_carrera}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.carrera_id && <span className="error-message">{fieldErrors.carrera_id}</span>}
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
                    Crear Egresado
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

export default AgregarEgresado;