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

  // Função para assinar o usuário no Push Manager
  async function subscribeUser(idCliente) {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BBH2oyhNjmKPnyR140S375tVHFM1wuSd7GW7ijm90Ja7NB2eX67YQRbDLVyW_QrLqiDpbIy9QecaBDC_K1AWCro'
        });

        // Envia a inscrição para o backend
        await fetch('http://localhost:3001/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription,
            id_cliente: idCliente,
            id_passeador: null
          })
        });
      } catch (err) {
        console.error('Erro ao realizar subscribe:', err);
      }
    }
  }

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, senha: password }),
      });

      const data = await response.json();

      if (data.success) {
        setError('');
        // Chama a função onLogin e passa userType e id_cliente
        onLogin(data.userType, data.id_cliente);

        // Salva o id_cliente no localStorage (para não admin)
        if (data.userType !== 'admin') {
          localStorage.setItem('id_cliente', data.id_cliente);
        }

        // Se o usuário não for admin, realiza a inscrição para notificações imediatamente
        if (data.userType !== 'admin') {
          await subscribeUser(data.id_cliente);
        }

        // Se a senha precisar ser alterada, redireciona para a tela de redefinição
        if (data.alterar_senha === 1) {
          navigate(`/redefinir/${data.id_cliente}`);
        } else {
          navigate('/');
        }
      } else {
        setError('Email ou senha incorretos.');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
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
    <div
      className="login-background"
      style={{
        backgroundImage: `url('/loginDog.svg')`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
      }}
    >
      <div className="login-container">
        <h2>Login</h2>
        <label htmlFor="username">Email</label>
        <input
          className="input-login"
          type="text"
          placeholder="Insira seu email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'username')}
        />

        <label htmlFor="password">Senha</label>
        <div className="password-container">
          <input
            className="input-login"
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
        <button className="button-login" onClick={handleLogin}>LOGAR</button>
      </div>
    </div>
  );
}

export default Login;