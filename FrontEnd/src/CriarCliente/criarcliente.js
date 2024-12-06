import './criarcliente.css';
import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaUser, FaEnvelope, FaAddressCard, FaDog, FaPhone, FaHome, FaCalendarAlt, FaClock, FaBook, FaUserAlt } from "react-icons/fa";

function CriarCliente() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const caesRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);
  const passeadorRef = useRef(null);
  const pacoteRef = useRef(null);
  const horarioRef = useRef(null);
  const createButtonRef = useRef(null);
  const anotacaoRef = useRef(null);

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

  const isNomeValido = (nome) => /^[A-Z][a-zA-Z\s]*$/.test(nome);
  const isTelefoneValido = (telefone) => /^[0-9]{10,11}$/.test(telefone);
  const isPasseadorValido = (passeador) => /^[A-Z][a-zA-Z\s]*$/.test(passeador);
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
  const isHorarioValido = (horario) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(horario);

  const handleCreate = async (e) => {
    e.preventDefault();

    const nome = nomeRef.current.value;
    const email = emailRef.current.value;
    const cpf = cpfRef.current.value;
    const telefone = telefoneRef.current.value;
    const endereco = enderecoRef.current.value;
    const passeador = passeadorRef.current.value;
    const pacote = pacoteRef.current.value;
    const horario = horarioRef.current.value;
    const anotacao = anotacaoRef.current.value;
    const caes = caesRef.current.value.split(',').map(cao => cao.trim());

    const newErrors = {};
    if (!isNomeValido(nome)) newErrors.nome = "Nome deve começar com letra maiúscula e conter apenas letras.";
    if (!isEmailValido(email)) newErrors.email = "E-mail inválido.";
    if (!isCpfValido(cpf)) newErrors.cpf = "CPF inválido.";
    if (!isTelefoneValido(telefone)) newErrors.telefone = "Telefone deve ter 10 ou 11 dígitos.";
    if (!isPasseadorValido(passeador)) newErrors.passeador = "Passeador deve começar com letra maiúscula e conter apenas letras.";
    if (!isHorarioValido(horario)) newErrors.horario = "Horário inválido. Use o formato HH:MM (24 horas).";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await axios.post('http://localhost:3001/criarcliente', {
        nome, email, cpf, telefone, endereco, passeador, pacote, horario, anotacao, caes
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/clientes");
      } else {
        alert('Erro ao criar cliente.');
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      alert('Erro ao criar cliente.');
    }
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <div className="form-container">
        <form className="client-form">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              ref={nomeRef}
              type="text"
              placeholder="Nome do cliente"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
            />
            {errors.nome && <p className="error">{errors.nome}</p>}
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
            {errors.email && <p className="error">{errors.email}</p>}
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
            {errors.cpf && <p className="error">{errors.cpf}</p>}
          </div>
          <div className="input-container">
            <FaDog className="input-icon" />
            <input
              ref={caesRef}
              type="text"
              placeholder="Cães (separados por vírgula)"
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
            {errors.telefone && <p className="error">{errors.telefone}</p>}
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <input
              ref={enderecoRef}
              type="text"
              placeholder="Endereço"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, passeadorRef)}
            />
          </div>
          <div className="input-container">
            <FaUserAlt className="input-icon" />
            <input
              ref={passeadorRef}
              type="text"
              placeholder="Passeador"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, pacoteRef)}
            />
            {errors.passeador && <p className="error">{errors.passeador}</p>}
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
              placeholder="Horário de passeio (HH:MM)"
              className="form-input"
              onKeyDown={(e) => handleKeyDown(e, anotacaoRef)}
            />
            {errors.horario && <p className="error">{errors.horario}</p>}
          </div>
          <div className="input-container">
            <FaBook className="input-icon" />
            <textarea
              ref={anotacaoRef}
              placeholder="Anotações"
              className="form-textarea"
            />
          </div>

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

export default CriarCliente;
