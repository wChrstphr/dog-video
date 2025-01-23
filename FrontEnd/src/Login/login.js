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

    return (
      <div className="Login">
          <div className="background-pattern"></div>
          <div className="login-container">
                <input
                className="input-Login"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'username')}
                />
                <div className="password-container">
                    <input
                    className="input-Login"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        ref={passwordInputRef}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'password')}
                    />
                    <span 
                        className="password-toggle-icon" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                </div>
                {error && <p className="error">{error}</p>}
                <button className="button-Login" onClick={handleLogin}>Login</button>
            </div>
        </div>
      );
}

export default Login;
