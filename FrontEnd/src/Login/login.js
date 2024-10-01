import React, { useState, useRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importando os ícones
import './login.css';

function Login({ onLogin }) {
  // Estados para armazenar entradas do usuário
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Novo estado para controlar a visualização da senha

  // Referência para o campo de senha
  const passwordInputRef = useRef(null);

  // Função para lidar com o login
  const handleLogin = () => {
    if (!username || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setError('Sua senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Verificação de credenciais
    if (username === 'admin' && password === '123456') {
      setError('');
      onLogin('admin'); // Passa 'admin' como tipo de usuário
    } else if (username === 'teste' && password === '123456') {
      setError('');
      onLogin('user'); // Passa 'user' como tipo de usuário
    } else {
      setError('Usuário não encontrado!');
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
      <label htmlFor="username">Usuário</label>
      <input
        type="text"
        placeholder="Insira o usuário"
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
          {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Alterna entre o ícone de olho */}
        </span>
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin}>LOGAR</button>
    </div>
  );
}

export default Login;
