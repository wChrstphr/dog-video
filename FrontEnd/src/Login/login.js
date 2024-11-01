import React, { useState, useRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordInputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
  
    if (password.length < 6) {
      setError('Sua senha deve ter pelo menos 6 caracteres.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, senha: password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setError('');
        onLogin(data.userType);
  
        // Redireciona para a tela de redefinição com o id do cliente, se alterar_senha for 1
        if (data.alterar_senha === 1) {
          navigate(`/redefinir/${data.id_cliente}`);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
  };  

  const handleKeyDown = (event, field) => {
    if (event.key === 'Enter') {
      if (field === 'username') {
        passwordInputRef.current.focus();
      } else if (field === 'password') {
        handleLogin();
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="Login">
      <img src="/dog.png" alt="Logo" className="logo" />
      <label htmlFor="username">Email</label>
      <input
        type="text"
        placeholder="Insira seu email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 'username')}
      />
      <label htmlFor="password">Senha</label>
      <div className="password-container">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Insira a senha"
          value={password}
          ref={passwordInputRef}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'password')}
        />
        <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin}>LOGAR</button>
    </div>
  );
}

export default Login;
