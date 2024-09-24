import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web from './TelaInicial/Web';
import Login from './Login/login';
import DadosCliente from './DadosCliente/dados';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <Web onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/dados-cliente" 
            element={<DadosCliente onLogout={handleLogout} />} 
          />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

root.render(<App />);

reportWebVitals();
