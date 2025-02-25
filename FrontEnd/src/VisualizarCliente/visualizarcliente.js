import './visualizarcliente.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaDog, FaPhone, FaHome, FaCalendarAlt, FaClock, FaBook, FaUserAlt } from "react-icons/fa";

function VisualizarCliente() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obter o ID do cliente da URL
  const [cliente, setCliente] = useState(null); // Estado para armazenar os dados do cliente
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`http://localhost:3001/clientes/${id}`); // Faz a requisição para o backend
        const data = await response.json();
  
        if (data.success) {
          setCliente(data.cliente); // Armazena os dados do cliente
  
          // Salva o ID do passeador no localStorage
          if (data.cliente.id_passeador) {
            localStorage.setItem('passeadorId', data.cliente.id_passeador);
          }
        } else {
          console.error('Erro no servidor:', data.message);
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      } finally {
        setLoading(false); // Remove o estado de carregamento
      }
    };
  
    fetchCliente();
  }, [id]);
  
  if (loading) {
    return <div>Carregando...</div>; // Mensagem enquanto carrega
  }

  if (!cliente) {
    return <div>Cliente não encontrado</div>; // Caso o cliente não seja encontrado
  }

  return (
    <div className="Web-Visualizar-Cliente">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <img
        src="/Back.svg"
        alt="Ícone de voltar"
        className="back-icon"
        onClick={() => navigate("/clientes")}
      />

      <div className="form-container">
        <div className="client-form">
          <div className="input-container">
            <FaUser className="input-icon" />
            <span className="form-input">{cliente.nome}</span> {/* Nome do cliente */}
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <span className="form-input">{cliente.email}</span> {/* Email do cliente */}
          </div>
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <span className="form-input">{cliente.cpf}</span> {/* CPF do cliente */}
          </div>
          <div className="input-container">
            <FaDog className="input-icon" />
            <span className="form-input">{cliente.caes.join(', ')}</span> {/* Lista de cães */}
          </div>
          <div className="input-container">
            <FaPhone className="input-icon" />
            <span className="form-input">{cliente.telefone}</span> {/* Telefone do cliente */}
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <span className="form-input">{cliente.endereco}</span> {/* Endereço do cliente */}
          </div>
          <div className="input-container">
            <FaUserAlt className="input-icon" />
            <span className="form-input">{cliente.passeador}</span> {/* Passeador do cliente */}
          </div>
          <div className="input-container">
            <FaCalendarAlt className="input-icon" />
            <span className="form-input">{cliente.pacote}</span> {/* Pacote do cliente */}
          </div>
          <div className="input-container">
            <FaClock className="input-icon" />
            <span className="form-input">{cliente.horario_passeio}</span> {/* Horário de passeio */}
          </div>
          <div className="input-container">
            <FaBook className="input-icon" />
            <span className="form-textarea">{cliente.anotacoes}</span> {/* Anotações */}
          </div>

          <div className="button-group">
            <button
              type="button"
              className="edit-button"
              onClick={() => navigate(`/editarcliente/${id}`)} // Navegar para a tela de edição
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisualizarCliente;