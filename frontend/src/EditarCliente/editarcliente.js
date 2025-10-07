import './editarcliente.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaDog, FaPhone, FaHome, FaCalendarAlt, FaClock, FaBook, FaUserAlt } from "react-icons/fa";

function EditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams(); // Captura o ID da URL
  const [cliente, setCliente] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: '',
    anotacoes: '',
    caes: '',
    horario_passeio: '',
    pacote: '',
    dias_teste: '',
  }); // Estado para armazenar os dados do cliente
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento
  const [passeadores, setPasseadores] = useState([]); // Lista de passeadores
  const [selectedPasseadorId, setSelectedPasseadorId] = useState(""); // Passeador selecionado

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Busca os dados do cliente
        const clienteResponse = await fetch(`http://localhost:3001/clientes/${id}`);
        const clienteData = await clienteResponse.json();

        if (clienteData.success && clienteData.cliente) {
          const { nome, email, cpf, telefone, endereco, anotacoes, caes, horario_passeio, pacote, dias_teste, passeador } = clienteData.cliente;

          // Atualiza o estado do cliente
          setCliente({
            nome: nome || '',
            email: email || '',
            cpf: cpf || '',
            telefone: telefone || '',
            endereco: endereco || '',
            anotacoes: anotacoes || '',
            caes: caes ? caes.join(', ') : '',
            horario_passeio: horario_passeio || '',
            pacote: pacote || '',
            dias_teste: dias_teste || '',
          });

          // Define o passeador selecionado
          const passeadorId = passeador ? passeadores.find(p => p.nome === passeador)?.id : '';
          setSelectedPasseadorId(passeadorId || '');
        } else {
          console.error('Erro: Cliente não encontrado ou resposta inesperada', clienteData);
        }

        // Busca a lista de passeadores
        const passeadoresResponse = await fetch('http://localhost:3001/passeadores');
        const passeadoresData = await passeadoresResponse.json();

        if (passeadoresData.success && Array.isArray(passeadoresData.passeadores)) {
          setPasseadores(passeadoresData.passeadores);

          // Atualiza o passeador selecionado após carregar a lista de passeadores
          const passeadorId = clienteData.cliente.passeador
            ? passeadoresData.passeadores.find(p => p.nome === clienteData.cliente.passeador)?.id
            : '';
          setSelectedPasseadorId(passeadorId || '');
        } else {
          console.error('Erro ao buscar passeadores ou resposta inesperada', passeadoresData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const updatedCliente = {
        ...cliente,
        cpf: cliente.cpf.replace(/\D/g, ''),
        telefone: cliente.telefone.replace(/\D/g, ''),
        caes: cliente.caes.split(',').map((cao) => cao.trim()),
        id_passeador: selectedPasseadorId || null,
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
        <div className="footer-bar"></div>
      </header>

      <div className="form-container">
        <form className="client-form" onSubmit={handleSave}>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              name="nome"
              type="text"
              placeholder="Nome do cliente"
              className="form-input"
              value={cliente.nome}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="form-input"
              value={cliente.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <input
              name="cpf"
              type="text"
              placeholder="CPF"
              className="form-input"
              value={cliente.cpf}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <FaDog className="input-icon" />
            <input
              name="caes"
              type="text"
              placeholder="Cães"
              className="form-input"
              value={cliente.caes}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <FaPhone className="input-icon" />
            <input
              name="telefone"
              type="tel"
              placeholder="Telefone"
              className="form-input"
              value={cliente.telefone}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <input
              name="endereco"
              type="text"
              placeholder="Endereço"
              className="form-input"
              value={cliente.endereco}
              onChange={handleInputChange}
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
              name="pacote"
              className="form-input"
              value={cliente.pacote}
              onChange={handleInputChange}
            >
              <option value="">Selecione o Pacote</option>
              <option value="Mensal">Mensal</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Temporario">Temporário</option>
            </select>
            {cliente.pacote === "Temporario" && (
              <div className="input-container">
                <input
                  name="dias_teste"
                  type="number"
                  placeholder="Dias de teste"
                  className="form-input"
                  min="1"
                  value={cliente.dias_teste}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
          <div className="input-container">
            <FaClock className="input-icon" />
            <input
              name="horario_passeio"
              type="text"
              placeholder="Horário de passeio"
              className="form-input"
              value={cliente.horario_passeio}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <FaBook className="input-icon" />
            <textarea
              name="anotacoes"
              placeholder="Anotações"
              className="form-textarea"
              value={cliente.anotacoes}
              onChange={handleInputChange}
            />
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