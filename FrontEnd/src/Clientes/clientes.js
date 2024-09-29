import './clientes.css';
import React from 'react';
import { useNavigate } from "react-router-dom";

function Clientes() {

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
              onClick={() => navigate("/")}
            />

            <div className="client-list">
                {['cliente numero 1', 'cliente numero 2', 'cliente numero 3', 'cliente numero 4', 'cliente numero 5'].map((cliente, index) => (
                    <div className="client-item" key={index}>
                        <span>{cliente}</span>
                        <button className="delete-button">
                            <img src="/trash.svg" alt="Deletar" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Clientes;
