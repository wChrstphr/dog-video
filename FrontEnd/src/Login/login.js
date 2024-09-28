import React, { useState } from 'react';
import './login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {

    if (!username || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    
    if (password.length < 6) {
      setError('Sua senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Verificação de credenciais fixas
    if (username === 'admin' && password === '123456') {
      setError('');
      onLogin();
    } else {
      setError('Usuário não encontrado!');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
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
        onKeyDown={handleKeyDown}
      />
      <label htmlFor="password">Senha</label>
      <input
        type="password"
        placeholder="Insira a senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin}>LOGAR</button>
    </div>
  );
}

export default Login;
