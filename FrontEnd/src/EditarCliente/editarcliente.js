import './editarcliente.css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaDog, FaPhone, FaHome, FaCalendarAlt, FaClock, FaBook, FaUserAlt } from "react-icons/fa";

function EditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams(); // Captura o ID da URL
  const [cliente, setCliente] = useState(null); // Armazena os dados do cliente
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento
  const [passeadores, setPasseadores] = useState([]); // Armazena a lista de passeadores
  const [selectedPasseadorId, setSelectedPasseadorId] = useState(""); // Armazena o passeador selecionado

  // Referências para os inputs
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const caesRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);
  const pacoteRef = useRef(null);
  const horarioRef = useRef(null);
  const anotacaoRef = useRef(null);

  // Função para buscar os dados do cliente e dos passeadores
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`http://localhost:3001/cliente/${id}`);
        const data = await response.json();
        setCliente(data); // Armazena os dados do cliente
        setSelectedPasseadorId(data.id_passeador); // Define o passeador atual do cliente
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
        setPasseadores(data); // Armazena a lista de passeadores
      } catch (error) {
        console.error('Erro ao buscar passeadores:', error);
      }
    };

    fetchCliente();
    fetchPasseadores();
  }, [id]);

  // Preencher os campos com os dados do cliente carregado
  useEffect(() => {
    if (cliente) {
      nomeRef.current.value = cliente.nome;
      emailRef.current.value = cliente.email;
      cpfRef.current.value = cliente.cpf;
      caesRef.current.value = cliente.caes.join(', ');
      telefoneRef.current.value = cliente.telefone;
      enderecoRef.current.value = cliente.endereco;
      pacoteRef.current.value = cliente.pacote;
      horarioRef.current.value = cliente.horario_passeio;
      anotacaoRef.current.value = cliente.anotacoes;
    }
  }, [cliente]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!cliente) {
    return <div>Cliente não encontrado</div>;
  }

  // Função para salvar as alterações
  const handleSave = async (e) => {
    e.preventDefault();

    const updatedCliente = {
      nome: nomeRef.current.value,
      email: emailRef.current.value,
      cpf: cpfRef.current.value,
      caes: caesRef.current.value.split(',').map(cao => cao.trim()),
      telefone: telefoneRef.current.value,
      endereco: enderecoRef.current.value,
      pacote: pacoteRef.current.value,
      horario_passeio: horarioRef.current.value,
      anotacoes: anotacaoRef.current.value,
      id_passeador: selectedPasseadorId // Inclui o id do passeador selecionado
    };

    try {
      const response = await fetch(`http://localhost:3001/cliente/${id}`, {
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
    <div className="Web-Editar-Cliente">
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
                <option key={passeador.id_passeador} value={passeador.id_passeador}>
                  {passeador.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <FaCalendarAlt className="input-icon" />
            <input ref={pacoteRef} type="text" placeholder="Pacote" className="form-input" />
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
