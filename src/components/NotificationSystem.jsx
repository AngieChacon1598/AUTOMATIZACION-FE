import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simular notificaciones del sistema
    const generateNotifications = () => {
      const newNotifications = [
        {
          id: 1,
          type: 'warning',
          title: 'Egresados sin información laboral',
          message: '15 egresados no tienen información de empleo actualizada',
          timestamp: new Date(),
          priority: 'high'
        },
        {
          id: 2,
          type: 'info',
          title: 'Nuevo reporte disponible',
          message: 'El reporte mensual de empleabilidad está listo',
          timestamp: new Date(Date.now() - 3600000),
          priority: 'medium'
        },
        {
          id: 3,
          type: 'success',
          title: 'Encuesta completada',
          message: 'María García completó la encuesta de seguimiento',
          timestamp: new Date(Date.now() - 7200000),
          priority: 'low'
        }
      ];
      setNotifications(newNotifications);
    };

    generateNotifications();
    
    // Actualizar notificaciones cada 5 minutos
    const interval = setInterval(generateNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle />;
      case 'success':
        return <FaCheckCircle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Ahora';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-system">
      <button 
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button 
                className="mark-all-read"
                onClick={() => {
                  setNotifications(prev => 
                    prev.map(notif => ({ ...notif, read: true }))
                  );
                }}
              >
                Marcar todas como leídas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
