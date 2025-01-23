import './editarpasseador.css';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaPhone, FaHome, FaCamera } from "react-icons/fa";

function EditarPasseador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [passeador, setPasseador] = useState({});

  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);

  useEffect(() => {
    const fetchPasseador = async () => {
      try {
        const response = await fetch(`http://localhost:3001/passeadores/${id}`);
        const data = await response.json();
        setPasseador(data.passeador);
        setSelectedImage(data.passeador.imagem);
      } catch (error) {
        console.error('Erro ao carregar passeador:', error);
      }
    };
    fetchPasseador();
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedPasseador = {
      nome: nomeRef.current.value,
      email: emailRef.current.value,
      cpf: cpfRef.current.value,
      telefone: telefoneRef.current.value,
      endereco: enderecoRef.current.value,
      imagem: selectedImage,
    };

    try {
      const response = await fetch(`http://localhost:3001/passeador/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPasseador),
      });

      if (response.ok) {
        navigate("/passeadores");
      } else {
        console.error('Erro ao atualizar passeador');
      }
    } catch (error) {
      console.error('Erro ao salvar passeador:', error);
    }
  };

  return (
    <div className="WebPasseador">
      <header className="Web-header">
        <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
        <div className="footer-bar"></div>
      </header>

      <div className="form-container">
        <form className="passeador-form" onSubmit={handleSave}>
          <div className="image-container">
            <label htmlFor="image-upload" className="image-upload-label">
              {selectedImage ? (
                <img src={selectedImage} alt="Imagem Selecionada" className="image-preview" />
              ) : (
                <div className="placeholder-container">
                  <FaCamera className="camera-icon" />
                </div>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
          </div>

          <div className="input-container">
            <FaUser className="input-icon" />
            <input ref={nomeRef} type="text" placeholder="Nome do passeador" defaultValue={passeador.nome} className="form-input" />
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input ref={emailRef} type="email" placeholder="Email" defaultValue={passeador.email} className="form-input" />
          </div>
          <div className="input-container">
            <FaAddressCard className="input-icon" />
            <input ref={cpfRef} type="text" placeholder="CPF" defaultValue={passeador.cpf} className="form-input" />
          </div>
          <div className="input-container">
            <FaPhone className="input-icon" />
            <input ref={telefoneRef} type="tel" placeholder="Telefone" defaultValue={passeador.telefone} className="form-input" />
          </div>
          <div className="input-container">
            <FaHome className="input-icon" />
            <input ref={enderecoRef} type="text" placeholder="Endereço" defaultValue={passeador.endereco} className="form-input" />
          </div>

          <div className="button-group">
            <button type="button" className="cancel-button" onClick={() => navigate(`/visualizarpasseador/${id}`)}>
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

export default EditarPasseador;