# CRUD MPA com Node.js + PostgreSQL + Docker

Projeto mínimo para demonstrar um CRUD tradicional em MPA
(Multi-Page Application), usando:

- Node.js
- Express
- EJS
- PostgreSQL
- Docker Compose
- volume persistente do PostgreSQL
- bind mount do código da aplicação
- volume separado para `node_modules`
- Dockerfile **sem `COPY`**

## Estrutura

```text
crud-mpa-docker/
├── db/
│   └── init.sql
├── public/
│   └── style.css
├── src/
│   ├── routes/
│   │   └── products.js
│   ├── views/
│   │   ├── partials/
│   │   │   ├── footer.ejs
│   │   │   └── header.ejs
│   │   └── products/
│   │       ├── edit.ejs
│   │       ├── index.ejs
│   │       └── new.ejs
│   ├── db.js
│   └── server.js
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Executar

Na pasta do projeto:

```bash
docker compose up --build
```

Abra:

```text
http://localhost:3000
```

## CRUD

Rotas principais:

```text
GET  /produtos
GET  /produtos/novo
POST /produtos
GET  /produtos/:id/editar
POST /produtos/:id
POST /produtos/:id/excluir
```

Como este é um exemplo MPA, os formulários HTML enviam `POST` diretamente
e o servidor responde com redirecionamentos para novas páginas.

## Volumes

O PostgreSQL persiste os dados em:

```yaml
postgres_data:/var/lib/postgresql/data
```

O código da aplicação é montado diretamente no container:

```yaml
- .:/app
```

As dependências ficam em um volume separado:

```yaml
- node_modules:/app/node_modules
```

Por isso o Dockerfile não precisa copiar o código da aplicação para dentro
da imagem.

## Recriar o banco do zero

Se quiser apagar os dados persistidos:

```bash
docker compose down -v
docker compose up --build
```

> O arquivo `db/init.sql` só é executado automaticamente quando o volume
> do PostgreSQL é criado pela primeira vez.
