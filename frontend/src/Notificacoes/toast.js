import React from 'react';
import './toast.css';

function Toast({ message, onClose }) {
  return (
    <div className="toast">
      <p>{message}</p>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
}

export default Toast;
