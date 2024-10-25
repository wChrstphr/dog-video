import React, { useState, useRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login({ onLogin }) {
  // Estados para armazenar entradas do usuário
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Novo estado para controlar a visualização da senha

  // Referência para o campo de senha
  const passwordInputRef = useRef(null);

  // Hook do react-router-dom para redirecionamento
  const navigate = useNavigate();

  // Função para lidar com o login
  const handleLogin = async () => {
    if (!username || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
  
    if (password.length < 6) {
      setError('Sua senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Se a senha for "dog123", redireciona para a página de redefinição
    if (password === 'dog123') {
      navigate('/redefinir');
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
        onLogin(data.userType); // 'admin' ou 'user'
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
  };  
  
  // Função para lidar com a tecla "Enter" em cada campo
  const handleKeyDown = (event, field) => {
    if (event.key === 'Enter') {
      if (field === 'username') {
        // Move o foco para o campo de senha ao pressionar Enter no campo de usuário
        passwordInputRef.current.focus();
      } else if (field === 'password') {
        // Executa o login ao pressionar Enter no campo de senha
        handleLogin();
      }
    }
  };

  // Função para alternar a exibição da senha
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
          type={showPassword ? 'text' : 'password'} // Alterna entre 'text' e 'password'
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
