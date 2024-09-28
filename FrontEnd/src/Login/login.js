// src/Login/login.js
import React, { useState, useRef } from 'react';
import './login.css';

function Login({ onLogin }) {
  // Estados para armazenar entradas do usuário
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  return (
    <div className="Login">
      <img src="/dog.png" alt="Logo" className="logo" />
      <label htmlFor="username">Usuário</label>
      <input
        type="text"
        placeholder="Insira o usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 'username')} // Adiciona handleKeyDown com campo de 'username'
      />
      <label htmlFor="password">Senha</label>
      <input
        type="password"
        placeholder="Insira a senha"
        value={password}
        ref={passwordInputRef} // Referência ao campo de senha
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 'password')} // Adiciona handleKeyDown com campo de 'password'
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin}>LOGAR</button>
    </div>
  );
}

export default Login;
