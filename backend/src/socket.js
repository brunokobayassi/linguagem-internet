const pool = require('./db');

// Mesmos limites das colunas em db/init.sql.
const MAX_NICKNAME = 30;
const MAX_CONTENT = 500;

// Eventos:
// cliente → servidor: 'message:send' com o texto
// servidor → todos:   'message:new' com { message_id, author, content, created_at }
function registerSocket(io) {
  io.use((socket, next) => {
    const nickname = String(socket.handshake.auth.nickname || '').trim();

    if (!nickname || nickname.length > MAX_NICKNAME) {
      return next(new Error('Apelido inválido.'));
    }

    socket.data.nickname = nickname;
    next();
  });

  io.on('connection', (socket) => {
    socket.on('message:send', async (text) => {
      const content = String(text || '').trim();

      if (!content || content.length > MAX_CONTENT) {
        return;
      }

      try {
        const result = await pool.query(
          `INSERT INTO messages (author, content)
           VALUES ($1, $2)
           RETURNING message_id, author, content, created_at`,
          [socket.data.nickname, content]
        );

        io.emit('message:new', result.rows[0]);
      } catch (error) {
        console.error(error);
      }
    });
  });
}

module.exports = registerSocket;
