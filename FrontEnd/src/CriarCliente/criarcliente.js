import './criarcliente.css';
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaDog, FaPhone, FaHome, FaCalendarAlt, FaClock, FaBook } from "react-icons/fa";

function CriarCliente() {

  const navigate = useNavigate();

  // Referências para os inputs
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const caesRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);
  const pacoteRef = useRef(null);
  const horarioRef = useRef(null);
  const createButtonRef = useRef(null);
  const anotacaoRef = useRef(null);

  // Função para gerenciar a troca de foco
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previne a submissão do formulário ao pressionar Enter
      if (nextRef) {
        // Certifique-se de que o elemento existe antes de tentar focar
        if (typeof nextRef === 'string' && nextRef === 'create-button') {
          if (createButtonRef.current) {
            createButtonRef.current.focus(); // Foca no botão "Criar" se a referência existir
          }
        } else if (nextRef.current) {
          nextRef.current.focus(); // Foca no próximo input se a referência existir
        }
      }
    }
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      {/* Formulário de Criação de Cliente */}
      <div className="form-container">
        <form className="client-form">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              ref={nomeRef}
              type="text"
              placeholder="Nome do cliente"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, emailRef)} // Mover o foco para o próximo campo (email)
            />
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, cpfRef)}
            />
          </div>
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <input
              ref={cpfRef}
              type="text"
              placeholder="CPF"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, caesRef)}
            />
          </div>
          <div className="input-container">
            <FaDog className="input-icon" />
            <input
              ref={caesRef}
              type="text"
              placeholder="Cães"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, telefoneRef)}
            />
          </div>
          <div className="input-container">
            <FaPhone className="input-icon" />
            <input
              ref={telefoneRef}
              type="tel"
              placeholder="Telefone"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, enderecoRef)}
            />
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <input
              ref={enderecoRef}
              type="text"
              placeholder="Endereço"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, pacoteRef)}
            />
          </div>
          <div className="input-container">
            <FaCalendarAlt className="input-icon" />
            <input
              ref={pacoteRef}
              type="text"
              placeholder="Pacote"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, horarioRef)}
            />
          </div>
          <div className="input-container">
            <FaClock className="input-icon" />
            <input
              ref={horarioRef}
              type="text"
              placeholder="Horário de passeio"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, anotacaoRef)}
            />
          </div>
          <div className="input-container">
            <FaBook className="input-icon" />
            <textarea
                ref={anotacaoRef}
                placeholder="Anotações"
                className="form-textarea"
            />
          </div>


          {/* Botões */}
          <div className="button-group">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/clientes")}
            >
              Cancelar
            </button>
            <button
              ref={createButtonRef}
              type="submit"
              className="create-button"
              onClick={() => navigate("/clientes")}
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CriarCliente;
