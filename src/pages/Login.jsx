import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../shared/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // Login exitoso, redirigir al dashboard
        navigate('/dashboard');
      } else {
        setError(result.error);
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error inesperado. Inténtalo de nuevo.');
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fillTestCredentials = (type) => {
    if (type === 'admin') {
      setFormData({
        username: 'admin',
        password: 'admin123'
      });
    } else if (type === 'usuario') {
      setFormData({
        username: 'usuario',
        password: 'usuario123'
      });
    }
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <FaUser />
            </div>
            <h1>Sistema de Seguimiento de Egresados</h1>
            <p>Instituto Superior Tecnológico</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuario o Email</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Ingresa tu usuario o email"
                  className={error ? 'error' : ''}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  className={error ? 'error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Iniciando sesión...
                </div>
              ) : (
                <>
                  <FaSignInAlt />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Usuarios de prueba */}
          <div className="test-users">
            <h3>Usuarios de Prueba</h3>
            <div className="test-buttons">
              <button
                type="button"
                className="test-button admin"
                onClick={() => fillTestCredentials('admin')}
                disabled={loading}
              >
                <FaUser />
                Administrador
              </button>
              <button
                type="button"
                className="test-button user"
                onClick={() => fillTestCredentials('usuario')}
                disabled={loading}
              >
                <FaUser />
                Usuario Regular
              </button>
            </div>
          </div>

          {attempts > 0 && (
            <div className="attempts-warning">
              <p>Intentos fallidos: {attempts}</p>
              {attempts >= 3 && (
                <p className="warning">Después de 5 intentos fallidos, tu cuenta será bloqueada temporalmente.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
