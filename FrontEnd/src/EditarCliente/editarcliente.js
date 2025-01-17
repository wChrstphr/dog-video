import './editarcliente.css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaDog, FaPhone, FaHome, FaCalendarAlt, FaClock, FaBook, FaUserAlt } from "react-icons/fa";

function EditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams(); // Captura o ID da URL
  const [cliente, setCliente] = useState(null); // Armazena os dados do cliente
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento
  const [passeadores, setPasseadores] = useState([]); // Lista de passeadores
  const [selectedPasseadorId, setSelectedPasseadorId] = useState(""); // Passeador selecionado

  // Referências para os inputs
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const caesRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);
  const horarioRef = useRef(null);
  const anotacaoRef = useRef(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`http://localhost:3001/clientes/${id}`);
        const data = await response.json();

        if (data.success && data.cliente) {
          setCliente(data.cliente);
          setSelectedPasseadorId(data.cliente.id_passeador || ""); // Define o passeador atual
        } else {
          console.error('Erro: Cliente não encontrado ou resposta inesperada', data);
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
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
      nomeRef.current.value = cliente.nome || '';
      emailRef.current.value = cliente.email || '';
      cpfRef.current.value = cliente.cpf || '';
      caesRef.current.value = cliente.caes ? cliente.caes.join(', ') : '';
      telefoneRef.current.value = cliente.telefone || '';
      enderecoRef.current.value = cliente.endereco || '';
      horarioRef.current.value = cliente.horario_passeio || '';
      anotacaoRef.current.value = cliente.anotacoes || '';
      setSelectedPasseadorId(cliente.id_passeador || ""); // Atualiza o passeador selecionado ao carregar o cliente
    }
  }, [cliente]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!cliente) {
    return <div>Cliente não encontrado</div>;
  }

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedCliente = {
      nome: nomeRef.current.value || cliente.nome,
      email: emailRef.current.value || cliente.email,
      cpf: cpfRef.current.value || cliente.cpf,
      caes: caesRef.current.value ? caesRef.current.value.split(',').map(cao => cao.trim()) : cliente.caes,
      telefone: telefoneRef.current.value || cliente.telefone,
      endereco: enderecoRef.current.value || cliente.endereco,
      pacote: cliente.pacote || "",
      horario_passeio: horarioRef.current.value || cliente.horario_passeio,
      anotacoes: anotacaoRef.current.value || cliente.anotacoes,
      id_passeador: selectedPasseadorId || cliente.id_passeador, // Garante que sempre haverá um id_passeador
    };

    try {
      const response = await fetch(`http://localhost:3001/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCliente),
      });

      if (response.ok) {
        navigate(`/visualizarcliente/${id}`);
      } else {
        console.error('Erro ao atualizar cliente');
      }
    } catch (error) {
      console.error('Erro ao enviar os dados do cliente:', error);
    }
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <div className="form-container">
        <form className="client-form" onSubmit={handleSave}>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input ref={nomeRef} type="text" placeholder="Nome do cliente" className="form-input" />
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
            <FaDog className="input-icon" />
            <input ref={caesRef} type="text" placeholder="Cães" className="form-input" />
          </div>
          <div className="input-container">
            <FaPhone className="input-icon" />
            <input ref={telefoneRef} type="tel" placeholder="Telefone" className="form-input" />
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <input ref={enderecoRef} type="text" placeholder="Endereço" className="form-input" />
          </div>
          <div className="input-container">
            <FaUserAlt className="input-icon" />
            <select
              className="form-input"
              value={selectedPasseadorId}
              onChange={(e) => setSelectedPasseadorId(e.target.value)}
            >
              <option value="">Selecione o Passeador</option>
              {passeadores.map((passeador) => (
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
              value={cliente.pacote || ""}
              onChange={(e) => setCliente({ ...cliente, pacote: e.target.value })}
            >
              <option value="">Selecione o Pacote</option>
              <option value="Semestral">Semestral</option>
              <option value="Mensal">Mensal</option>
            </select>
          </div>
          <div className="input-container">
            <FaClock className="input-icon" />
            <input ref={horarioRef} type="text" placeholder="Horário de passeio" className="form-input" />
          </div>
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