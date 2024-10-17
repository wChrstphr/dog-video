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

// Endpoint para aparecer os clientes
app.get('/clientes', (req, res) => {
  const query = 'SELECT * FROM clientes WHERE tipo = 0';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      return res.status(500).send('Erro ao consultar o banco de dados');
    }
    res.json(results);
  });
});

// Endpoint para criar um cliente
app.post('/criarcliente', (req, res) => {
  const { nome, email, cpf, telefone, endereco, pacote, horario, anotacao, caes } = req.body;

  // Query para inserir um novo cliente
  const insertClientQuery = 'INSERT INTO clientes (nome, email, cpf, telefone, endereco, pacote, horario_passeio, anotacoes, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)';

  // Executa a inserção do cliente
  connection.query(
    insertClientQuery,
    [nome, email, cpf, telefone, endereco, pacote, horario, anotacao],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir cliente:', err);
        return res.status(500).send('Erro ao inserir cliente');
      }

      const clienteId = result.insertId; // Obtém o ID do cliente inserido

      // Verifica se há cães para adicionar
      if (caes && caes.length > 0) {
        const insertDogQuery = 'INSERT INTO cachorros (nome, id_cliente) VALUES ?';

        // Formata os valores dos cães para a inserção em massa
        const dogValues = caes.map((cao) => [cao, clienteId]);

        connection.query(insertDogQuery, [dogValues], (err) => {
          if (err) {
            console.error('Erro ao inserir cães:', err);
            return res.status(500).send('Erro ao inserir cães');
          }

          res.json({ success: true, message: 'Cliente e cães adicionados com sucesso!' });
        });
      } else {
        res.json({ success: true, message: 'Cliente adicionado com sucesso!' });
      }
    }
  );
});

// Endpoint para excluir um cliente e seus cachorros
app.delete('/clientes/:id', (req, res) => {
  const clienteId = req.params.id;

  // Query para deletar os cachorros associados ao cliente
  const deleteCachorrosQuery = 'DELETE FROM cachorros WHERE id_cliente = ?';
  // Query para deletar o cliente
  const deleteClienteQuery = 'DELETE FROM clientes WHERE id_cliente = ?';

  // Deletar os cachorros associados ao cliente
  connection.query(deleteCachorrosQuery, [clienteId], (err) => {
    if (err) {
      console.error('Erro ao deletar cachorros:', err);
      return res.status(500).send('Erro ao deletar cachorros');
    }

    // Deletar o cliente após deletar os cachorros
    connection.query(deleteClienteQuery, [clienteId], (err) => {
      if (err) {
        console.error('Erro ao deletar cliente:', err);
        return res.status(500).send('Erro ao deletar cliente');
      }

      res.json({ success: true, message: 'Cliente e seus cachorros deletados com sucesso!' });
    });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});