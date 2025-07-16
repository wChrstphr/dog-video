const express = require('express');
const { Pool } = require('pg'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;
const webPush = require('web-push');
const bcrypt = require('bcryptjs'); 
const saltRounds = 10;
const cron = require('node-cron');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const authenticateToken = require('./middleware/auth');
const jwt = require('jsonwebtoken');
dayjs.extend(customParseFormat);
const dotenv = require('dotenv');
dotenv.config();

// Configuração do middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Conexão com o PostgreSQL (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

// Teste de conexão (opcional)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão bem-sucedida com PostgreSQL. Hora atual:', res.rows[0].now);
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
  const { subscription, id_cliente } = req.body; // id_passeador não será usado aqui
  const endpoint = subscription.endpoint;
  const p256dh = subscription.keys.p256dh;
  const auth = subscription.keys.auth;

  // Verifica se já existe uma subscription para esse endpoint e para esse cliente
  const checkQuery = 'SELECT * FROM subscriptions WHERE endpoint = $1 AND id_cliente = $2';
  pool.query(checkQuery, [endpoint, id_cliente], (err, results) => {
    if (err) {
      console.error('Erro ao buscar subscription:', err);
      return res.status(500).json({ success: false, message: 'Erro ao buscar subscription' });
    }

    if (results.rows.length > 0) {
      // Já existe uma inscrição para esse cliente e esse dispositivo: não altera
      return res.status(200).json({ success: true, message: 'Subscription já existe para esse cliente.' });
    } else {
      // Se não existe, insere uma nova inscrição
      const insertQuery = `
        INSERT INTO subscriptions (endpoint, p256dh, auth, id_cliente)
        VALUES ($1, $2, $3, $4)
      `;
      pool.query(
        insertQuery,
        [endpoint, p256dh, auth, id_cliente || null],
        (err) => {
          if (err) {
            console.error('Erro ao inserir subscription:', err);
            return res.status(500).json({ success: false, message: 'Erro ao inserir subscription' });
          }
          return res.status(201).json({ success: true, message: 'Subscription salva com sucesso!' });
        }
      );
    }
  });
});

// Rota para criar e armazenar notificações
app.post('/notificacoes', (req, res) => {
  const { tipo, mensagem, id_cliente, id_passeador } = req.body;
  const query = `
    INSERT INTO notificacoes (tipo, mensagem, data_hora, id_cliente, id_passeador)
    VALUES ($1, $2, NOW(), $3, $4)
  `;
  const values = [tipo, mensagem, id_cliente || null, id_passeador || null];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao salvar notificação:', err);
      return res.status(500).json({ success: false, message: 'Erro ao salvar notificação' });
    }
    res.status(201).json({ success: true, message: 'Notificação criada com sucesso!' });
  });
});

// Rota para enviar notificações push manualmente (se necessário)
app.post('/send-notification', (req, res) => {
  const { id_notificacao } = req.body;
  const queryNotificacao = 'SELECT * FROM notificacoes WHERE id_notificacao = $1';
  pool.query(queryNotificacao, [id_notificacao], (err, notificacaoResult) => {
    if (err || notificacaoResult.rows.length === 0) {
      console.error('Erro ao buscar notificação:', err);
      return res.status(404).json({ success: false, message: 'Notificação não encontrada' });
    }
    const notificacao = notificacaoResult.rows[0];
    const payload = JSON.stringify({ title: notificacao.tipo, body: notificacao.mensagem });
    const querySubscriptions = `
      SELECT * FROM subscriptions 
      WHERE (id_cliente = $1 OR id_passeador = $2) 
      OR (id_cliente IS NULL AND id_passeador IS NULL)
    `;
    pool.query(querySubscriptions, [notificacao.id_cliente, notificacao.id_passeador], (err, subscriptions) => {
      if (err) {
        console.error('Erro ao buscar subscriptions:', err);
        return res.status(500).json({ success: false, message: 'Erro ao buscar subscriptions' });
      }
      subscriptions.rows.forEach((sub) => {
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

// Cron job para enviar notificação 5 minutos antes do passeio
cron.schedule('* * * * *', () => {
  const query = 'SELECT id_cliente, horario_passeio FROM clientes WHERE tipo = 0';
  pool.query(query, (err, clientes) => {
    if (err) {
      console.error('Erro ao buscar clientes para notificação:', err);
      return;
    }
    const now = dayjs();
    clientes.rows.forEach((cliente) => {
      const walkTime = dayjs(cliente.horario_passeio, 'HH:mm:ss');
      const notificationTime = walkTime.subtract(5, 'minute');
      if (now.format('HH:mm') === notificationTime.format('HH:mm')) {
        const subQuery = 'SELECT * FROM subscriptions WHERE id_cliente = $1';
        pool.query(subQuery, [cliente.id_cliente], (err, subscriptions) => {
          if (err) {
            console.error('Erro ao buscar subscriptions para notificação:', err);
            return;
          }
          subscriptions.rows.forEach((sub) => {
            const pushSubscription = {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            };
            const payload = JSON.stringify({
              title: 'Lembrete de Passeio',
              body: 'Seu pet começará o passeio em 5 minutos!'
            });
            webPush.sendNotification(pushSubscription, payload).catch((error) => {
              console.error('Erro ao enviar notificação push:', error);
            });
          });
        });
      }
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

  // Consulta para buscar o cliente pelo email
  const query = 'SELECT * FROM clientes WHERE email = $1';
  pool.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      return res.status(500).json({ success: false, message: 'Erro ao consultar o banco de dados' });
    }

    if (results.rows.length === 0) {
      // Incrementa o contador de tentativas de login falhas
      if (!loginAttempts[email]) {
        loginAttempts[email] = { attempts: 1, lastAttempt: Date.now() };
      } else {
        loginAttempts[email].attempts += 1;
        loginAttempts[email].lastAttempt = Date.now();
      }

      return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
    }

    const cliente = results.rows[0];

    // Compara a senha digitada com o hash armazenado no banco
    const match = await bcrypt.compare(senha, cliente.senha);

    if (!match) {
      // Incrementa o contador de tentativas de login falhas
      if (!loginAttempts[email]) {
        loginAttempts[email] = { attempts: 1, lastAttempt: Date.now() };
      } else {
        loginAttempts[email].attempts += 1;
        loginAttempts[email].lastAttempt = Date.now();
      }

      return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
    }

    // Login bem-sucedido: reseta tentativas de login
    loginAttempts[email] = { attempts: 0, lastAttempt: Date.now() };

    const userType = cliente.tipo === 1 ? 'admin' : 'user';

    // Gera um token JWT para ser possível fazer a verificação de login nas rotas /admin, /clientes, /passeadores ....
    const token = jwt.sign({ id: cliente.id_cliente, email: cliente.email, userType: userType }, 'your_secret_key', { expiresIn: '1h' });

    // Retorna resposta de sucesso e dados do usuário
    res.json({
      success: true,
      userType: userType,
      alterar_senha: cliente.alterar_senha,
      id_cliente: cliente.id_cliente,
    });
  });
});

// Endpoint para alterar a senha
app.post('/alterar-senha', async (req, res) => {
  const { novaSenha, id_cliente } = req.body;

  if (!id_cliente) {
    return res.status(400).json({ success: false, message: 'ID do cliente não fornecido' });
  }

  try {
    // Gera o hash da nova senha antes de salvar no banco
    const hashedPassword = await bcrypt.hash(novaSenha, saltRounds);

    // Atualiza a senha do cliente no banco de dados
    const query = 'UPDATE clientes SET senha = $1, alterar_senha = 0 WHERE id_cliente = $2';

    pool.query(query, [hashedPassword, id_cliente], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar senha:', err);
        return res.status(500).json({ success: false, message: 'Erro ao atualizar senha' });
      }

      // Verifica se o ID do cliente existe no banco de dados
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
      }

      res.json({ success: true, message: 'Senha redefinida com sucesso!' });
    });

  } catch (error) {
    console.error('Erro ao criptografar senha:', error);
    res.status(500).json({ success: false, message: 'Erro ao processar senha' });
  }
});

// Endpoint para aparecer os clientes
app.get('/clientes', (req, res) => {
  const query = 'SELECT * FROM clientes WHERE tipo = 0';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      return res.status(500).send('Erro ao consultar o banco de dados');
    }
    res.json(results.rows);
  });
});

// Endpoint unificado para buscar os dados completos de um cliente
app.get('/clientes/:id', (req, res) => {
  const clienteId = req.params.id;

  // Consulta para buscar informações básicas do cliente
  const queryCliente = `
    SELECT * 
    FROM clientes 
    WHERE id_cliente = $1`;

  // Consulta para buscar os cachorros do cliente
  const queryCachorros = `
    SELECT nome 
    FROM cachorros 
    WHERE id_cliente = $1`;

  // Consulta para buscar o passeador do cliente via cachorros
  const queryPasseador = `
    SELECT p.nome AS passeador_nome
    FROM passeadores p
    JOIN cachorros c ON c.id_passeador = p.id_passeador
    WHERE c.id_cliente = $1
    LIMIT 1`;

  // Consultar os dados do cliente
  pool.query(queryCliente, [clienteId], (err, clienteResults) => {
    if (err) {
      console.error('Erro ao consultar cliente:', err);
      return res.status(500).json({ success: false, message: 'Erro ao consultar cliente' });
    }

    if (clienteResults.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
    }

    const cliente = clienteResults.rows[0];

    // Formatar horário para mostrar apenas HH:MM, se disponível
    if (cliente.horario_passeio) {
      cliente.horario_passeio = cliente.horario_passeio.slice(0, 5);
    }

    // Consultar os cachorros associados ao cliente
    pool.query(queryCachorros, [clienteId], (err, cachorroResults) => {
      if (err) {
        console.error('Erro ao consultar cachorros:', err);
        return res.status(500).json({ success: false, message: 'Erro ao consultar cachorros' });
      }

      const caes = cachorroResults.rows.map(cachorro => cachorro.nome);
      cliente.caes = caes; // Adiciona os cães ao objeto cliente

      // Consultar o passeador associado aos cachorros do cliente
      pool.query(queryPasseador, [clienteId], (err, passeadorResults) => {
        if (err) {
          console.error('Erro ao consultar passeador:', err);
          return res.status(500).json({ success: false, message: 'Erro ao consultar passeador' });
        }

        const passeadorNome = passeadorResults.rows.length > 0 ? passeadorResults.rows[0].passeador_nome : null;
        cliente.passeador = passeadorNome; // Adiciona o nome do passeador ao cliente

        // Retorna os dados consolidados
        res.json({
          success: true,
          cliente: {
            ...cliente,
            caes,
            passeador: passeadorNome
          },
        });
      });
    });
  });
});

// Endpoint para atualizar um cliente
app.put('/clientes/:id', (req, res) => {
  const clienteId = req.params.id;
  const { nome, email, cpf, telefone, endereco, pacote, horario_passeio, anotacoes, caes, id_passeador } = req.body;

  // Atualiza os dados do cliente
  const updateClienteQuery = `
    UPDATE clientes
    SET nome = $1, email = $2, cpf = $3, telefone = $4, endereco = $5, pacote = $6, horario_passeio = $7, anotacoes = $8
    WHERE id_cliente = $9`;

  pool.query(
    updateClienteQuery,
    [nome, email, cpf, telefone, endereco, pacote, horario_passeio, anotacoes, clienteId],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar cliente:', err);
        return res.status(500).send('Erro ao atualizar cliente');
      }

      // Atualiza o ID do passeador apenas se ele for fornecido e válido
      if (id_passeador && !isNaN(id_passeador)) {
        const updatePasseadorQuery = `
          UPDATE cachorros 
          SET id_passeador = $1 
          WHERE id_cliente = $2`;
      
        pool.query(updatePasseadorQuery, [id_passeador, clienteId], (err) => {
          if (err) {
            console.error('Erro ao atualizar passeador dos cachorros:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar passeador dos cachorros' });
          }
        });
      } else {
        console.warn(`ID do passeador inválido: ${id_passeador}. Atualização do passeador ignorada.`);
      }      

      // Verifica se há novos cães para adicionar
      if (caes && caes.length > 0) {
        // Consulta para buscar os nomes dos cachorros existentes
        const selectCachorrosQuery = 'SELECT nome FROM cachorros WHERE id_cliente = $1';
        pool.query(selectCachorrosQuery, [clienteId], (err, existingDogs) => {
          if (err) {
            console.error('Erro ao consultar cachorros existentes:', err);
            return res.status(500).send('Erro ao consultar cachorros existentes');
          }
      
          const existingDogNames = existingDogs.rows.map(dog => dog.nome); // Nomes dos cachorros existentes no banco
          const newDogs = caes.filter(cao => !existingDogNames.includes(cao)); // Cachorros novos
          const dogsToDelete = existingDogNames.filter(existingDog => !caes.includes(existingDog)); // Cachorros a excluir
      
          // Exclui cachorros que não estão mais na lista
          if (dogsToDelete.length > 0) {
            const deleteDogsQuery = 'DELETE FROM cachorros WHERE id_cliente = $1 AND nome = ANY($2)';
            pool.query(deleteDogsQuery, [clienteId, dogsToDelete], (err) => {
              if (err) {
                console.error('Erro ao deletar cachorros:', err);
                return res.status(500).send('Erro ao deletar cachorros');
              }
            });
          }
      
          // Insere cachorros novos
          if (newDogs.length > 0) {
            const insertDogQuery = 'INSERT INTO cachorros (nome, id_cliente, id_passeador) VALUES ($1, $2, $3)';
            newDogs.forEach(cao => {
              pool.query(insertDogQuery, [cao, clienteId, id_passeador || null], (err) => {
                if (err) {
                  console.error('Erro ao inserir novos cães:', err);
                  return res.status(500).send('Erro ao inserir novos cães');
                }
              });
            });
            res.json({ success: true, message: 'Cliente e cachorros atualizados com sucesso!' });
          } else {
            res.json({ success: true, message: 'Cliente atualizado com sucesso!' });
          }
        });
      } else {
        res.json({ success: true, message: 'Cliente atualizado sem mudanças nos cachorros!' });
      }      
    }
  );
});

// Endpoint para redefinir a senha do cliente
app.put('/clientes/:id/reset-senha', async (req, res) => {
  const clienteId = req.params.id;
  console.log(`Resetando senha para o cliente ID: ${clienteId}`); // <-- Adiciona um log para depuração

  if (!clienteId) {
    return res.status(400).json({ success: false, message: 'ID do cliente não fornecido' });
  }

  try {
    const novaSenha = 'dog123';
    const senhaHash = await bcrypt.hash(novaSenha, 10); // Gera um hash seguro

    const updatePasswordQuery = `
      UPDATE clientes 
      SET senha = $1, alterar_senha = 1 
      WHERE id_cliente = $2`;

    pool.query(updatePasswordQuery, [senhaHash, clienteId], (err, result) => {
      if (err) {
        console.error('Erro ao redefinir senha:', err);
        return res.status(500).json({ success: false, message: 'Erro ao redefinir senha' });
      }

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
      }

      res.json({ success: true, message: 'Senha redefinida com sucesso!' });
    });
  } catch (error) {
    console.error('Erro ao processar senha:', error);
    res.status(500).json({ success: false, message: 'Erro interno ao processar senha' });
  }
});

// Endpoint para criar um cliente
app.post('/criarcliente', async (req, res) => {
  const { nome, email, cpf, telefone, endereco, pacote, horario, anotacao, caes, id_passeador } = req.body;

  try {
    // Gera o hash da senha padrão "dog123"
    const hashedPassword = await bcrypt.hash('dog123', saltRounds);

    // Query para inserir um novo cliente com a senha encriptada
    const insertClientQuery = `
      INSERT INTO clientes (nome, email, cpf, telefone, endereco, pacote, horario_passeio, anotacoes, tipo, senha)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9)
    `;

    pool.query(insertClientQuery, [nome, email, cpf, telefone, endereco, pacote, horario, anotacao, hashedPassword], (err, result) => {
      if (err) {
        console.error('Erro ao inserir cliente:', err);
        return res.status(500).send('Erro ao inserir cliente');
      }

      const clienteId = result.rows[0].id_cliente;

      // Verifica se há cães para adicionar
      if (caes && caes.length > 0) {
        const insertDogQuery = 'INSERT INTO cachorros (nome, id_cliente, id_passeador) VALUES ($1, $2, $3)';
        caes.forEach(cao => {
          pool.query(insertDogQuery, [cao, clienteId, id_passeador], (err) => {
            if (err) {
              console.error('Erro ao inserir cães:', err);
              return res.status(500).send('Erro ao inserir cães');
            }
          });
        });
        res.json({ success: true, message: 'Cliente e cães adicionados com sucesso!' });
      } else {
        res.json({ success: true, message: 'Cliente adicionado com sucesso!' });
      }
    });
  } catch (error) {
    console.error('Erro ao criar hash da senha:', error);
    res.status(500).send('Erro ao processar senha');
  }
});

// Endpoint para excluir um cliente e seus cachorros
app.delete('/clientes/:id', (req, res) => {
  const clienteId = req.params.id;

  // Query para deletar os cachorros associados ao cliente
  const deleteCachorrosQuery = 'DELETE FROM cachorros WHERE id_cliente = $1';
  // Query para deletar o cliente
  const deleteClienteQuery = 'DELETE FROM clientes WHERE id_cliente = $1';

  // Deletar os cachorros associados ao cliente
  pool.query(deleteCachorrosQuery, [clienteId], (err) => {
    if (err) {
      console.error('Erro ao deletar cachorros:', err);
      return res.status(500).send('Erro ao deletar cachorros');
    }

    // Deletar o cliente após deletar os cachorros
    pool.query(deleteClienteQuery, [clienteId], (err) => {
      if (err) {
        console.error('Erro ao deletar cliente:', err);
        return res.status(500).send('Erro ao deletar cliente');
      }

      res.json({ success: true, message: 'Cliente e seus cachorros deletados com sucesso!' });
    });
  });
});

// Endpoint para buscar passeadores com imagens ou informações detalhadas de um passeador específico
app.get('/passeadores/:id?', (req, res) => {
  const passeadorId = req.params.id; // ID opcional

  if (passeadorId) {
    // Caso o ID seja fornecido, busca detalhes do passeador e seus clientes associados
    const queryPasseador = `
      SELECT nome, email, imagem, cpf, telefone, endereco, modulo 
      FROM passeadores 
      WHERE id_passeador = $1`;

    const queryClientes = `
      SELECT DISTINCT clientes.nome 
      FROM clientes
      JOIN cachorros ON cachorros.id_cliente = clientes.id_cliente
      WHERE cachorros.id_passeador = $1`;

    pool.query(queryPasseador, [passeadorId], (err, passeadorResults) => {
      if (err) {
        console.error('Erro ao consultar passeador:', err);
        return res.status(500).send('Erro ao consultar passeador');
      }

      if (passeadorResults.rows.length === 0) {
        return res.status(404).send('Passeador não encontrado');
      }

      const passeador = passeadorResults.rows[0];

      if (passeador.imagem) {
        passeador.imagem = `data:image/jpeg;base64,${passeador.imagem.toString('base64')}`;
      }

      // Consultar todos os clientes associados ao passeador
      pool.query(queryClientes, [passeadorId], (err, clienteResults) => {
        if (err) {
          console.error('Erro ao consultar clientes:', err);
          return res.status(500).send('Erro ao consultar clientes');
        }

        // Combina os nomes dos clientes em uma única string separada por vírgulas
        const clientes = clienteResults.rows.map(cliente => cliente.nome).join(', ');

        res.json({ success: true, passeador, clientes });
      });
    });
  } else {
    // Caso o ID não seja fornecido, busca todos os passeadores com imagens
    const queryTodosPasseadores = `
      SELECT id_passeador, nome, imagem
      FROM passeadores`;

    pool.query(queryTodosPasseadores, (err, results) => {
      if (err) {
        console.error('Erro ao consultar passeadores:', err);
        return res.status(500).json({ success: false, message: 'Erro ao consultar passeadores' });
      }

      // Formata os resultados
      const passeadores = results.rows.map(passeador => ({
        id: passeador.id_passeador,
        nome: passeador.nome,
        imagem: passeador.imagem ? `data:image/jpeg;base64,${passeador.imagem.toString('base64')}` : null
      }));

      res.json({ success: true, passeadores });
    });
  }
});

// Endpoint para atualizar os dados de um passeador
app.put('/passeadores/:id', (req, res) => {
  const passeadorId = req.params.id;
  const { nome, email, cpf, telefone, endereco, imagem, modulo } = req.body;

  // Conversão de base64 para Blob (Binário)
  const imagemBlob = imagem ? Buffer.from(imagem.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null;

  const query = `
    UPDATE passeadores
    SET nome = $1, email = $2, cpf = $3, telefone = $4, endereco = $5, imagem = $6, modulo = $7
    WHERE id_passeador = $8
  `;
  
  pool.query(query, [nome, email, cpf, telefone, endereco, imagemBlob, modulo, passeadorId], (err) => {
    if (err) {
      console.error('Erro ao atualizar passeador:', err);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar passeador' });
    }
    res.json({ success: true, message: 'Passeador atualizado com sucesso!' });
  });
});

// Endpoint para criar um novo passeador
app.post('/criarpasseador', (req, res) => {
  const { nome, email, cpf, telefone, endereco, imagem, modulo } = req.body; // inclua modulo

  // Converte a imagem base64 em Blob para salvar no banco de dados
  const imagemBlob = imagem ? Buffer.from(imagem.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null;

  const query = `
    INSERT INTO passeadores (nome, email, cpf, telefone, endereco, imagem, modulo)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  pool.query(query, [nome, email, cpf, telefone, endereco, imagemBlob, modulo], (err) => {
    if (err) {
      console.error('Erro ao criar passeador:', err);
      return res.status(500).json({ success: false, message: 'Erro ao criar passeador' });
    }
    res.json({ success: true, message: 'Passeador criado com sucesso!' });
  });
});

// Endpoint para excluir um passeador pelo ID
app.delete('/passeadores/:id', (req, res) => {
  const passeadorId = req.params.id; // ID recebido da URL
  const deleteQuery = 'DELETE FROM passeadores WHERE id_passeador = $1';

  // Confirma se o ID não está vazio
  if (!passeadorId) {
    return res.status(400).json({ success: false, message: 'ID do passeador não fornecido' });
  }

  pool.query(deleteQuery, [passeadorId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir passeador:', err);
      return res.status(500).json({ success: false, message: 'Erro ao excluir passeador' });
    }

    // Verifica se alguma linha foi afetada (confirmação de exclusão)
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Passeador não encontrado' });
    }

    res.json({ success: true, message: 'Passeador excluído com sucesso!' });
  });
});

// Inicia o servidor apenas se o arquivo for executado diretamente
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

// Exporta o app e o pool de conexões
module.exports = { app, pool };