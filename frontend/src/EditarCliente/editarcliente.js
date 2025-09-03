import './editarcliente.css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaDog, FaPhone, FaHome, FaCalendarAlt, FaClock, FaBook, FaUserAlt } from "react-icons/fa";
import CustomSelect from '../utils/CustomSelect';

function EditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams(); // Captura o ID da URL
  const [cliente, setCliente] = useState(null); // Armazena os dados do cliente
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento
  const [passeadores, setPasseadores] = useState([]); // Lista de passeadores
  const [selectedPasseadorId, setSelectedPasseadorId] = useState(""); // Passeador selecionado
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const caesRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);
  const horarioRef = useRef(null);
  const anotacaoRef = useRef(null);
  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const [horarioError, setHorarioError] = useState('');
  const [pacote, setPacote] = useState("");
  const [diasTeste, setDiasTeste] = useState("");

   // Formatando dados para o componente CustomSelect
  const passeadoresOptions = Array.isArray(passeadores)
  ? passeadores.map((p) => ({ value: p.id, label: p.nome }))
  : [];

  const pacoteOptions = [
    { value: 'Trimestral', label: 'Trimestral' },
    { value: 'Mensal', label: 'Mensal' },
    { value: 'Temporario', label: 'Temporário' },
  ];

  const validateNome = (nome) => {
    if (!/^[A-ZÀ-Ÿ][a-zà-ÿ]{1,}/.test(nome)) {
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

  const validateCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) {
      setCpfError('CPF inválido');
      return false;
    }
    setCpfError('');
    return true;
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

  const validateHorario = (horario) => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
      setHorarioError('Horário inválido (use o formato HH:MM)');
      return false;
    }
    setHorarioError('');
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

  const formatTelefone = (telefone) => {
    const cleaned = telefone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return telefone;
  };

  const formatHorario = (horario) => {
    const cleaned = horario.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})$/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return horario;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); 
  
    try {
      const response = await fetch(`http://localhost:3001/clientes/${id}/reset-senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Senha redefinida com sucesso!'); // Exibe um alerta
      } else {
        console.error('Erro ao resetar senha:', data.message);
        alert('Erro ao resetar senha.');
      }
    } catch (error) {
      console.error('Erro ao processar reset de senha:', error);
      alert('Erro ao processar reset de senha.');
    }
  };  

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`http://localhost:3001/clientes/${id}`);
        const data = await response.json();

        if (data.success && data.cliente) {
          setCliente(data.cliente);

          // Buscar o id_passeador a partir da tabela cachorros
          const passeadorResponse = await fetch(`http://localhost:3001/cachorros/${id}/passeador`);
          const passeadorData = await passeadorResponse.json();

          if (passeadorData.success && passeadorData.id_passeador) {
            setSelectedPasseadorId(passeadorData.id_passeador); // Define o passeador atual
            localStorage.setItem('passeadorId', passeadorData.id_passeador); // Salva o passeador localmente
          } else {
            setSelectedPasseadorId(""); // Nenhum passeador encontrado
            localStorage.removeItem('passeadorId'); // Remove o passeador localmente
          }
        } else {
          console.error('Erro: Cliente não encontrado ou resposta inesperada', data);
        }
      } catch (error) {
        console.error('Erro ao buscar cliente ou passeador:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPasseadores = async () => {
      try {
        const response = await fetch('http://localhost:3001/passeadores');
        const data = await response.json();

        if (data.success && Array.isArray(data.passeadores)) {
          setPasseadores(data.passeadores);
        } else {
          console.error('Erro ao buscar passeadores ou resposta inesperada', data);
        }
      } catch (error) {
        console.error('Erro ao buscar passeadores:', error);
      }
    };

    fetchCliente();
    fetchPasseadores();
  }, [id]);

  useEffect(() => {
    if (cliente) {
      if (nomeRef.current) nomeRef.current.value = cliente.nome || '';
      if (emailRef.current) emailRef.current.value = cliente.email || '';
      if (cpfRef.current) cpfRef.current.value = formatCPF(cliente.cpf) || '';
      if (caesRef.current) caesRef.current.value = cliente.caes ? cliente.caes.join(', ') : '';
      if (telefoneRef.current) telefoneRef.current.value = formatTelefone(cliente.telefone) || '';
      if (enderecoRef.current) enderecoRef.current.value = cliente.endereco || '';
      if (anotacaoRef.current) anotacaoRef.current.value = cliente.anotacoes || '';
      setSelectedPasseadorId(cliente.id_passeador || ""); // Atualiza o passeador selecionado ao carregar o cliente
      setPacote(cliente.pacote || "");
    }
  }, [cliente]);

  // Recupera o ID do passeador do localStorage
  useEffect(() => {
    const localIdPasseador = localStorage.getItem('passeadorId'); // Recupera o ID do passeador salvo localmente
    setSelectedPasseadorId(localIdPasseador || ""); // Define o passeador selecionado como o ID salvo
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!cliente) {
    return <div>Cliente não encontrado</div>;
  }

  const handleSave = async (e) => {
    e.preventDefault();
  
    const isNomeValid = validateNome(nomeRef.current.value);
    const isEmailValid = validateEmail(emailRef.current.value);
    const isCPFValid = validateCPF(cpfRef.current.value);
    const isTelefoneValid = validateTelefone(telefoneRef.current.value);
    const isHorarioValid = validateHorario(horarioRef.current.value);
  
    if (!isNomeValid || !isEmailValid || !isCPFValid || !isTelefoneValid || !isHorarioValid) {
      alert('Por favor, corrija os erros destacados antes de editar.');
      return;
    }
  
    try {
      const localPasseadorId = localStorage.getItem('passeadorId'); // Recupera o ID do passeador salvo localmente
      const updatedCliente = {
        nome: nomeRef.current.value || cliente.nome,
        email: emailRef.current.value || cliente.email,
        cpf: (cpfRef.current.value || cliente.cpf).replace(/\D/g, ''),
        caes: caesRef.current.value 
          ? caesRef.current.value.split(',').map(cao => cao.trim()) 
          : cliente.caes,
        telefone: (telefoneRef.current.value || cliente.telefone).replace(/\D/g, ''),
        endereco: enderecoRef.current.value || cliente.endereco,
        pacote,
        dias_teste: pacote === "Temporario" ? parseInt(diasTeste) || cliente.dias_teste : cliente.dias_teste, // Mantém o valor atual se não for alterado
        anotacoes: anotacaoRef.current.value || cliente.anotacoes,
        id_passeador: selectedPasseadorId || localPasseadorId || null, // Garante que será null se não houver passeador
      };
  
      console.log('Enviando dados para atualização:', updatedCliente);
  
      const response = await fetch(`http://localhost:3001/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCliente),
      });
  
      if (response.ok) {
        if (horarioRef.current.value) {
          const horarioFormatado = `${horarioRef.current.value}:00`; // Adiciona os segundos ao horário
          const passeioResponse = await fetch(`http://localhost:3001/passeios/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              horario_passeio: horarioFormatado,
              id_passeador: updatedCliente.id_passeador, // Garante que será null se não houver passeador
            }),
          });
  
          if (!passeioResponse.ok) {
            console.error('Erro ao atualizar passeio:', await passeioResponse.json());
          }
        }
        navigate(`/visualizarcliente/${id}`);
      } else {
        const data = await response.json();
        console.error('Erro ao atualizar cliente:', data);
        alert('Erro ao atualizar cliente: ' + (data.message || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao enviar os dados do cliente:', error);
      alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
  };
  
  return (
    <div className="Web-Editar-Cliente">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <button type="button" className="r-password-button" onClick={handleResetPassword}>
        Resetar Senha
        </button>
        <div className="footer-bar"></div>
      </header>

      <div className="form-container">
        <form className="client-form" onSubmit={handleSave}>
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
            <input ref={caesRef} type="text" placeholder="Cães" className="form-input" />
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
            <input ref={enderecoRef} type="text" placeholder="Endereço" className="form-input" />
          </div>
          <CustomSelect
            icon={<FaUserAlt />}
            placeholder="Selecione o Passeador"
            options={passeadoresOptions}
            value={selectedPasseadorId}
            onChange={(value) => setSelectedPasseadorId(value)}
          />

          {/* 2. SELECT DE PACOTE SUBSTITUÍDO */}
          <div className="input-container">
            <CustomSelect
              icon={<FaCalendarAlt />}
              placeholder="Selecione o Pacote"
              options={pacoteOptions}
              value={pacote}
              onChange={(value) => setPacote(value)}
            />
            {/* Lógica para mostrar o campo de dias de teste permanece a mesma */}
            {pacote === 'Temporario' && (
              <div className="input-container temporary-days-input">
                <input
                  type="number"
                  placeholder="Dias de teste"
                  className="form-input"
                  min="1"
                  value={diasTeste}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setDiasTeste(value > 0 ? value : '');
                  }}
                />
              </div>
            )}
          </div>
          <div className="input-container">
            <FaClock className="input-icon" />
            <input
              ref={horarioRef}
              type="text"
              placeholder="Horário de passeio"
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
            <textarea ref={anotacaoRef} placeholder="Anotações" className="form-textarea" />
          </div>

          <div className="button-group">
            <button type="button" className="cancel-button" onClick={() => navigate(`/visualizarcliente/${id}`)}>
              Cancelar
            </button>
            <button type="submit" className="create-button">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarCliente;