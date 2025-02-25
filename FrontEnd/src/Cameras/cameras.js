import './cameras.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaLocationArrow, FaRegCommentAlt } from 'react-icons/fa';
import Chat from "./chat";
import Map from "./Map";

function Cameras({ onLogout }) {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  // Defina os horários desejados para abrir e fechar as câmeras (24h)
  // TÚLIO FAÇA COM QUE PUXE DO BANCO DE DADOS ESSES HORÁRIOS E IMPLEMENTE AQUI
  const openHour = 0;
  const openMinute = 6;
  const closeHour = 20;
  const closeMinute = 7;

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const showMap = () => setIsMapVisible(true);
  const hideMap = () => setIsMapVisible(false);

  const showChat = () => setIsChatVisible(true);
  const hideChat = () => setIsChatVisible(false);

  const handleLogout = () => {
    onLogout();
    hideModal();
    navigate('/');
  };

  const handleDadosClienteClick = () => {
    const idCliente = localStorage.getItem('id_cliente');
    if (idCliente) {
      navigate(`/dados-cliente/${idCliente}`);
    } else {
      console.error('ID do cliente não encontrado no localStorage.');
    }
  };  

  useEffect(() => {
    const checkCameraVisibility = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const isWithinTimeRange =
        (currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute)) &&
        (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute));

      setIsCameraVisible(isWithinTimeRange);
    };

    const intervalId = setInterval(checkCameraVisibility, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />

        <div className="tabbar-title" onClick={handleDadosClienteClick} style={{ cursor: 'pointer' }}>
          <img src="/user.svg" alt="Ícone do Usuário" className="user-icon" />
          Dados do Cliente
        </div>

        <img
        src="/Back.svg"
        alt="Ícone de voltar"
        className="back-icon"
        onClick={() => navigate("/")}
      />

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

      <div className="cameras-container">
        {isCameraVisible ? (
          <>
            <div className="camera-box">
              <video id="camera1" autoPlay playsInline></video>
              <p style={{ fontWeight: 'bold', color: 'white' }}>CAMERA 01</p>
            </div>
            <div className="camera-box">
              <video id="camera2" autoPlay playsInline></video>
              <p style={{ fontWeight: 'bold', color: 'white' }}>CAMERA 02</p>
            </div>

            <button className="location-button" onClick={showMap}>
              <FaLocationArrow size={20} />
            </button>

            <button className="chat-button" onClick={showChat}>
              <FaRegCommentAlt size={20} />
            </button>
          </>
        ) : (
          <p style={{ color: 'white' }}>As câmeras estarão disponíveis no horário programado.</p>
        )}
      </div>

      <Modal
        isOpen={isMapVisible}
        onRequestClose={hideMap}
        className="modal-map-container"
        overlayClassName="modal-map-overlay"
      >
        <Map onClose={hideMap} />
      </Modal>

      <Modal
        isOpen={isChatVisible}
        onRequestClose={hideChat}
        className="modal-chat-container"
        overlayClassName="modal-chat-overlay"
      >
        <Chat 
          userId={localStorage.getItem('id_cliente')} // ID do cliente logado
          receiverId={'id_passeador'}                // Substitua pelo ID do passeador correspondente
          onClose={hideChat} 
        />
      </Modal>



      <div className="footer-bar"></div>
    </div>
  );
}

export default Cameras;
