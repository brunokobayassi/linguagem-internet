const path = require('path');
const express = require('express');
const productsRouter = require('./routes/products');

const app = express();
const port = Number(process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.redirect('/produtos');
});

app.use('/produtos', productsRouter);

app.use((req, res) => {
  res.status(404).send('Página não encontrada.');
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('Erro interno do servidor.');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Aplicação disponível em http://localhost:${port}`);
});
