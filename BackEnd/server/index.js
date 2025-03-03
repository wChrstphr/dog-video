const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // URL do frontend
    methods: ['GET', 'POST'],
  },
});

const users = {}; // Armazena os usuários conectados

io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Evento para associar o usuário ao ID do socket
  socket.on('join', ({ userId }) => {
    users[userId] = socket.id;
    console.log(`Usuário ${userId} associado ao socket ${socket.id}`);
  });

  // Evento para enviar mensagens
  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', { senderId, message });
    }
  });

  // Evento para desconexão
  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

server.listen(5000, () => console.log('Servidor rodando na porta 5000'));
