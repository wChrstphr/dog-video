import './visualizarpasseador.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaPhone, FaHome, FaCamera, FaUserAlt } from "react-icons/fa";

function VisualizarPasseador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [passeador, setPasseador] = useState(null);
  const [clientes, setClientes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasseador = async () => {
      try {
        const response = await fetch(`http://localhost:3001/passeadores/${id}`);
        const data = await response.json();

        if (data.success) {
          setPasseador(data.passeador);
          setClientes(data.clientes);
        } else {
          console.error('Erro na resposta do backend:', data.message);
          setPasseador(null);
        }
      } catch (error) {
        console.error('Erro ao buscar passeador:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPasseador();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!passeador) {
    return <div>Passeador não encontrado</div>;
  }

  return (
    <div className="Web">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <img
        src="/Back.svg"
        alt="Ícone de voltar"
        className="back-icon"
        onClick={() => navigate("/passeadores")}
      />

      <div className="form-container">
        <form className="passeador-form">
          <div className="image-container">
            {passeador.imagem ? (
              <img src={passeador.imagem} alt="Imagem do Passeador" className="image-preview" />
            ) : (
              <div className="placeholder-container">
                <FaCamera className="camera-icon" />
              </div>
            )}
          </div>

          <div className="input-container">
            <FaUser className="input-icon" />
            <span className="form-input">{passeador.nome}</span>
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <span className="form-input">{passeador.email}</span>
          </div>
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <span className="form-input">{passeador.cpf}</span> {/* CPF do passeador */}
          </div>
          <div className="input-container">
            <FaPhone className="input-icon" />
            <span className="form-input">{passeador.telefone}</span> {/* Telefone do passeador */}
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <span className="form-input">{passeador.endereco}</span> {/* Endereço do passeador */}
          </div>
          <div className="input-container">
            <FaUserAlt className="input-icon" />
            <span className="form-input">{clientes || 'Sem clientes associados'}</span> {/* Exibe todos os clientes associados */}
          </div>

          <div className="button-group">
            <button
              type="button"
              className="edit-button"
              onClick={() => navigate(`/editarpasseador/${id}`)}
            >
              Editar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VisualizarPasseador;