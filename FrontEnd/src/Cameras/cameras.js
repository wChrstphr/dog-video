import './cameras.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaRegMap, FaRegCommentAlt } from 'react-icons/fa';
import MapComponent from './MapComponent';

function Cameras({ onLogout }) {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef(null);

  const openHour = 10;
  const openMinute = 32;
  const closeHour = 23;
  const closeMinute = 45;

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
    navigate('/dados-cliente');
  };

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:8080');
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    return () => socket.current.close();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() && socket.current) {
      socket.current.send(JSON.stringify({ message: newMessage }));
      setNewMessage('');
    }
  };

  useEffect(() => {
    const checkCameraVisibility = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const isWithinTimeRange = (currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute)) &&
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
        <Modal isOpen={isModalVisible} onRequestClose={hideModal} overlayClassName="modal-overlay" ariaHideApp={false}>
          <div className="modal-content">
            <h2 className="modal-title">Deseja mesmo sair do site?</h2>
            <div className="modal-buttons">
              <button className="modal-button no-button" onClick={hideModal}>Não</button>
              <button className="modal-button yes-button" onClick={handleLogout}>Sim</button>
            </div>
          </div>
        </Modal>
        <img src="/logout.svg" alt="Ícone de logout" className="user-icon" onClick={showModal} />
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
              <FaRegMap size={20} />
            </button>
            <button className="chat-button" onClick={showChat}>
              <FaRegCommentAlt size={20} />
            </button>
          </>
        ) : (
          <p style={{ color: 'white' }}>As câmeras estarão disponíveis no horário programado.</p>
        )}
      </div>
      {isMapVisible && (
        <div
          className="map-overlay"
          onClick={(e) => {
            if (e.target.className.includes('map-overlay')) hideMap();
          }}
        >
          <div className="map-content">
            <button className="close-button" onClick={hideMap}>
              X
            </button>
            <MapComponent />
          </div>
        </div>
      )}

      {isChatVisible && (
        <div
          className="chat-overlay"
          onClick={(e) => {
            if (e.target.className.includes('chat-overlay')) hideChat();
          }}
        >
          <div className="chat-content">
            <button className="close-button" onClick={hideChat}>
              X
            </button>
            <div className="chat-container">
              <div className="chat-header">
                <h2>Nome do Passeador</h2>
              </div>
              <div className="chat-body">
                {messages.map((msg, index) => (
                  <div key={index} className="message-container">
                    {msg.message}
                  </div>
                ))}
              </div>
              <div className="chat-footer">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Enviar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="footer-bar"></div>
    </div>
  );
}

export default Cameras;