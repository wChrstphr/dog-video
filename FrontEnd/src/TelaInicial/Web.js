import './Web.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";

function Web({ onLogout }) {
  const navigate = useNavigate();
  const [passeadores, setPasseadores] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const handleLogout = () => {
    onLogout();
    hideModal();
    navigate("/");
  };

  useEffect(() => {
    // Busca os passeadores do backend
    const fetchPasseadores = async () => {
      try {
        const response = await fetch('http://localhost:3001/passeadores');
        const data = await response.json();

        if (data.success) {
          setPasseadores(data.passeadores);
        } else {
          console.error('Erro ao buscar passeadores:', data.message);
        }
      } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
      }
    };

    fetchPasseadores();
  }, []);

  const handleDadosClienteClick = () => {
    navigate('/dados-cliente');
  };

  return (
    <div className="Web-Inicial">
      <header className="Web-header-inicial">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="tabbar-title" onClick={handleDadosClienteClick} style={{ cursor: 'pointer' }}>
          <img src="/user.svg" alt="Ícone do Usuário" className="user-icon" />
          <span className="tabbar-title-text">Dados do Cliente</span>
        </div>
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
          className="user-icon"
          onClick={showModal}
        />
      </header>

      <div className="footer-bar-inicial"></div>

      <div className="passeador-titulo-inicial">
        <img src="/Contents.svg" alt="Passeadores título" />
        <p className="passeador-texto-inicial">PASSEADORES</p>
      </div>

      {/* Seção dos Passeadores */}
      <div className="passeadores">
        {passeadores.map((passeador) => (
          <div className="passeador" key={passeador.id} onClick={() => navigate('/cameras')}>
            {passeador.imagem ? (
              <img src={passeador.imagem} alt={passeador.nome} className="passeador-foto" />
            ) : (
              <div className="placeholder">Sem Imagem</div>
            )}
            <p className="passeador-nome">{passeador.nome}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Web;