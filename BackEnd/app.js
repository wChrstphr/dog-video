const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;
const webPush = require('web-push');

// Configuração do middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Configuração do banco de dados
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

// Configuração das chaves VAPID
webPush.setVapidDetails(
  'mailto:232006663@aluno.unb.br',
  'BBH2oyhNjmKPnyR140S375tVHFM1wuSd7GW7ijm90Ja7NB2eX67YQRbDLVyW_QrLqiDpbIy9QecaBDC_K1AWCro', //chave pública gerada
  'Km-siZ1s_FTdpW594744qMlXuDgan3ve77AAAAWGTcU' //chave privada gerada
);

// Rota para salvar `subscriptions` no banco de dados
app.post('/subscribe', (req, res) => {
  const { subscription, id_cliente, id_passeador } = req.body;

  const query = `
    INSERT INTO subscriptions (endpoint, expiration_time, p256dh, auth, id_cliente, id_passeador)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    subscription.endpoint,
    subscription.expirationTime || null,
    subscription.keys.p256dh,
    subscription.keys.auth,
    id_cliente || null,
    id_passeador || null
  ];

  connection.query(query, values, (err) => {
    if (err) {
      console.error('Erro ao salvar subscription:', err);
      return res.status(500).json({ success: false, message: 'Erro ao salvar subscription' });
    }
    res.status(201).json({ success: true, message: 'Inscrição salva com sucesso!' });
  });
});

// Rota para criar e armazenar notificações
app.post('/notificacoes', (req, res) => {
  const { tipo, mensagem, id_cliente, id_passeador } = req.body;

  const query = `
    INSERT INTO notificacoes (tipo, mensagem, data_hora, id_cliente, id_passeador)
    VALUES (?, ?, NOW(), ?, ?)
  `;
  const values = [tipo, mensagem, id_cliente || null, id_passeador || null];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao salvar notificação:', err);
      return res.status(500).json({ success: false, message: 'Erro ao salvar notificação' });
    }

    res.status(201).json({ success: true, message: 'Notificação criada com sucesso!', id: result.insertId });
  });
});

// Rota para enviar notificações push
app.post('/send-notification', (req, res) => {
  const { id_notificacao } = req.body;

  // Recupera a notificação pelo ID
  const queryNotificacao = 'SELECT * FROM notificacoes WHERE id_notificacao = ?';
  connection.query(queryNotificacao, [id_notificacao], (err, notificacaoResult) => {
    if (err || notificacaoResult.length === 0) {
      console.error('Erro ao buscar notificação:', err);
      return res.status(404).json({ success: false, message: 'Notificação não encontrada' });
    }

    const notificacao = notificacaoResult[0];
    const payload = JSON.stringify({ title: notificacao.tipo, body: notificacao.mensagem });

    // Determina os usuários-alvo
    const querySubscriptions = `
      SELECT * FROM subscriptions 
      WHERE (id_cliente = ? OR id_passeador = ?) 
      OR (id_cliente IS NULL AND id_passeador IS NULL)
    `;
    connection.query(querySubscriptions, [notificacao.id_cliente, notificacao.id_passeador], (err, subscriptions) => {
      if (err) {
        console.error('Erro ao buscar subscriptions:', err);
        return res.status(500).json({ success: false, message: 'Erro ao buscar subscriptions' });
      }

      // Envia notificações para cada assinatura
      subscriptions.forEach((sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };

        webPush.sendNotification(pushSubscription, payload).catch((error) => {
          console.error('Erro ao enviar notificação push:', error);
        });
      });

      res.status(200).json({ success: true, message: 'Notificações enviadas com sucesso!' });
    });
  });
});

// Variáveis para controle de tentativas de login
const loginAttempts = {}; // Armazena tentativas de login { "email@example.com": { attempts: 0, lastAttempt: Date.now() } }
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 10 * 60 * 1000; // 10 minutos em milissegundos

// Endpoint para login com proteção contra ataques de força bruta
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verifica se o usuário está temporariamente bloqueado
  if (loginAttempts[email] && loginAttempts[email].attempts >= MAX_ATTEMPTS) {
    const timeSinceLastAttempt = Date.now() - loginAttempts[email].lastAttempt;
    if (timeSinceLastAttempt < LOCKOUT_TIME) {
      return res.status(429).json({ success: false, message: 'Muitas tentativas de login. Tente novamente mais tarde.' });
    } else {
      // Redefine o contador após o período de bloqueio
      loginAttempts[email] = { attempts: 0, lastAttempt: Date.now() };
    }
  }

  // Consulta para autenticação
  const query = 'SELECT * FROM clientes WHERE email = ? AND senha = ?';
  connection.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      return res.status(500).send('Erro ao consultar o banco de dados');
    }

    if (results.length > 0) {
      // Login bem-sucedido: reseta tentativas de login
      loginAttempts[email] = { attempts: 0, lastAttempt: Date.now() };
      const user = results[0];
      const userType = user.tipo === 1 ? 'admin' : 'user';

      // Retorna resposta de sucesso e dados do usuário
      res.json({
        success: true,
        userType: userType,
        alterar_senha: user.alterar_senha,
        id_cliente: user.id_cliente
      });
    } else {
      // Incrementa o contador de tentativas de login falhas
      if (!loginAttempts[email]) {
        loginAttempts[email] = { attempts: 1, lastAttempt: Date.now() };
      } else {
        loginAttempts[email].attempts += 1;
        loginAttempts[email].lastAttempt = Date.now();
      }

      // Retorna resposta de erro após tentativa falha
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

// Endpoint para criar um novo passeador
app.post('/criarpasseador', (req, res) => {
  const { nome, email, cpf, telefone, endereco, imagem } = req.body;

  // Converte a imagem base64 em Blob para salvar no banco de dados
  const imagemBlob = imagem ? Buffer.from(imagem.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null;

  const query = `
    INSERT INTO passeadores (nome, email, cpf, telefone, endereco, imagem)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [nome, email, cpf, telefone, endereco, imagemBlob], (err) => {
    if (err) {
      console.error('Erro ao criar passeador:', err);
      return res.status(500).json({ success: false, message: 'Erro ao criar passeador' });
    }
    res.json({ success: true, message: 'Passeador criado com sucesso!' });
  });
});

// Endpoint para excluir um passeador pelo ID
app.delete('/passeadores/:id', (req, res) => {
  const passeadorId = req.params.id;
  const deleteQuery = 'DELETE FROM passeadores WHERE id_passeador = ?';

  connection.query(deleteQuery, [passeadorId], (err) => {
    if (err) {
      console.error('Erro ao excluir passeador:', err);
      return res.status(500).json({ success: false, message: 'Erro ao excluir passeador' });
    }
    res.json({ success: true, message: 'Passeador excluído com sucesso!' });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});