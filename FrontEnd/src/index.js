import React, { useState, useEffect } from 'react';
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
import Passeadores from './Passeadores/passeadores';
import CriarCliente from './CriarCliente/criarcliente';
import VisualizarCliente from './VisualizarCliente/visualizarcliente';
import CriarPasseador from './CriarPasseador/criarpasseador';
import EditarCliente from './EditarCliente/editarcliente';
import Cameras from './Cameras/cameras';
import VisualizarPasseador from './VisualizarPasseador/visualizarpasseador';
import EditarPasseador from './EditarPasseador/editarpasseador';
import RedefinirSenha from './RedefinirSenha/redefinir';

const root = ReactDOM.createRoot(document.getElementById('root'));

Modal.setAppElement('#root');  // Defina o elemento para os modais

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isMapVisible, setIsMapVisible] = useState(false);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  useEffect(() => {
    const constraints = {
      video: true,
      audio: false,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const video1 = document.getElementById('camera1');
      const video2 = document.getElementById('camera2');
      if (video1) video1.srcObject = stream;
      if (video2) video2.srcObject = stream;
    });
  }, []);

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
          <Route path="/passeadores" element={<Passeadores />} />
          <Route path="/criarcliente" element={<CriarCliente />} />
          <Route path="/visualizarcliente/:id" element={<VisualizarCliente />} /> {/* Rota dinâmica */}
          <Route path="/editarcliente/:id" element={<EditarCliente />} />
          <Route path="/criarpasseador" element={<CriarPasseador />} />
          <Route path="/cameras" element={<Cameras onLogout={handleLogout} />} />
          <Route path="/Web" element={<Web onLogout={handleLogout} />} />
          <Route path="/visualizarpasseador" element={<VisualizarPasseador />} />
          <Route path="/editarpasseador" element={<EditarPasseador />} />
          <Route path="/redefinir/:id" element={<RedefinirSenha />} /> {/* Rota dinâmica para redefinir senha */}
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

root.render(<App />);

reportWebVitals();
