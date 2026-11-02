const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/messages
// Últimas 50 mensagens, da mais antiga para a mais nova.
// Retorna: [{ message_id, author, content, created_at }]
router.get('/', async (req, res) => {
    const result = await pool.query(
        `SELECT message_id, author, content, created_at
            FROM (
                SELECT * FROM messages
                ORDER BY created_at DESC
                LIMIT 50
            ) AS ultimas
            ORDER BY created_at ASC
        `);

    res.json(result.rows);
});

module.exports = router;
