import './criarcliente.css';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaUser, FaEnvelope, FaAddressCard, FaDog, FaPhone, FaHome, FaCalendarAlt, FaClock, FaBook, FaUserAlt } from "react-icons/fa";

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

  // Estado para armazenar passeadores e o passeador selecionado
  const [passeadores, setPasseadores] = useState([]);
  const [selectedPasseadorId, setSelectedPasseadorId] = useState("");

  // Função para buscar passeadores do backend
  useEffect(() => {
    const fetchPasseadores = async () => {
      try {
        const response = await axios.get('http://localhost:3001/passeadores');
        setPasseadores(response.data);
      } catch (error) {
        console.error('Erro ao buscar passeadores:', error);
      }
    };

    fetchPasseadores();
  }, []);

  // Função para gerenciar a troca de foco
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  // Função para lidar com a criação do cliente
  const handleCreate = async (e) => {
    e.preventDefault();

    // Captura os valores dos inputs
    const nome = nomeRef.current.value;
    const email = emailRef.current.value;
    const cpf = cpfRef.current.value;
    const telefone = telefoneRef.current.value;
    const endereco = enderecoRef.current.value;
    const pacote = pacoteRef.current.value;
    const horario = horarioRef.current.value;
    const anotacao = anotacaoRef.current.value;
    const caes = caesRef.current.value.split(',').map(cao => cao.trim());

    try {
      // Envia os dados para o backend
      const response = await axios.post('http://localhost:3001/criarcliente', {
        nome,
        email,
        cpf,
        telefone,
        endereco,
        pacote,
        horario,
        anotacao,
        caes,
        id_passeador: selectedPasseadorId // Enviar o ID do passeador selecionado
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
    <div className="Web-Criar-Cliente">
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
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
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
            <FaUserAlt className="input-icon" />
            <select
              className="form-input"
              value={selectedPasseadorId}
              onChange={(e) => setSelectedPasseadorId(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, pacoteRef)}
            >
              <option value="">Selecione o Passeador</option>
              {passeadores.map((passeador) => (
                <option key={passeador.id_passeador} value={passeador.id_passeador}>
                  {passeador.nome}
                </option>
              ))}
            </select>
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