import './clientes.css';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import axios from 'axios';

function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);

  // Estado para controlar a visibilidade do modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  // Estado para controlar a visibilidade do campo de busca
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [busca, setBusca] = useState('');

  // Estado para controlar a direção da ordenação (A-Z ou Z-A)
  const [sortDirection, setSortDirection] = useState('asc');

  // Estado para controlar a visibilidade do menu de filtro
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);

  // Referência para o campo de busca
  const searchInputRef = useRef(null);

  // Função para buscar os clientes do banco de dados
  useEffect(() => {
    axios.get('http://localhost:3001/clientes')
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
      });
  }, []);

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

  // Função para alternar a visibilidade do campo de pesquisa
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus(); // Focar no campo de pesquisa
      }
    }, 0); // Garantir que a visibilidade seja atualizada antes de focar
  };

  // Função para alternar a visibilidade do menu de filtro
  const toggleFilterMenu = () => {
    setIsFilterMenuVisible(!isFilterMenuVisible);
  };

  // Função para definir a direção da ordenação
  const handleSort = (direction) => {
    setSortDirection(direction);
    setIsFilterMenuVisible(false);
  };

  // Função para navegar para a tela de visualização de cliente
  const handleClientClick = (cliente) => {
    navigate(`/visualizarcliente/${cliente.id_cliente}`);
  };

  // Função de exclusão
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/clientes/${selectedCliente.id_cliente}`);
      if (response.data.success) {
        // Atualiza a lista de clientes após a exclusão
        setClientes(clientes.filter(cliente => cliente.id_cliente !== selectedCliente.id_cliente));
        hideModal();
      } else {
        alert('Erro ao excluir cliente.');
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente.');
    }
  };

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const clientesFiltrados = useMemo(() => {
    const normalizedBusca = normalizeText(busca);
    const filteredClientes = clientes.filter((cliente) =>
      normalizeText(cliente.nome).includes(normalizedBusca)
    );
    return filteredClientes.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.nome.localeCompare(b.nome);
      } else {
        return b.nome.localeCompare(a.nome);
      }
    });
  }, [clientes, busca, sortDirection]);

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <div className="header-icons">
        <div className="icon-container" onClick={toggleSearch}>
          <img src="/search.svg" alt="Ícone de busca" className="icon" />
        </div>
        <div className="icon-container" onClick={() => navigate('/criarcliente')}>
          <img src="/add.svg" alt="Ícone de adicionar" className="icon" />
        </div>
        <div className="icon-container" onClick={toggleFilterMenu}>
          <img src="/filter.svg" alt="Ícone de filtro" className="icon" />
        </div>
      </div>

      {isSearchVisible && (
        <div className="search-bar">
          <input
            type="text"
            value={busca}
            ref={searchInputRef}
            onChange={(ev) => setBusca(ev.target.value)}
            placeholder="Pesquisar cliente"
            className="search-input"
          />
        </div>
      )}

      {isFilterMenuVisible && (
        <div className="filter-menu">
          <button onClick={() => handleSort('asc')} className="filter-button">
            Ordenar A-Z
          </button>
          <button onClick={() => handleSort('desc')} className="filter-button">
            Ordenar Z-A
          </button>
        </div>
      )}

      <img
        src="/Back.svg"
        alt="Ícone de voltar"
        className="back-icon"
        onClick={() => navigate("/admin")}
      />

      <div className="client-list">
        {clientesFiltrados.map((cliente) => (
          <div className="client-item" key={cliente.id_cliente}>
            <span onClick={() => handleClientClick(cliente)}>{cliente.nome}</span>
            <button className="delete-button" onClick={() => showModal(cliente)}>
              <img src="/trash.svg" alt="Deletar" />
            </button>
          </div>
        ))}
      </div>

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