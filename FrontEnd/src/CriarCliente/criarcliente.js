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
  const horarioRef = useRef(null);
  const anotacaoRef = useRef(null);

  // Estado para armazenar passeadores e o passeador selecionado
  const [passeadores, setPasseadores] = useState([]);
  const [selectedPasseadorId, setSelectedPasseadorId] = useState("");
  const [pacote, setPacote] = useState(""); // Estado para o pacote selecionado

  // Função para buscar passeadores do backend
  useEffect(() => {
    const fetchPasseadores = async () => {
      try {
        const response = await axios.get('http://localhost:3001/passeadores');
        if (response.data.success && Array.isArray(response.data.passeadores)) {
          setPasseadores(response.data.passeadores);
        } else {
          console.error('Erro: Formato de resposta inválido.', response.data);
          setPasseadores([]); // Garante que será um array vazio em caso de erro
        }
      } catch (error) {
        console.error('Erro ao buscar passeadores:', error);
        setPasseadores([]); // Garante que será um array vazio em caso de falha
      }
    };

    fetchPasseadores();
  }, []);

  // Função para lidar com a criação do cliente
  const handleCreate = async (e) => {
    e.preventDefault();
  
    // Captura os valores dos inputs
    const nome = nomeRef.current.value;
    const email = emailRef.current.value;
    const cpf = cpfRef.current.value;
    const telefone = telefoneRef.current.value;
    const endereco = enderecoRef.current.value;
    const pacoteSelecionado = pacote; // Captura o pacote selecionado
    const horario = horarioRef.current.value;
    const anotacao = anotacaoRef.current.value;
    const caes = caesRef.current.value.split(',').map((cao) => cao.trim());
    const id_passeador = selectedPasseadorId;
  
    try {
      // Envia os dados para o backend
      const response = await axios.post('http://localhost:3001/criarcliente', {
        nome,
        email,
        cpf,
        telefone,
        endereco,
        pacote: pacoteSelecionado,
        horario,
        anotacao,
        caes,
        id_passeador, // Inclui o ID do passeador
      });
  
      if (response.data.success) {
        alert('Cliente criado com sucesso!');
        navigate("/clientes"); // Redireciona após criação
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
        <form className="client-form" onSubmit={handleCreate}>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              ref={nomeRef}
              type="text"
              placeholder="Nome do cliente"
              className="form-input"
            />
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="form-input"
            />
          </div>
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <input
              ref={cpfRef}
              type="text"
              placeholder="CPF"
              className="form-input"
            />
          </div>
          <div className="input-container">
            <FaDog className="input-icon" />
            <input
              ref={caesRef}
              type="text"
              placeholder="Cães (separados por vírgula)"
              className="form-input"
            />
          </div>
          <div className="input-container">
            <FaPhone className="input-icon" />
            <input
              ref={telefoneRef}
              type="tel"
              placeholder="Telefone"
              className="form-input"
            />
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <input
              ref={enderecoRef}
              type="text"
              placeholder="Endereço"
              className="form-input"
            />
          </div>
          <div className="input-container">
            <FaUserAlt className="input-icon" />
            <select
              className="form-input"
              value={selectedPasseadorId}
              onChange={(e) => setSelectedPasseadorId(e.target.value)}
            >
              <option value="">Selecione o Passeador</option>
              {Array.isArray(passeadores) &&
                passeadores.map((passeador) => (
                  <option key={passeador.id} value={passeador.id}>
                    {passeador.nome}
                  </option>
                ))}
            </select>
          </div>
          <div className="input-container">
            <FaCalendarAlt className="input-icon" />
            <select
              className="form-input"
              value={pacote}
              onChange={(e) => setPacote(e.target.value)}
            >
              <option value="">Selecione o Pacote</option>
              <option value="Semestral">Semestral</option>
              <option value="Mensal">Mensal</option>
            </select>
          </div>
          <div className="input-container">
            <FaClock className="input-icon" />
            <input
              ref={horarioRef}
              type="text"
              placeholder="Horário de passeio (HH:MM)"
              className="form-input"
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
              type="submit"
              className="create-button"
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