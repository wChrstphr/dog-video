import './cameras.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";

function Cameras({ onLogout }) {
  const navigate = useNavigate(); // Hook do React Router para navegação

  // Controle de estado do modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Função para mostrar o modal
  const showModal = () => setIsModalVisible(true);

  // Função para esconder o modal
  const hideModal = () => setIsModalVisible(false);

  // Função para efetuar o logout
  const handleLogout = () => {
    onLogout(); // Chama a função de logout recebida via props
    hideModal(); // Esconde o modal
    navigate("/"); // Redireciona para a página de login
  };

  // Função para navegar para a página de dados do cliente
  const handleDadosClienteClick = () => {
    navigate('/dados-cliente');
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />

        {/* Botão para acessar dados do cliente */}
        <div className="tabbar-title" onClick={handleDadosClienteClick} style={{ cursor: 'pointer' }}>
          <img src="/user.svg" alt="Ícone do Usuário" className="user-icon" />
          Dados do Cliente
        </div>

        {/* Modal de confirmação de logout */}
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

        {/* Botão de logout */}
        <img
          src="/logout.svg"
          alt="Ícone de logout"
          className="user-icon"
          onClick={showModal} // Exibe o modal ao clicar
        />
      </header>

      <div className="footer-bar"></div> {/* Barrinha inferior */}

      <img
        src="/Back.svg"
        alt="Ícone de voltar"
        className="back-icon"
        onClick={() => navigate("/Web")}
      />

    </div>
  );
}

export default Cameras;
