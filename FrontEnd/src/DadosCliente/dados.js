import "./dados.css";
import { useNavigate } from "react-router-dom";

function Dados({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="Dados">
      <header className="Web-header">
        <img
          src="/Back.svg"
          alt="Ícone de voltar"
          className="back-icon"
          onClick={() => {
            navigate('/');
          }}
        />
        <img
          src="/logotipo.svg"
          className="Web-logotipo"
          alt="Dogvideo Logotipo"
        />
        <img
          src="/logout.svg"
          alt="Ícone de logout"
          className="user-icon"
          onClick={() => {
            onLogout(); // Chama a função de logout
            navigate('/'); // Redireciona para a página de login
          }}
        />
        <div className="footer-bar"></div> {/* Barrinha inferior */}
      </header>

      <main className="Main-content">
        <h1>Nome Completo</h1>

        {/* Primeira linha de cards */}
        <div className="Dados-grid">
          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">CACHORRO</div>
            </div>
            <div className="Card-content">
              <ul>
                <li>Cachorro1</li>
                <li>Cachorro2</li>
              </ul>
            </div>
          </div>

          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">ASSINATURA</div>
            </div>
            <div className="Card-content">Plano</div>
          </div>

          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">HORÁRIO</div>
            </div>
            <div className="Card-content">
              <ul>
                <li>08 - 08:45 hrs</li>
                <li>Segunda a sexta</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Segunda linha de cards */}
        <div className="Dados-grid">
          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">Dados Pessoais</div>
            </div>
            <div className="Card-content">
              <ul>
                <li>cliente@gmail.com</li>
                <li>CPF: 000.000.000-00</li>
              </ul>
            </div>
          </div>

          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">Contato</div>
            </div>
            <div className="Card-content">(61) 9999-99999</div>
          </div>

          <div className="Card">
            <div className="Card-header-bg">
              <div className="Card-header">Endereço</div>
            </div>
            <div className="Card-content">Rua das Laranjaeiras apt. 1003 Torre 07 Residencial DogVideo</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dados;
