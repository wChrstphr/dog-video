import './passeadores.css';
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

function Passeadores() {
  const navigate = useNavigate();

  // Estado para controlar a visibilidade do modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPasseador, setSelectedPasseador] = useState(null);

  // Estado para controlar a visibilidade do campo de busca
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [busca, setBusca] = useState('');

  // Estado para controlar a direção da ordenação (A-Z ou Z-A)
  const [sortDirection, setSortDirection] = useState('asc');

  // Estado para controlar a visibilidade do menu de filtro
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);

  // Referência para o campo de busca
  const searchInputRef = useRef(null);

  // Função para exibir o modal de confirmação
  const showModal = (passeador) => {
    setSelectedPasseador(passeador);
    setIsModalVisible(true);
  };

  // Função para ocultar o modal
  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedPasseador(null);
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
    setIsFilterMenuVisible(false); // Fechar o menu após selecionar uma opção
  };

  // Função para navegar para a tela de visualização de passeador
  const handlePasseadorClick = (passeador) => {
    navigate(`/visualizarpasseador`); // Redireciona para a página de visualização
  };

  // Função de exclusão
  const handleDelete = () => {
    console.log("Passeador excluído:", selectedPasseador);
    hideModal();
  };

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Função para filtrar e ordenar os passeadores
  const passeadoresFiltrados = useMemo(() => {
    const passeadores = [
      'Cleiton',
      'José',
      'João Vitor',
      'Luís',
      'Fabiana',
      'Claudia',
      'Marcos',
      'Wellington',
      'Wesley',
    ];

    const normalizedBusca = normalizeText(busca);

    // Filtrar passeadores com base na busca, normalizando para remover acentos
    const filteredPasseadores = passeadores.filter((passeador) =>
      normalizeText(passeador).includes(normalizedBusca)
    );

    // Ordenar passeadores com base na direção da ordenação
    return filteredPasseadores.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.localeCompare(b); // Ordem A-Z
      } else {
        return b.localeCompare(a); // Ordem Z-A
      }
    });
  }, [busca, sortDirection]);

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
        <div className="icon-container" onClick={() => navigate('/criarpasseador')}>
          <img src="/add.svg" alt="Ícone de adicionar" className="icon" />
        </div>
        <div className="icon-container" onClick={toggleFilterMenu}>
          <img src="/filter.svg" alt="Ícone de filtro" className="icon" />
        </div>
      </div>

      {/* Campo de busca que aparece quando o ícone de busca é clicado */}
      {isSearchVisible && (
        <div className="search-bar">
          <input
            type="text"
            value={busca}
            ref={searchInputRef} // Ref para o campo de pesquisa
            onChange={(ev) => setBusca(ev.target.value)}
            placeholder="Pesquisar passeador"
            className="search-input"
          />
        </div>
      )}

      {/* Menu de filtro que aparece quando o ícone de filtro é clicado */}
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

      <div className="passeador-list">
        {passeadoresFiltrados.map((passeador, index) => (
          <div className="passeador-item" key={index}>
            <span onClick={() => handlePasseadorClick(passeador)}>{passeador}</span>
            <button className="delete-button" onClick={() => showModal(passeador)}>
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
