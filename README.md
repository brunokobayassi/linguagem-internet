# Chat com React + Express + Socket.IO + PostgreSQL

Chat em tempo real com uma sala só. Cada pessoa entra com um apelido, vê o
histórico e recebe as mensagens novas na hora.

- **backend:** Node.js, Express, Socket.IO e PostgreSQL, rodando no Docker
- **frontend:** React com Vite (em construção, ver `PLANO.md`)

## Estrutura

```text
.
├── backend/
│   ├── db/
│   │   └── init.sql          ← cria a tabela messages
│   ├── public/
│   │   ├── style.css
│   │   └── teste.html        ← página de teste do chat, sem React
│   ├── src/
│   │   ├── routes/
│   │   │   └── message.js    ← GET /api/messages
│   │   ├── db.js             ← conexão com o PostgreSQL
│   │   ├── server.js         ← liga Express + Socket.IO na porta 3000
│   │   └── socket.js         ← eventos do chat ao vivo
│   ├── Dockerfile
│   └── package.json
├── frontend/                 ← React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
└── PLANO.md                  ← passo a passo do projeto
```

## Executar

### Backend (Docker)

Na raiz do projeto:

```bash
docker compose up --build
```

- API: `http://localhost:3000/api/messages`
- Página de teste do chat: `http://localhost:3000/teste.html`

### Frontend (Vite)

Em outro terminal, dentro de `frontend/`:

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Contrato da API

| O quê | Formato |
|---|---|
| `GET /api/messages` | array com as últimas 50 mensagens, da mais antiga para a mais nova |
| Uma mensagem | `{ message_id, author, content, created_at }` |
| Conectar no socket | apelido em `auth: { nickname }` (1 a 30 caracteres) |
| Enviar (cliente → servidor) | evento `message:send` com o texto (1 a 500 caracteres) |
| Receber (servidor → todos) | evento `message:new` com uma mensagem completa |

Enviar mensagem é só pelo socket. O HTTP serve só para ler o histórico.

## Volumes do Docker

- `postgres_data`: os dados do banco. Continuam salvos mesmo desligando os containers.
- `./backend:/app`: o código do backend aparece dentro do container, e o
  nodemon reinicia o servidor a cada mudança.
- `node_modules`: os pacotes do backend ficam num volume próprio, dentro do
  container. Para ter uma cópia na pasta do projeto (para o editor), rode
  `npm install` dentro de `backend/`.

## Recriar o banco do zero

```bash
docker compose down -v
docker compose up --build
```

> O `backend/db/init.sql` só roda quando o volume do PostgreSQL é criado pela
> primeira vez. Por isso precisa do `-v`, que apaga o volume.
