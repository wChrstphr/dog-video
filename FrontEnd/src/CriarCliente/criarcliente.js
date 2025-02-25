import './criarcliente.css';
import React, { useRef, useState, useEffect} from 'react';
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

  // Estados para armazenar erros de validação
  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const [horarioError, setHorarioError] = useState('');

  // Outros estados
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
        
      // Funções de validação
  const validateNome = (nome) => {
    if (!/^[A-Z][a-z]{1,}/.test(nome)) {
      setNomeError('O nome deve começar com letra maiúscula e ter pelo menos 2 caracteres');
      return false;
    }
    setNomeError('');
    return true;
  };

  const validateEmail = (email) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const formatCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cpf;
  };
  
  // Modifique a função validateCPF para usar o CPF formatado
  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
  
    // Verifica se o CPF tem 11 dígitos ou se todos os dígitos são iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      setCpfError('CPF inválido');
      return false;
    }
  
    // Calcula os dígitos verificadores
    const calcCheckDigit = (cpf, factor) => {
      let total = 0;
      for (let i = 0; i < factor - 1; i++) {
        total += parseInt(cpf[i]) * (factor - i);
      }
      const remainder = (total * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };
  
    const firstCheckDigit = calcCheckDigit(cpf, 10);
    const secondCheckDigit = calcCheckDigit(cpf, 11);
  
    // Verifica se os dígitos calculados correspondem aos dígitos verificadores informados
    if (
      firstCheckDigit !== parseInt(cpf[9]) ||
      secondCheckDigit !== parseInt(cpf[10])
    ) {
      setCpfError('CPF inválido');
      return false;
    }
  
    setCpfError('');
    return true;
  };
  

  const formatTelefone = (telefone) => {
    const cleaned = telefone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return telefone;
  };
  
  const validateTelefone = (telefone) => {
    const cleaned = telefone.replace(/\D/g, '');
    if (!/^\d{11}$/.test(cleaned)) {
      setTelefoneError('Telefone deve ter DDD e 9 dígitos');
      return false;
    }
    setTelefoneError('');
    return true;
  };
  

  const formatHorario = (horario) => {
    const cleaned = horario.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})$/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return horario;
  };
  
  const validateHorario = (horario) => {
    const cleaned = horario.replace(/\D/g, '');
    if (!/^([01]\d|2[0-3])([0-5]\d)$/.test(cleaned)) {
      setHorarioError('Horário inválido (use o formato HH:MM)');
      return false;
    }
    setHorarioError('');
    return true;
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
    const pacoteSelecionado = pacote; // Captura o pacote selecionado
    const horario = horarioRef.current.value;
    const anotacao = anotacaoRef.current.value;
    const caes = caesRef.current.value.split(',').map((cao) => cao.trim());
    const id_passeador = selectedPasseadorId;
  
    // Validar todos os campos
    const isNomeValid = validateNome(nome);
    const isEmailValid = validateEmail(email);
    const isCPFValid = validateCPF(cpf);
    const isTelefoneValid = validateTelefone(telefone);
    const isHorarioValid = validateHorario(horario);

    if (!isNomeValid || !isEmailValid || !isCPFValid || !isTelefoneValid || !isHorarioValid) {
      alert('Por favor, corrija os erros destacados antes de enviar.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/criarcliente', {
        nome,
        email,
        cpf,
        telefone,
        endereco,
        pacote: pacoteSelecionado, // Mantemos a nomenclatura da main
        horario,
        anotacao,
        caes,
        id_passeador,
      });

      if (response.data.success) {
        alert('Cliente criado com sucesso!');
        navigate("/clientes");
      } else {
        alert('Erro ao criar cliente: ' + (response.data.message || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="Web-Criar-Cliente">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <div className="form-container">
        <form className="client-form" onSubmit={handleCreate}>
        <div className="input-container">
          <FaUser className="input-icon" />
          <input
            ref={nomeRef}
            type="text"
            placeholder="Nome do cliente"
            className="form-input"
            onChange={(e) => validateNome(e.target.value)}
          />
        </div>
        {nomeError && <div className="error-message">{nomeError}</div>}
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="form-input"
              onChange={(e) => validateEmail(e.target.value)}
            />
            </div>
            {emailError && <div className="error-message">{emailError}</div>}
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <input
              ref={cpfRef}
              type="text"
              placeholder="CPF"
              className="form-input"
              onChange={(e) => {
                const formatted = formatCPF(e.target.value);
                e.target.value = formatted;
                validateCPF(formatted);
              }}
            />
            </div>
            {cpfError && <div className="error-message">{cpfError}</div>}
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
              onChange={(e) => {
                const formatted = formatTelefone(e.target.value);
                e.target.value = formatted;
                validateTelefone(formatted);
              }}
            />
            </div>
            {telefoneError && <div className="error-message">{telefoneError}</div>}
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
              onChange={(e) => {
                const formatted = formatHorario(e.target.value);
                e.target.value = formatted;
                validateHorario(formatted);
              }}
            />
            </div>
            {horarioError && <div className="error-message">{horarioError}</div>}
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