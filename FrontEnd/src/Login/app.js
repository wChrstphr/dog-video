const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

// Configuração do middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dogvideo'
});

// Verifica se a conexão foi estabelecida com sucesso
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão com o banco de dados estabelecida!');
  }
});

// Endpoint para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const query = 'SELECT * FROM clientes WHERE email = ? AND senha = ?';

    connection.query(query, [email, senha], (err, results) => {
      if (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        return res.status(500).send('Erro ao consultar o banco de dados');
      } else if (results.length > 0) {
        const user = results[0];
        console.log('Usuário autenticado:', user);
        const userType = user.tipo === 1 ? 'admin' : 'user';
        res.json({ success: true, userType: userType });
      } else {
        res.json({ success: false, message: 'Email ou senha incorretos' });
      }
    });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
