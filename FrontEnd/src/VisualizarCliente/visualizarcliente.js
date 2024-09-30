import './visualizarcliente.css';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaDog, FaPhone, FaHome, FaCalendarAlt, FaClock, FaBook } from "react-icons/fa";

function VisualizarCliente() {

  const navigate = useNavigate();

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <img
        src="/Back.svg"
        alt="Ícone de voltar"
        className="back-icon"
        onClick={() => navigate("/clientes")}
      />

      {/* Formulário de Visualização de Cliente */}
      <div className="form-container">
        <div className="client-form">
          <div className="input-container">
            <FaUser className="input-icon" />
            <span className="form-input">Nome do cliente</span>
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <span className="form-input">email@cliente.com</span>
          </div>
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <span className="form-input">000.000.000-00</span>
          </div>
          <div className="input-container">
            <FaDog className="input-icon" />
            <span className="form-input">Cachorro 1, Cachorro 2</span>
          </div>
          <div className="input-container">
            <FaPhone className="input-icon" />
            <span className="form-input">(11) 90000-0000</span>
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <span className="form-input">Rua Exemplo, 123</span>
          </div>
          <div className="input-container">
            <FaCalendarAlt className="input-icon" />
            <span className="form-input">Pacote Especial</span>
          </div>
          <div className="input-container">
            <FaClock className="input-icon" />
            <span className="form-input">08:00 - 09:00</span>
          </div>
          <div className="input-container">
            <FaBook className="input-icon" />
            <span className="form-textarea">Anotações sobre o cliente...</span>
          </div>

          {/* Botão Editar */}
          <div className="button-group">
            <button
              type="button"
              className="edit-button"
              onClick={() => navigate("/editarcliente")}
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisualizarCliente;
