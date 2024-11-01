import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import './redefinir.css';

function Redefinir() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState({ newPassword: false, confirmPassword: false });
  const passwordInputRef = useRef(null);

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Sua senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword === 'dog123') {
      setError('Sua senha deve ser diferente da inicial');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      // Envia a nova senha para o back-end
      const response = await fetch('http://localhost:3001/alterar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novaSenha: newPassword, id_cliente: id }),
      });

      const data = await response.json();

      if (data.success) {
        setError('');
        navigate('/'); // Redireciona para a página principal após sucesso
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Erro ao redefinir a senha:', error);
      // Por algum motivo so funciona sem a mesnagems de erro ao conectar ao servidor
    }
  };

  const handleKeyDown = (event, field) => {
    if (event.key === 'Enter') {
      if (field === 'newPassword') {
        passwordInputRef.current.focus();
      } else if (field === 'confirmPassword') {
        handlePasswordChange();
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="Redefinir">
      <div className="warning-text">
        <FaExclamationCircle className="icon" />
        <p style={{ fontWeight: 'bold' }}>
          Cadastre sua nova senha. Por segurança, use pelo menos 6 caracteres.
        </p>
      </div>
      <label htmlFor="newPassword">Nova senha</label>
      <div className="password-container">
        <input
          type={showPassword.newPassword ? 'text' : 'password'}
          placeholder="Insira a sua nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'newPassword')}
        />
        <span className="password-toggle-icon" onClick={() => togglePasswordVisibility('newPassword')}>
          {showPassword.newPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      <label htmlFor="confirmPassword">Confirme sua senha</label>
      <div className="password-container">
        <input
          type={showPassword.confirmPassword ? 'text' : 'password'}
          placeholder="Confirme sua nova senha"
          value={confirmPassword}
          ref={passwordInputRef}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'confirmPassword')}
        />
        <span className="password-toggle-icon" onClick={() => togglePasswordVisibility('confirmPassword')}>
          {showPassword.confirmPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handlePasswordChange}>Redefinir</button>
    </div>
  );
}

export default Redefinir;