import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../shared/AuthContext';
import NotificationSystem from './NotificationSystem';
import './TopHeader.css';

const TopHeader = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // Función para determinar el breadcrumb según la ruta actual
  const getBreadcrumb = () => {
    const path = location.pathname;

    // Dashboard
    if (path === '/dashboard') {
      return 'DASHBOARD';
    }
    
    // Egresados
    if (path === '/egresados' || path.startsWith('/egresados/') || path.startsWith('/editar/')) {
      return 'EGRESADOS';
    }
    
    // Detalle de Egresados
    if (path === '/detalles' || path.startsWith('/agregar-detalle') || 
        path.startsWith('/editar-detalle/') || path.startsWith('/historial/')) {
      return 'DETALLE DE EGRESADOS';
    }
    
    // Centro Laboral (Empresas)
    if (path === '/empresas' || path.startsWith('/empresas/')) {
      return 'CENTRO LABORAL';
    }
    
    // Certificaciones
    if (path === '/certificaciones' || path.startsWith('/certificaciones/')) {
      return 'CERTIFICACIONES';
    }
    
    // Reportes
    if (path === '/analytics') {
      return 'REPORTES DETALLADOS';
    }
    
    // Encuestas
    if (path === '/encuestas' || path.startsWith('/encuestas/')) {
      return 'ENCUESTAS';
    }
    
    // Por defecto
    return 'DASHBOARD';
  };

  const userMenuItems = [
    { icon: FaUser, label: 'Mi Perfil', action: () => alert('Ir a perfil') },
    { icon: FaCog, label: 'Configuración', action: () => alert('Ir a configuración') },
    { icon: FaSignOutAlt, label: 'Cerrar Sesión', action: handleLogout, isDanger: true }
  ];

  return (
    <div className="top-header">
      <div className="header-left">
        <div className="breadcrumb">
          <span className="breadcrumb-item">GESTIÓN</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">{getBreadcrumb()}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Notificaciones */}
        <div className="notification-container">
          <NotificationSystem />
        </div>

        {/* Menú de Usuario */}
        <div className="user-menu-container">
          <button 
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.nombre} {user?.apellidos}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <FaChevronDown className={`chevron ${showUserMenu ? 'open' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="user-menu-dropdown">
              <div className="user-menu-header">
                <div className="user-avatar-large">
                  <FaUser />
                </div>
                <div className="user-details">
                  <h4>{user?.nombre} {user?.apellidos}</h4>
                  <p>{user?.email}</p>
                  <span className="user-role">
                    {user?.rol === 'admin' ? 'Administrador' : 
                     user?.rol === 'usuario' ? 'Usuario' : 
                     user?.rol === 'moderador' ? 'Moderador' : user?.rol}
                  </span>
                </div>
              </div>
              
              <div className="user-menu-divider"></div>
              
              <div className="user-menu-items">
                {userMenuItems.map((item, index) => (
                  <button
                    key={index}
                    className={`user-menu-item ${item.isDanger ? 'danger' : ''}`}
                    onClick={() => {
                      item.action();
                      setShowUserMenu(false);
                    }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar menú */}
      {showUserMenu && (
        <div 
          className="menu-overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default TopHeader;
