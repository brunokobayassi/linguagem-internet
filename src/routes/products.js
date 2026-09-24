const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, price, created_at FROM products ORDER BY id'
    );

    res.render('products/index', {
      title: 'Produtos',
      products: rows,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/novo', (req, res) => {
  res.render('products/new', {
    title: 'Novo produto',
    error: null,
    product: { name: '', price: '' },
  });
});

router.post('/', async (req, res, next) => {
  const name = String(req.body.name || '').trim();
  const price = Number(req.body.price);

  if (!name || !Number.isFinite(price) || price < 0) {
    return res.status(400).render('products/new', {
      title: 'Novo produto',
      error: 'Informe um nome e um preço válido.',
      product: { name, price: req.body.price || '' },
    });
  }

  try {
    await pool.query(
      'INSERT INTO products (name, price) VALUES ($1, $2)',
      [name, price]
    );

    res.redirect('/produtos');
  } catch (error) {
    next(error);
  }
});

router.get('/:id/editar', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, price FROM products WHERE id = $1',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).send('Produto não encontrado.');
    }

    res.render('products/edit', {
      title: 'Editar produto',
      error: null,
      product: rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id', async (req, res, next) => {
  const name = String(req.body.name || '').trim();
  const price = Number(req.body.price);

  if (!name || !Number.isFinite(price) || price < 0) {
    return res.status(400).render('products/edit', {
      title: 'Editar produto',
      error: 'Informe um nome e um preço válido.',
      product: {
        id: req.params.id,
        name,
        price: req.body.price || '',
      },
    });
  }

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2 WHERE id = $3',
      [name, price, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Produto não encontrado.');
    }

    res.redirect('/produtos');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/excluir', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM products WHERE id = $1',
      [req.params.id]
    );

    res.redirect('/produtos');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
