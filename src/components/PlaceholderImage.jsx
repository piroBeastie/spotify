import React from 'react';

const PlaceholderImage = ({ text, color = '#1DB954', width = 300, height = 300 }) => {
  const displayText = text && text.length > 20 ? text.substring(0, 20) + '...' : text;
  
  return (
    <div 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '10px',
        borderRadius: '4px'
      }}
    >
      {displayText || 'No Image'}
    </div>
  );
};

export default PlaceholderImage; 