import './admin.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

function Admin({ onLogout }) {
    const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);
  const handleLogout = () => {
    onLogout(); // Chama a função de logout
    hideModal(); // Esconde o modal
    navigate("/"); // Redireciona para a página de login
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />

        <Modal
          isOpen={isModalVisible}
          onRequestClose={hideModal}
          className="modal-container"
          overlayClassName="modal-overlay"
          ariaHideApp={false}
        >
          <div className="modal-content">
            <h2 className="modal-title">Deseja mesmo sair do site?</h2>
            <div className="modal-buttons">
              <button className="modal-button no-button" onClick={hideModal}>
                Não
              </button>
              <button className="modal-button yes-button" onClick={handleLogout}>
                Sim
              </button>
            </div>
          </div>
        </Modal>

        <img
          src="/logout.svg"
          alt="Ícone de logout"
          className="logout"
          onClick={showModal}
        />

      </header>
      <div className="footer-bar"></div>

      <div className="admin-container">
        <h1 className="admin-title">Admin</h1>
        <div className="admin-options">
          <button className="admin-option" onClick={() => navigate('/clientes')}>
            <img src="/icon-clientes.svg" alt="Clientes Icone" className="icon" />
            <span>Clientes</span>
          </button>
          <button className="admin-option" onClick={() => navigate('/passeadores')}>
            <img src="/icon-passeadores.svg" alt="Passeadores Icone" className="icon" />
            <span>Passeadores</span>
          </button>
          <button className="admin-option" onClick={() => navigate('')}>
            <img src="/icon-backups.svg" alt="Backups Icone" className="icon" />
            <span>Backups</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
