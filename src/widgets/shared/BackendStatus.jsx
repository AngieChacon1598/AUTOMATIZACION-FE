import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaServer } from 'react-icons/fa';
import { checkBackendConnection, getBackendInfo } from '../../shared/backend.js';

const BackendStatus = ({ showDetails = false }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const [backendInfo, setBackendInfo] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);

  const checkConnection = async () => {
    setStatus('checking');
    setLastCheck(new Date());
    
    try {
      const isConnected = await checkBackendConnection();
      setStatus(isConnected ? 'connected' : 'disconnected');
      
      if (isConnected && showDetails) {
        const info = await getBackendInfo();
        setBackendInfo(info);
      }
    } catch (error) {
      console.error('Error checking backend connection:', error);
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Verificar conexión cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [showDetails]);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <FaSpinner className="animate-spin text-yellow-500" />;
      case 'connected':
        return <FaCheckCircle className="text-green-500" />;
      case 'disconnected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaServer className="text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Verificando conexión...';
      case 'connected':
        return 'Backend Python conectado';
      case 'disconnected':
        return 'Backend Python desconectado';
      default:
        return 'Estado desconocido';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      
      {showDetails && backendInfo && (
        <div className="ml-2 text-xs opacity-75">
          v{backendInfo.version || '1.0.0'}
        </div>
      )}
      
      {lastCheck && (
        <div className="ml-2 text-xs opacity-50">
          {lastCheck.toLocaleTimeString()}
        </div>
      )}
      
      <button
        onClick={checkConnection}
        className="ml-2 text-xs underline hover:no-underline opacity-75 hover:opacity-100"
        title="Verificar conexión"
      >
        Actualizar
      </button>
    </div>
  );
};

export default BackendStatus;
