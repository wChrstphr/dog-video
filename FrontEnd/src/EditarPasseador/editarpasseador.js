import './editarpasseador.css';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaAddressCard, FaPhone, FaHome, FaCamera } from "react-icons/fa";

function EditarPasseador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [passeador, setPasseador] = useState({ cpf: '' });

  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);

  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');

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

  const formatCPF = (cpf) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cpf;
  };
  

  const formatTelefone = (telefone) => {
    if (!telefone) return '';
    const cleaned = telefone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return telefone;
  };
  

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

    const isNomeValid = validateNome(nomeRef.current.value);
    const isEmailValid = validateEmail(emailRef.current.value);
    const isCPFValid = validateCPF(cpfRef.current.value);
    const isTelefoneValid = validateTelefone(telefoneRef.current.value);

    if (isNomeValid && isEmailValid && isCPFValid && isTelefoneValid) {
      const updatedPasseador = {
        nome: nomeRef.current.value,
        email: emailRef.current.value,
        cpf: cpfRef.current.value.replace(/\D/g, ''),
        telefone: telefoneRef.current.value.replace(/\D/g, ''),
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
    } else {
      console.error('Formulário contém erros');
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
            <input 
              ref={nomeRef} 
              type="text" 
              placeholder="Nome do passeador" 
              defaultValue={passeador.nome} 
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
              defaultValue={passeador.email} 
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
              defaultValue={formatCPF(passeador.cpf)} 
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
            <FaPhone className="input-icon" />
            <input 
              ref={telefoneRef} 
              type="tel" 
              placeholder="Telefone" 
              defaultValue={passeador.telefone ? formatTelefone(passeador.telefone) : ''} 
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
