import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../shared/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <div className="loading-content">
            <h3>Verificando Acceso</h3>
            <p>Validando credenciales de usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p>Rol requerido: <strong>{requiredRole}</strong></p>
          <p>Tu rol actual: <strong>{user?.rol}</strong></p>
        </div>
      </div>
    );
  }

  // Usuario autenticado y con permisos, mostrar el contenido
  return children;
};

export default ProtectedRoute;
