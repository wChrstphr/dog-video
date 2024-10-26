import './criarpasseador.css';
import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaPhone, FaHome, FaCamera, FaUserAlt } from "react-icons/fa";

function CriarPasseador() {

  const navigate = useNavigate();

  // Referências para os inputs
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);
  const clientesRef = useRef(null);
  const createButtonRef = useRef(null);

  // Estado para armazenar a imagem selecionada
  const [selectedImage, setSelectedImage] = useState(null);

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

  // Função para lidar com a seleção de imagem
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      {/* Formulário de Criação de Passeador */}
      <div className="form-container">
        <form className="passeador-form">

          {/* Campo de seleção de imagem */}
          <div className="image-container">
            <label htmlFor="image-upload" className="image-upload-label">
              {selectedImage ? (
                <img src={selectedImage} alt="Imagem Selecionada" className="image-preview" />
              ) : (
                <div className="placeholder-container">
                  <FaCamera className="camera-icon" />
                </div>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
          </div>

          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              ref={nomeRef}
              type="text"
              placeholder="Nome do passeador"
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
              onKeyDown={(e) => handleKeyDown(e, clientesRef)}
            />
          </div>
          <div className="input-container">
            <FaUserAlt className="input-icon" />
            <input
              ref={clientesRef}
              type="text"
              placeholder="Clientes"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, null)}
            />
          </div>

          {/* Botões */}
          <div className="button-group">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/passeadores")}
            >
              Cancelar
            </button>
            <button
              ref={createButtonRef}
              type="submit"
              className="create-button"
              onClick={() => navigate("/passeadores")}
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CriarPasseador;
