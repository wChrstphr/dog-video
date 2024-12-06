import './criarpasseador.css';
import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaUser, FaEnvelope, FaAddressCard, FaPhone, FaHome, FaCamera, FaUserAlt } from "react-icons/fa";

function CriarPasseador() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);
  const clientesRef = useRef(null);
  const createButtonRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef) {
        if (typeof nextRef === 'string' && nextRef === 'create-button') {
          if (createButtonRef.current) createButtonRef.current.focus();
        } else if (nextRef.current) {
          nextRef.current.focus();
        }
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const isNomeValido = (nome) => /^[A-Z][a-zA-Z\s]*$/.test(nome);
  const isTelefoneValido = (telefone) => /^[0-9]{11}$/.test(telefone);
  const isCpfValido = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
  };
  const isEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCreate = async (e) => {
    e.preventDefault();
    const nome = nomeRef.current.value;
    const email = emailRef.current.value;
    const cpf = cpfRef.current.value;
    const telefone = telefoneRef.current.value;
    const endereco = enderecoRef.current.value;
    const clientes = clientesRef.current.value.split(',').map(cliente => cliente.trim());

    const newErrors = {};
    if (!isNomeValido(nome)) newErrors.nome = "Nome deve começar com letra maiúscula e conter apenas letras.";
    if (!isEmailValido(email)) newErrors.email = "E-mail inválido.";
    if (!isCpfValido(cpf)) newErrors.cpf = "CPF inválido.";
    if (!isTelefoneValido(telefone)) newErrors.telefone = "Telefone deve ter 11 dígitos.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await axios.post('http://localhost:3001/criarpasseador', {
        nome,
        email,
        cpf,
        telefone,
        endereco,
        clientes,
        imagem: selectedImage
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/passeadores");
      } else {
        alert('Erro ao criar passeador.');
      }
    } catch (error) {
      console.error('Erro ao criar passeador:', error);
      alert('Erro ao criar passeador.');
    }
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <div className="form-container">
        <form className="passeador-form">
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

          <div className="form-group">
            <div className="input-container">
              <FaUser className="input-icon" />
              <input
                ref={nomeRef}
                type="text"
                placeholder="Nome do passeador"
                className="form-input"
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
              />
            </div>
            {errors.nome && <p className="error">{errors.nome}</p>}
          </div>

          <div className="form-group">
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
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
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
            {errors.cpf && <p className="error">{errors.cpf}</p>}
          </div>

          <div className="form-group">
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
              {errors.telefone && <p className="error">{errors.telefone}</p>}
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
              placeholder="Clientes (separados por vírgula)"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, 'create-button')}
            />
          </div>

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
              onClick={handleCreate}
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