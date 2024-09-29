import './clientes.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal'; // Certifique-se de que o pacote 'react-modal' esteja instalado.

function Clientes() {
  const navigate = useNavigate();

  // Estado para controlar a visibilidade do modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  // Função para exibir o modal de confirmação
  const showModal = (cliente) => {
    setSelectedCliente(cliente);
    setIsModalVisible(true);
  };

  // Função para ocultar o modal
  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedCliente(null);
  };

  // Função para navegar para a tela de visualização de cliente
  const handleClientClick = (cliente) => {
    navigate(`/visualizarcliente`);
  };

  // Função de logout (pode ser substituída pela função de exclusão real)
  const handleDelete = () => {
    console.log("Cliente excluído:", selectedCliente);
    hideModal();
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <div className="header-icons">
        <div className="icon-container">
          <img src="/search.svg" alt="Ícone de busca" className="icon" />
        </div>
        <div className="icon-container" onClick={() => navigate('/criarcliente')}>
          <img src="/add.svg" alt="Ícone de adicionar" className="icon" />
        </div>
        <div className="icon-container">
          <img src="/filter.svg" alt="Ícone de filtro" className="icon" />
        </div>
      </div>

      <img
        src="/Back.svg"
        alt="Ícone de voltar"
        className="back-icon"
        onClick={() => navigate("/admin")}
      />

      <div className="client-list">
        {['cliente numero 1', 'cliente numero 2', 'cliente numero 3', 'cliente numero 4', 'cliente numero 6', 'cliente numero 7', 'cliente numero 8', 'cliente numero 9', 'cliente numero 10'].map((cliente, index) => (
          <div className="client-item" key={index}>
            <span onClick={() => handleClientClick(cliente)}>{cliente}</span>
            <button className="delete-button" onClick={() => showModal(cliente)}>
              <img src="/trash.svg" alt="Deletar" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={isModalVisible}
        onRequestClose={hideModal}
        className="modal-container"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <h2 className="modal-title">Deseja mesmo excluir este cliente?</h2>
          <div className="modal-buttons">
            <button className="modal-button no-button" onClick={hideModal}>
              Não
            </button>
            <button className="modal-button yes-button" onClick={handleDelete}>
              Sim
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Clientes;
