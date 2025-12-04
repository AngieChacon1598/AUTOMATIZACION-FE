import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from './api/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la aplicación
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = localStorage.getItem('token');

        if (currentUser && token) {
          // Verificar si el token es válido
          const tokenVerification = await authService.verifyToken();
          
          if (tokenVerification.success) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Token inválido, limpiar datos
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const result = await authService.login(username, password);
      
      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error inesperado durante el login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const hasRole = (role) => {
    return user && user.rol === role;
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
