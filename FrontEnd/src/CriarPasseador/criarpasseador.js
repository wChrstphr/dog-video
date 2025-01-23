import './criarpasseador.css';
import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaPhone, FaHome, FaCamera } from "react-icons/fa";

function CriarPasseador() {
  const navigate = useNavigate();

  // Referências para os inputs
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);

  // Estado para armazenar a imagem em base64
  const [selectedImage, setSelectedImage] = useState(null);

  // Função para lidar com a seleção de imagem
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Define a imagem em base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para enviar os dados para criação do passeador
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPasseador = {
      nome: nomeRef.current.value,
      email: emailRef.current.value,
      cpf: cpfRef.current.value,
      telefone: telefoneRef.current.value,
      endereco: enderecoRef.current.value,
      imagem: selectedImage,
    };

    try {
      const response = await fetch(`http://localhost:3001/criarpasseador`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPasseador),
      });

      if (response.ok) {
        navigate("/passeadores"); // Redireciona para a lista de passeadores
      } else {
        console.error('Erro ao criar passeador');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  return (
    <div className="Web-Criar-Passeador">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      {/* Formulário de Criação de Passeador */}
      <div className="form-container">
        <form className="passeador-form" onSubmit={handleSubmit}>

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
            <input ref={nomeRef} type="text" placeholder="Nome do passeador" className="form-input" />
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input ref={emailRef} type="email" placeholder="Email" className="form-input" />
          </div>
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <input ref={cpfRef} type="text" placeholder="CPF" className="form-input" />
          </div>
          <div className="input-container">
            <FaPhone className="input-icon" />
            <input ref={telefoneRef} type="tel" placeholder="Telefone" className="form-input" />
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <input ref={enderecoRef} type="text" placeholder="Endereço" className="form-input" />
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
            <button type="submit" className="create-button">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CriarPasseador;