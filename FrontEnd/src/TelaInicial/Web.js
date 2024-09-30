import './Web.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";

function Web({onLogout}) {
  const navigate = useNavigate(); // Hook do React Router para navegar
  const [passeadores, setPasseadores] = useState([
    { id: 1, nome: 'Passeador 1', imagem: '/passeador1.jpeg', existe: false },
    { id: 2, nome: 'Passeador 2', imagem: '/passeador2.jpeg', existe: false },
    { id: 3, nome: 'Passeador 3', imagem: '/passeador3.jpeg', existe: false },
    { id: 4, nome: 'Passeador 4', imagem: '/passeador4.jpeg', existe: false },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);
  const handleLogout = () => {
    onLogout(); // Chama a função de logout
    hideModal(); // Esconde o modal
    navigate("/"); // Redireciona para a página de login
  };
  
  useEffect(() => {
    // Verifica se as imagens dos passeadores existem
    passeadores.forEach((passeador, index) => {
      const img = new Image();
      img.src = passeador.imagem;
      img.onload = () => {
        setPasseadores((prev) => {
          const newPasseadores = [...prev];
          newPasseadores[index].existe = true;
          return newPasseadores;
        });
      };
      img.onerror = () => {
        console.log(`Imagem do ${passeador.nome} não encontrada.`);
      };
    });
  }, [passeadores]);

  // const handlePasseadorClick = (id) => {
  //   // Redireciona para a página do passeador com base no id
  //   window.location.href = `/passeador/${id}`;
  // };

  const handleDadosClienteClick = () => {
    // Redireciona para a página de dados do cliente
    navigate('/dados-cliente');
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="tabbar-title" onClick={handleDadosClienteClick} style={{ cursor: 'pointer' }}>
          <img src="/user.svg" alt="Ícone do Usuário" className="user-icon" />
          Dados do Cliente
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
          onClick={showModal} // Exibe o modal ao clicar
        />
      </header>

      <div className="footer-bar"></div> {/* Barrinha inferior */}

      <div className="passeador-titulo">
        <img src="/passeadores.svg" alt="Passeadores título" />
      <p className="passeador-texto">PASSEADORES</p>
      </div>


      {/* Seção dos Passeadores */}
      <div className="passeadores">
        {passeadores.map((passeador) =>
          passeador.existe ? (
            <div className="passeador" key={passeador.id} onClick={() => navigate('/cameras')}>
              <img src={passeador.imagem} alt={passeador.nome} className="passeador-foto" />
              <p className="passeador-nome">{passeador.nome}</p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default Web;
