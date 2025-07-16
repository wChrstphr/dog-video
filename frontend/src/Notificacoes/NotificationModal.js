import React from 'react';
import Modal from 'react-modal';

function NotificationModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="notification-modal"
      overlayClassName="notification-overlay"
    >
      <div className="modal-content">
        <h2>Permitir Notificações</h2>
        <p>Permita notificações para receber atualizações importantes.</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  );
}

export default NotificationModal;
