import './visualizarpasseador.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaPhone, FaHome, FaCamera, FaUserAlt } from "react-icons/fa";

function VisualizarPasseador() {

  const navigate = useNavigate();

  // Estado para armazenar a imagem selecionada
  const [selectedImage, setSelectedImage] = useState(null);

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

      <img
        src="/Back.svg"
        alt="Ícone de voltar"
        className="back-icon"
        onClick={() => navigate("/passeadores")}
      />

      {/* Formulário de Visualização de Passeador */}
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
            <div
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
          </div>

          <div className="input-container">
            <FaUser className="input-icon" />
            <span className="form-input">Cléber</span>
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <span className="form-input">email@passeador.com</span>
          </div>
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <span className="form-input">000.000.000-00</span>
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
            <FaUserAlt className="input-icon" />
            <span className="form-input">Gabriel</span>
          </div>

          {/* Botão Editar */}
          <div className="button-group">
            <button
              type="button"
              className="edit-button"
              onClick={() => navigate("/editarpasseador")}
            >
              Editar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VisualizarPasseador;
