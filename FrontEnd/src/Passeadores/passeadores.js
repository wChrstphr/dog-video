import './passeadores.css';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

function Passeadores() {
  const navigate = useNavigate();
  const [passeadores, setPasseadores] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPasseador, setSelectedPasseador] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [busca, setBusca] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const searchInputRef = useRef(null);
  const [clientes, setClientes] = useState([]);
  const [filtroCliente, setFiltroCliente] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [passeadoresResponse, clientesResponse] = await Promise.all([
          fetch('http://localhost:3001/passeadores'),
          fetch('http://localhost:3001/clientes')
        ]);
  
        const passeadoresData = await passeadoresResponse.json();
        const clientesData = await clientesResponse.json();
  
        if (passeadoresData.success && Array.isArray(passeadoresData.passeadores)) {
          setPasseadores(passeadoresData.passeadores);
        } else {
          console.error('Erro ao buscar passeadores: Resposta inesperada', passeadoresData);
          setPasseadores([]);
        }
  
        if (clientesData.success && Array.isArray(clientesData.clientes)) {
          setClientes(clientesData.clientes);
        } else {
          console.error('Erro ao buscar clientes: Resposta inesperada', clientesData);
          setClientes([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setPasseadores([]);
        setClientes([]);
      }
    };
  
    fetchData();
  }, []);
  

  const showModal = (passeador) => {
    setSelectedPasseador(passeador);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedPasseador(null);
  };

  const handleDelete = async () => {
    if (!selectedPasseador) return;
  
    try {
      const response = await fetch(`http://localhost:3001/passeadores/${selectedPasseador.id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setPasseadores(passeadores.filter(p => p.id !== selectedPasseador.id));
        hideModal();
      } else {
        console.error('Erro ao excluir passeador');
      }
    } catch (error) {
      console.error('Erro ao excluir passeador:', error);
    }
  };
  

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuVisible(!isFilterMenuVisible);
  };

  const handleSort = (direction) => {
    setSortDirection(direction);
    setIsFilterMenuVisible(false);
  };

  const handlePasseadorClick = (id) => {
    navigate(`/visualizarpasseador/${id}`);
  };

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const passeadoresFiltrados = useMemo(() => {
    const normalizedBusca = normalizeText(busca);
    return passeadores
      .filter((passeador) => {
        const passaFiltroNome = normalizeText(passeador.nome).includes(normalizedBusca);
        const passaFiltroCliente =
          filtroCliente === '' ||
          clientes.some((cliente) => cliente.id_passeador === passeador.id && cliente.id_cliente.toString() === filtroCliente);
  
        return passaFiltroNome && passaFiltroCliente;
      })
      .sort((a, b) => {
        if (sortDirection === 'asc') {
          return a.nome.localeCompare(b.nome);
        } else {
          return b.nome.localeCompare(a.nome);
        }
      });
  }, [busca, sortDirection, passeadores, filtroCliente, clientes]);  

  return (
    <div className="Web-Passeador">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <div className="header-icons">
        <div className="icon-container" onClick={toggleSearch}>
          <img src="/search.svg" alt="Ícone de busca" className="icon" />
        </div>
        <div className="icon-container" onClick={() => navigate('/criarpasseador')}>
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
            placeholder="Pesquisar passeador"
            className="search-input"
          />
        </div>
      )}

      {isFilterMenuVisible && (
        <div className="filter-menu">
          <button onClick={() => handleSort('asc')} className="filter-button">
            Ordenar A-Z
          </button>
          <div className="filter-divider"></div>
          <button onClick={() => handleSort('desc')} className="filter-button">
            Ordenar Z-A
          </button>
          <div className="filter-divider"></div>
          <select
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            className="filter-select"
          >
            <option value="">Clientes</option>
            {clientes.map((cliente) => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      <img
        src="/Back.svg"
        alt="Ícone de voltar"
        className="back-icon"
        onClick={() => navigate("/admin")}
      />

      <div className="passeador-list">
        {passeadoresFiltrados.map((passeador) => (
          <div className="passeador-item" key={passeador.id}>
            <span onClick={() => handlePasseadorClick(passeador.id)}>
              {passeador.nome}
            </span>
            <button className="delete-button" onClick={() => showModal(passeador)}>
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
          <h2 className="modal-title">Deseja mesmo excluir este passeador?</h2>
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

export default Passeadores;