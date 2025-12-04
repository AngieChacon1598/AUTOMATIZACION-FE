import React from 'react';

const StatusIndicator = ({ status, activeText = 'Activo', inactiveText = 'Inactivo' }) => {
  const isActive = status === 'A';
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '6px',
      color: isActive ? '#1E9E8B' : '#dc2626',
      fontWeight: '500'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: isActive ? '#1E9E8B' : '#dc2626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px'
      }}>
        {isActive ? '✓' : '✕'}
      </div>
      <span>{isActive ? activeText : inactiveText}</span>
    </div>
  );
};

export default StatusIndicator;
