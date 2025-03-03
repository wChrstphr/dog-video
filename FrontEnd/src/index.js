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
          <Route path="/dados-cliente/:id" element={<DadosCliente />} />
          <Route path="/admin" element={<Admin onLogout={handleLogout} />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/passeadores" element={<Passeadores />} />
          <Route path="/criarcliente" element={<CriarCliente />} />
          <Route path="/visualizarcliente/:id" element={<VisualizarCliente />} />
          <Route path="/editarcliente/:id" element={<EditarCliente />} />
          <Route path="/criarpasseador" element={<CriarPasseador />} />
          <Route path="/cameras" element={<Cameras onLogout={handleLogout} />} />
          <Route path="/Web" element={<Web onLogout={handleLogout} />} />
          <Route path="/visualizarpasseador/:id" element={<VisualizarPasseador />} />
          <Route path="/editarpasseador/:id" element={<EditarPasseador />} />
          <Route path="/redefinir/:id" element={<RedefinirSenha />} /> {/* Rota dinâmica para redefinir senha */}
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

root.render(<App />);

reportWebVitals();

// Solicitar permissão para notificações e registrar o service worker
if ('Notification' in window && 'serviceWorker' in navigator) {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Permissão para notificações concedida.');
      navigator.serviceWorker
        .register('/sw.js') // Registrar o service worker para notificações
        .then((registration) => {
          console.log('Service Worker registrado:', registration);
          // Recupera o id_cliente salvo no localStorage (se existir)
          const idCliente = localStorage.getItem('id_cliente');
          // Chama a função para assinar o usuário no Push Manager, passando o id_cliente
          subscribeUser(idCliente);
        })
        .catch((err) => {
          console.error('Erro ao registrar Service Worker:', err);
        });
    } else {
      console.log('Permissão para notificações negada.');
    }
  });
}

// Função para assinar o usuário no Push Manager
async function subscribeUser(idCliente = null, idPasseador = null) {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BBH2oyhNjmKPnyR140S375tVHFM1wuSd7GW7ijm90Ja7NB2eX67YQRbDLVyW_QrLqiDpbIy9QecaBDC_K1AWCro' // Substitua pela sua chave pública gerada
    });

    // Envia a inscrição para o backend
    await fetch('http://localhost:3001/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        id_cliente: idCliente,
        id_passeador: idPasseador
      })
    });
  }
}