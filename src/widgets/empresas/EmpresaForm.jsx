import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaBuilding } from 'react-icons/fa';
import TopHeader from '../../components/TopHeader';
import { useEmpresas } from '../../shared/useApi.jsx';
import '../../shared/unified-tables.css';

const EmpresaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const { createEmpresa, updateEmpresa, getEmpresa } = useEmpresas();
  
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    correo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const hasLoadedData = useRef(false);

  useEffect(() => {
    if (isEdit && id && !hasLoadedData.current) {
      hasLoadedData.current = true; // Marcar que ya se cargaron los datos
      
      const loadEmpresaData = async () => {
        setLoading(true);
        setError('');
        
        try {
          console.log('📝 Cargando datos de empresa para editar, ID:', id);
          const result = await getEmpresa(id);
          
          if (result.success) {
            const empresaData = result.data;
            console.log('📝 Datos de empresa cargados:', empresaData);
            
            setFormData({
              nombre: empresaData.nombre || '',
              ruc: empresaData.ruc || '',
              direccion: empresaData.direccion || '',
              telefono: empresaData.telefono || '',
              correo: empresaData.correo || ''
            });
            
            setMessage('Datos de la empresa cargados correctamente');
          } else {
            setError(result.error || 'Error al cargar los datos de la empresa');
            console.error('❌ Error al cargar empresa:', result.error);
          }
        } catch (err) {
          setError('Error al cargar los datos de la empresa');
          console.error('❌ Error en loadEmpresaData:', err);
        } finally {
          setLoading(false);
        }
      };
      
      loadEmpresaData();
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.nombre.trim()) {
      errors.push('El nombre es requerido');
    }
    
    if (!formData.ruc.trim()) {
      errors.push('El RUC es requerido');
    } else if (!/^\d{11}$/.test(formData.ruc)) {
      errors.push('El RUC debe tener 11 dígitos');
    }
    
    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.push('El correo no tiene formato válido');
    }
    
    if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) {
      errors.push('El teléfono debe tener 9 dígitos');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      let result;
      if (isEdit) {
        result = await updateEmpresa(id, formData);
      } else {
        result = await createEmpresa(formData);
      }
      
      if (result.success) {
        setMessage(`Empresa ${isEdit ? 'actualizada' : 'creada'} correctamente!`);
        setTimeout(() => {
          navigate('/empresas');
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/empresas');
  };

  return (
    <>
      <TopHeader />
      <div className="unified-content">
        <div className="unified-form">
          <div className="unified-header">
            <h2>
              <FaBuilding />
              {isEdit ? 'Editar Empresa' : 'Agregar Nueva Empresa'}
            </h2>
          </div>

          {message && (
            <div className="message success">{message}</div>
          )}
          
          {error && (
            <div className="message error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre de la Empresa *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre de la empresa"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ruc">RUC *</label>
                <input
                  type="text"
                  id="ruc"
                  name="ruc"
                  value={formData.ruc}
                  onChange={handleChange}
                  placeholder="12345678901"
                  maxLength="11"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ingrese la dirección de la empresa"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="987654321"
                  maxLength="9"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="correo">Correo Electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="empresa@ejemplo.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    {isEdit ? 'Actualizando...' : 'Creando...'}
                  </div>
                ) : (
                  <>
                    <FaSave />
                    {isEdit ? 'Actualizar Empresa' : 'Crear Empresa'}
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={loading}
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmpresaForm;