import "./dados.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

function Dados({ onLogout }) {
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
    <div className="Dados">
      <header className="Web-header">
        {/* Modal para confirmar logout */}
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
          src="/Back.svg"
          alt="Ícone de voltar"
          className="back-icon"
          onClick={() => navigate("/")}
        />
        <img
          src="/logotipo.svg"
          className="Web-logotipo"
          alt="Dogvideo Logotipo"
        />
        <img
          src="/logout.svg"
          alt="Ícone de logout"
          className="user-icon"
          onClick={showModal}
        />
        <div className="footer-bar"></div>
      </header>

      <main className="Main-content">
        <h1>Nome Completo</h1>

        {/* Primeira linha de cards */}
        <div className="Dados-grid">
          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">CACHORRO</div>
            </div>
            <div className="Card-content">
              <ul>
                <li>Cachorro1</li>
                <li>Cachorro2</li>
                <li>Cachorro3</li>
              </ul>
            </div>
          </div>

          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">ASSINATURA</div>
            </div>
            <div className="Card-content">Plano</div>
          </div>

          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">HORÁRIO</div>
            </div>
            <div className="Card-content">
              <ul>
                <li>08 - 08:45 hrs</li>
                <li>Segunda a sexta</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Segunda linha de cards */}
        <div className="Dados-grid">
          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">PESSOAL</div>
            </div>
            <div className="Card-content">
              <ul>
                <li>cliente@gmail.com</li>
                <li>CPF: 000.000.000-00</li>
                <li>(61) 9999-99999</li>
              </ul>
            </div>
          </div>

          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">PASSEADOR</div>
            </div>
            <div className="Card-content">Passeador 1</div>
          </div>

          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">ENDEREÇO</div>
            </div>
            <div className="Card-content">
              Rua das Laranjaeiras apt. 1003 Torre 07 Residencial DogVideo
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dados;
