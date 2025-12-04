import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaListAlt,
  FaInfoCircle,
  FaFileAlt,
  FaBriefcase,
  FaTachometerAlt,
  FaSignOutAlt,
  FaCrown
} from 'react-icons/fa';
import { useAuth } from '../shared/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  // Función para obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!user?.nombre || !user?.apellidos) return 'U';
    const firstName = user.nombre.charAt(0).toUpperCase();
    const lastName = user.apellidos.charAt(0).toUpperCase();
    return firstName + lastName;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-user">
        <div className="user-avatar">
          <div className="avatar-circle">
            <div className="avatar-initials">
              {getUserInitials()}
            </div>
            {isAdmin() && (
              <div className="admin-crown">
                <FaCrown />
              </div>
            )}
          </div>
        </div>
        <div className="user-info">
          <h3 className="user-name">{user?.nombre} {user?.apellidos}</h3>
          <p className="user-email">{user?.email}</p>
          <div className={`user-role-badge ${isAdmin() ? 'admin' : 'user'}`}>
            {isAdmin() ? 'ADMINISTRADOR' : 'USUARIO'}
          </div>
        </div>
      </div>
      <ul>
        <li>
          <Link to="/dashboard">
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/egresados">
            <FaListAlt /> Egresados
          </Link>
        </li>
        <li>
          <Link to="/detalles">
            <FaInfoCircle /> Detalles de Egresados
          </Link>
        </li>
        <li>
          <Link to="/empresas">
            <FaBriefcase /> Centro Laboral
          </Link>
        </li>
        <li>
          <Link to="/analytics">
            <FaFileAlt /> Reportes Detallados
          </Link>
        </li>
      </ul>
      
      {/* Botón de logout al final */}
      <div className="sidebar-footer">
        <button 
          className="logout-btn-bottom"
          onClick={logout}
          title="Cerrar sesión"
        >
          <FaSignOutAlt />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
