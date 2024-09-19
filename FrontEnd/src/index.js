import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Web from './TelaInicial/Web';
import Login from './Login/login';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <React.StrictMode>
      {isLoggedIn ? <Web /> : <Login onLogin={handleLogin} />}
    </React.StrictMode>
  );
}

root.render(<App />);

reportWebVitals();