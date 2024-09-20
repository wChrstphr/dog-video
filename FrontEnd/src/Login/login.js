import React, { useState } from 'react';
import './login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      onLogin();
    } else {
      alert('Credenciais incorretas!');
    }
  };

  return (
    <div className="Login">
      <img src="/dog.png" alt="Logo" className="logo" />
      <label 
        htmlFor="username">Usuário    
      </label>
      <input
        type="text"
        placeholder="Insira o usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label
        htmlFor="username">Senha
      </label>
      <input
        type="password"
        placeholder="Insira a senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>LOGAR</button>
    </div>
  );
}

export default Login;
