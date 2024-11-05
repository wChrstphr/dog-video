const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

// Configuração do middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Limite aumentado para suportar imagens maiores
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dogvideo'
});

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

      // Inclui o 'id_cliente' na resposta, junto com 'alterar_senha'
      res.json({
        success: true,
        userType: userType,
        alterar_senha: user.alterar_senha,
        id_cliente: user.id_cliente
      });
    } else {
      res.json({ success: false, message: 'Email ou senha incorretos' });
    }
  });
});

// Endpoint para alterar a senha
app.post('/alterar-senha', (req, res) => {
  const { novaSenha, id_cliente } = req.body;

  if (!id_cliente) {
    return res.status(400).json({ success: false, message: 'ID do cliente não fornecido' });
  }

  const query = 'UPDATE clientes SET senha = ?, alterar_senha = 0 WHERE id_cliente = ?';

  connection.query(query, [novaSenha, id_cliente], (err) => {
    if (err) {
      console.error('Erro ao atualizar a senha:', err);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar a senha' });
    }

    // Retorna JSON para confirmação de sucesso
    res.json({ success: true, message: 'Senha alterada com sucesso!' });
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
  const { nome, email, cpf, telefone, endereco, pacote, horario, anotacao, caes, id_passeador } = req.body;

  // Query para inserir um novo cliente
  const insertClientQuery = 'INSERT INTO clientes (nome, email, cpf, telefone, endereco, pacote, horario_passeio, anotacoes, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)';

  connection.query(insertClientQuery, [nome, email, cpf, telefone, endereco, pacote, horario, anotacao], (err, result) => {
    if (err) {
      console.error('Erro ao inserir cliente:', err);
      return res.status(500).send('Erro ao inserir cliente');
    }

    const clienteId = result.insertId;

    // Verifica se há cães para adicionar
    if (caes && caes.length > 0) {
      const insertDogQuery = 'INSERT INTO cachorros (nome, id_cliente, id_passeador) VALUES ?';
      const dogValues = caes.map((cao) => [cao, clienteId, id_passeador]); // Inclui id_passeador

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
  });
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

// Endpoint para buscar informações de um cliente específico, seus cachorros e o passeador
app.get('/cliente/:id', (req, res) => {
  const clienteId = req.params.id;

  // Query para buscar as informações do cliente
  const queryCliente = 'SELECT * FROM clientes WHERE id_cliente = ?';
  const queryCachorros = 'SELECT nome FROM cachorros WHERE id_cliente = ?';
  const queryPasseador = `
    SELECT p.nome AS passeador_nome
    FROM passeadores p
    JOIN cachorros c ON c.id_passeador = p.id_passeador
    WHERE c.id_cliente = ?
    LIMIT 1
  `;

  // Consultar os dados do cliente
  connection.query(queryCliente, [clienteId], (err, clienteResults) => {
    if (err) {
      console.error('Erro ao consultar cliente:', err);
      return res.status(500).send('Erro ao consultar cliente');
    }

    if (clienteResults.length === 0) {
      return res.status(404).send('Cliente não encontrado');
    }

    const cliente = clienteResults[0];

    // Formatar horário para mostrar apenas HH:MM
    if (cliente.horario_passeio) {
      cliente.horario_passeio = cliente.horario_passeio.slice(0, 5);
    }

    // Consultar os cachorros associados ao cliente
    connection.query(queryCachorros, [clienteId], (err, cachorroResults) => {
      if (err) {
        console.error('Erro ao consultar cachorros:', err);
        return res.status(500).send('Erro ao consultar cachorros');
      }

      const caes = cachorroResults.map(cachorro => cachorro.nome);
      cliente.caes = caes; // Adiciona os cães ao objeto cliente

      // Consultar o passeador associado aos cachorros do cliente
      connection.query(queryPasseador, [clienteId], (err, passeadorResults) => {
        if (err) {
          console.error('Erro ao consultar passeador:', err);
          return res.status(500).send('Erro ao consultar passeador');
        }

        const passeadorNome = passeadorResults.length > 0 ? passeadorResults[0].passeador_nome : null;
        cliente.passeador = passeadorNome; // Adiciona o nome do passeador ao cliente

        // Retorna os dados do cliente, cachorros e passeador
        res.json(cliente);
      });
    });
  });
});

// Endpoint para atualizar um cliente
app.put('/cliente/:id', (req, res) => {
  const clienteId = req.params.id;
  const { nome, email, cpf, telefone, endereco, pacote, horario_passeio, anotacoes, caes, id_passeador } = req.body;

  // Query para atualizar os dados do cliente
  const updateClienteQuery = `
    UPDATE clientes
    SET nome = ?, email = ?, cpf = ?, telefone = ?, endereco = ?, pacote = ?, horario_passeio = ?, anotacoes = ?
    WHERE id_cliente = ?`;

  // Executa a atualização do cliente
  connection.query(
    updateClienteQuery,
    [nome, email, cpf, telefone, endereco, pacote, horario_passeio, anotacoes, clienteId],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar cliente:', err);
        return res.status(500).send('Erro ao atualizar cliente');
      }

      // Atualiza os cães associados ao cliente, com o id_passeador atualizado
      const deleteCachorrosQuery = 'DELETE FROM cachorros WHERE id_cliente = ?';
      connection.query(deleteCachorrosQuery, [clienteId], (err) => {
        if (err) {
          console.error('Erro ao deletar cachorros:', err);
          return res.status(500).send('Erro ao deletar cachorros');
        }

        if (caes && caes.length > 0) {
          const insertDogQuery = 'INSERT INTO cachorros (nome, id_cliente, id_passeador) VALUES ?';
          const dogValues = caes.map((cao) => [cao, clienteId, id_passeador]); // Inclui id_passeador para cada cachorro

          connection.query(insertDogQuery, [dogValues], (err) => {
            if (err) {
              console.error('Erro ao inserir cães:', err);
              return res.status(500).send('Erro ao inserir cães');
            }

            res.json({ success: true, message: 'Cliente e passeador atualizados com sucesso!' });
          });
        } else {
          res.json({ success: true, message: 'Cliente atualizado com sucesso!' });
        }
      });
    }
  );
});

// Endpoint para buscar os passeadores
app.get('/passeadores', (req, res) => {
  const query = 'SELECT id_passeador, nome FROM passeadores';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar passeadores:', err);
      return res.status(500).send('Erro ao consultar passeadores');
    }
    res.json(results);
  });
});

// Endpoint para buscar informações detalhadas de um passeador e os clientes associados
app.get('/passeador/:id', (req, res) => {
  const passeadorId = req.params.id;
  const queryPasseador = `
    SELECT nome, email, imagem, cpf, telefone, endereco 
    FROM passeadores 
    WHERE id_passeador = ?`;

  const queryClientes = `
    SELECT DISTINCT clientes.nome 
    FROM clientes
    JOIN cachorros ON cachorros.id_cliente = clientes.id_cliente
    WHERE cachorros.id_passeador = ?`;

  connection.query(queryPasseador, [passeadorId], (err, passeadorResults) => {
    if (err) {
      console.error('Erro ao consultar passeador:', err);
      return res.status(500).send('Erro ao consultar passeador');
    }

    if (passeadorResults.length === 0) {
      return res.status(404).send('Passeador não encontrado');
    }

    const passeador = passeadorResults[0];

    if (passeador.imagem) {
      passeador.imagem = `data:image/jpeg;base64,${passeador.imagem.toString('base64')}`;
    }

    // Consultar todos os clientes associados ao passeador
    connection.query(queryClientes, [passeadorId], (err, clienteResults) => {
      if (err) {
        console.error('Erro ao consultar clientes:', err);
        return res.status(500).send('Erro ao consultar clientes');
      }

      // Combina os nomes dos clientes em uma única string separada por vírgulas
      const clientes = clienteResults.map(cliente => cliente.nome).join(', ');

      res.json({ passeador, clientes });
    });
  });
});

// Endpoint para atualizar os dados de um passeador
app.put('/passeador/:id', (req, res) => {
  const passeadorId = req.params.id;
  const { nome, email, cpf, telefone, endereco, imagem } = req.body;

  // Conversão de base64 para Blob (Binário)
  const imagemBlob = imagem ? Buffer.from(imagem.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null;

  const query = `
    UPDATE passeadores
    SET nome = ?, email = ?, cpf = ?, telefone = ?, endereco = ?, imagem = ?
    WHERE id_passeador = ?
  `;
  
  connection.query(query, [nome, email, cpf, telefone, endereco, imagemBlob, passeadorId], (err) => {
    if (err) {
      console.error('Erro ao atualizar passeador:', err);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar passeador' });
    }
    res.json({ success: true, message: 'Passeador atualizado com sucesso!' });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});