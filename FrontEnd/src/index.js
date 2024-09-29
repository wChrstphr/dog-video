import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web from './TelaInicial/Web';
import Login from './Login/login';
import DadosCliente from './DadosCliente/dados';
import Admin from './TelaInicialAdmin/admin';
import reportWebVitals from './reportWebVitals';
import Modal from 'react-modal';
import Clientes from './Clientes/clientes';

const root = ReactDOM.createRoot(document.getElementById('root'));

Modal.setAppElement(root);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                userRole === 'admin' ? (
                  <Admin onLogout={handleLogout} />
                ) : (
                  <Web onLogout={handleLogout} />
                )
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/dados-cliente" element={<DadosCliente onLogout={handleLogout} />} />
          <Route path="/admin" element={<Admin onLogout={handleLogout} />} />
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

root.render(<App />);

reportWebVitals();
