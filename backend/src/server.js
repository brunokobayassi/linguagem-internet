const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const messageRouter = require('./routes/message');
const registerSocket = require('./socket');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/messages', messageRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const server = http.createServer(app);
const io = new Server(server);

registerSocket(io);

server.listen(port, '0.0.0.0', () => {
  console.log(`Aplicação disponível em http://localhost:${port}`);
});
