# TalkIA — frontend demonstrativo com chat em tempo real

O TalkIA transforma a sala global de chat já existente em uma experiência de
produto para colaboração. Cada pessoa entra com um apelido, vê o histórico do
**Projeto Atlas** e recebe mensagens novas em tempo real.

- **backend:** Node.js, Express, Socket.IO e PostgreSQL, rodando no Docker
- **frontend:** React com Vite, interface responsiva do TalkIA

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
│   │   ├── components/      ← telas, navegação, chat e estados vazios
│   │   ├── data/            ← conversas demonstrativas
│   │   ├── App.jsx          ← sessão, seção e conversa ativas
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
└── PLANO.md                  ← passo a passo do projeto
```

## Executar

### 1. Backend (Docker)

Na raiz do projeto:

```bash
docker compose up --build
```

- API: `http://localhost:3000/api/messages`
- Página de teste do chat: `http://localhost:3000/teste.html`

Mantenha esse terminal aberto. O backend precisa estar disponível para carregar
o histórico e conectar o chat ao vivo.

### 2. Frontend (Vite)

Em outro terminal, dentro de `frontend/`:

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

O Vite encaminha `/api` e `/socket.io` para `http://localhost:3000`. Para usar
outro destino, defina `API_URL` antes de iniciar o frontend.

## O que funciona de verdade

- sessão demonstrativa por apelido, salva em `talkia.nickname` no `localStorage`;
- restauração da seção e conversa selecionadas;
- histórico das últimas 50 mensagens do Projeto Atlas via `GET /api/messages`;
- envio e recebimento em tempo real no Projeto Atlas via Socket.IO;
- estados de conexão, reconexão, backend indisponível e nova tentativa;
- mesclagem, ordenação e eliminação de mensagens duplicadas;
- navegação por teclado e layout para desktop, tablet e celular.

## O que é demonstrativo

- a entrada por apelido **não é autenticação segura** e não usa senha ou token;
- Design System Core e Sprint Planning Q3 não são salas reais e não abrem socket;
- Equipes e Tarefas são estados vazios que dependem de evolução do backend;
- o painel TalkIA AI e o AI Workspace não processam conversas nem geram conteúdo;
- arquivos, perfis, permissões, múltiplas salas e automações ainda não existem.

## Validar o frontend

Dentro de `frontend/`:

```bash
npm run lint
npm run build
```

## Contrato da API

| O quê | Formato |
|---|---|
| `GET /api/messages` | array com as últimas 50 mensagens, da mais antiga para a mais nova |
| Uma mensagem | `{ message_id, author, content, created_at }` |
| Conectar no socket | apelido em `auth: { nickname }` (1 a 30 caracteres) |
| Enviar (cliente → servidor) | evento `message:send` com o texto (1 a 500 caracteres) |
| Receber (servidor → todos) | evento `message:new` com uma mensagem completa |

Enviar mensagem é só pelo socket. O HTTP serve apenas para ler o histórico. A
sala global atual é apresentada no frontend como Projeto Atlas.

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
