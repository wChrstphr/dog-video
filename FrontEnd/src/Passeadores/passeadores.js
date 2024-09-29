import './passeadores.css';
import React from 'react';
import { useNavigate } from "react-router-dom";

function Passeadores() {

  const navigate = useNavigate();
  
    return (
        <div className="Web">
            <header className="Web-header">
                <img src="/logotipo.svg" className="Web-logotipo" alt="Dogvideo Logomarca" />
                <div className="footer-bar"></div>
            </header>

            <div className="header-icons">
              <div className="icon-container">
                  <img src="/search.svg" alt="Ícone de busca" className="icon"/>
              </div>
              <div className="icon-container">
                  <img src="/add.svg" alt="Ícone de adicionar" className="icon"/>
              </div>
              <div className="icon-container">
                  <img src="/filter.svg" alt="Ícone de filtro" className="icon"/>
              </div>
            </div>


            <img
              src="/Back.svg"
              alt="Ícone de voltar"
              className="back-icon"
              onClick={() => navigate("/admin")}
            />

            <div className="passeador-list">
                {['passeador numero 1', 'passeador numero 2', 'passeador numero 3', 'passeador numero 4', 'passeador numero 6', 'passeador numero 7', 'passeador numero 8', 'passeador numero 9', 'passeador numero 10'].map((passeador, index) => (
                    <div className="passeador-item" key={index}>
                        <span>{passeador}</span>
                        <button className="delete-button">
                            <img src="/trash.svg" alt="Deletar" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Passeadores;
