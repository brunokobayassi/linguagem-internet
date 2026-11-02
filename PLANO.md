# Plano: chat com React + Express + Socket.IO + Postgres

Meta: **dois apps** (`backend/` e `frontend/`) e **um chat ao vivo**.

Cada etapa traz:

- **comandos** para rodar (com a pasta onde rodar);
- **arquivos** para criar ou mudar, com o **código**;
- o **fluxo**: o que acontece, em que ordem e em qual linha;
- **como testar**.

---

## Onde estamos

| Etapa | O que é | Status |
|---|---|---|
| 1 | Separar `backend/` e ajustar o Docker | ✅ feito |
| 2 | Tirar o CRUD e deixar o backend respondendo JSON | ✅ feito |
| 3 | Tabela `messages` no Postgres | ✅ feito |
| 4 | `GET /api/messages` (histórico) | ✅ feito |
| 5 | Socket.IO (envio ao vivo) + página `teste.html` | ✅ feito |
| 6 | Frontend React (Vite) | 🟡 base pronta (6.1 e 6.2); falta 6.3 em diante |
| 7 | Frontend dentro do Docker | ⬜ |
| 8 | Validação final | ⬜ |

### O que já existe no backend

```text
backend/
  src/
    server.js          ← liga Express + Socket.IO na porta 3000
    db.js              ← pool: a conexão com o Postgres
    socket.js          ← eventos do chat ao vivo
    routes/message.js  ← GET /api/messages
  public/
    teste.html         ← página de teste do socket (etapa 5)
    style.css
  db/init.sql          ← cria a tabela messages
```

### Contrato (o que o frontend precisa saber do backend)

| O quê | Formato |
|---|---|
| `GET /api/messages` | array com as últimas 50 mensagens, da mais antiga para a mais nova |
| Uma mensagem | `{ message_id, author, content, created_at }` |
| Conectar no socket | mandar o apelido em `auth: { nickname }` (1 a 30 caracteres) |
| Enviar (cliente → servidor) | evento `message:send` com o texto (1 a 500 caracteres) |
| Receber (servidor → todos) | evento `message:new` com uma mensagem completa |

### Limpeza pendente da etapa 1

Na raiz do projeto sobraram coisas do projeto antigo. Pode apagar:

- a pasta `db/` da raiz (só tem uma pasta vazia chamada `init.sql`; o verdadeiro está em `backend/db/`);
- a pasta `node_modules/` da raiz;
- o arquivo `package-lock.json` da raiz.

---

## 6. Frontend React (Vite)

Nesta etapa o frontend roda **direto na máquina** (fora do Docker), porque é mais fácil ver os erros. O backend continua no Docker, na porta 3000. Na etapa 7 o frontend também vai para o Docker.

> **Atenção (foge do normal):** o React roda na porta **5173** e o backend na **3000**. Para o navegador, são "sites diferentes", e ele bloqueia a comunicação (isso se chama CORS). Para resolver, usamos o **proxy do Vite**: o React pede `/api/...` para o próprio Vite (5173), e o Vite repassa para o backend (3000). O navegador acha que fala com um site só.

### 6.0 O que é cada ferramenta

- **npm:** o "baixador" de pacotes do Node. Baixa código que outras pessoas publicaram e coloca na pasta `node_modules`.
- **React:** um pacote para montar telas. Em vez de mexer no HTML na mão (igual ao `teste.html`), você descreve como a tela deve ficar ("se tem apelido, mostra o Chat"), e o React atualiza a página sozinho quando os dados mudam.
- **Vite:** a ferramenta que **roda o React durante o desenvolvimento**. O navegador não entende o código do React direto (o JSX, aquele HTML dentro do JS). O Vite:
  1. traduz esse código para JS normal;
  2. serve a página em `localhost:5173`;
  3. recarrega a página sozinho quando você salva um arquivo;
  4. faz o proxy: repassa `/api` e `/socket.io` para o backend.

  Comparando com o backend: o **Express** é o servidor do backend, e o **Vite** é o "servidor" do frontend enquanto vocês desenvolvem.

### 6.1 Criar o projeto ✅ feito

**1. Criar os arquivos do projeto.** Comando, **na raiz do projeto**:

```bash
npm create vite@latest frontend -- --template react --no-interactive
```

**Cria um projeto React do zero**, já com os arquivos e as configurações básicas, para você não montar tudo na mão. Ele preenche a pasta `frontend/`, que hoje está vazia.

- `vite@latest`: usa a versão mais nova do criador de projetos do Vite;
- `frontend`: o nome da pasta onde o projeto é criado;
- `--template react`: o tipo de projeto (React, e não Vue, Svelte etc.);
- `--no-interactive`: não faz perguntas, usa as opções padrão.

Ele **só cria os arquivos**: ainda não baixa nada.

**2. Entrar na pasta do frontend:**

```bash
cd frontend
```

**3. Baixar os pacotes do projeto:**

```bash
npm install
```

**Baixa todos os pacotes listados no `package.json`** (React, Vite...) para a pasta `frontend/node_modules`. O comando do passo 1 escreveu a lista; este baixa o que está nela. Sem ele, nada roda.

**4. Baixar o cliente do Socket.IO:**

```bash
npm install socket.io-client
```

**Baixa um pacote específico** e acrescenta ele na lista do `package.json`. É o **cliente** do Socket.IO, a parte que roda no navegador e conversa com o `socket.io` do backend. O backend usa o `socket.io` (servidor); o frontend usa o `socket.io-client`.

### 6.2 Apagar o que veio de exemplo ✅ feito

O template vem com uma página de demonstração (logos, contador, links). Foi removido:

- `frontend/src/App.css`, a pasta `frontend/src/assets/` e `frontend/public/icons.svg`: imagens e estilo da demonstração;
- `frontend/README.md`: o texto padrão do template;
- o conteúdo de `frontend/src/index.css`: ficou vazio, e o CSS do chat entra na 6.7;
- o conteúdo de `frontend/src/App.jsx`: ficou só um `<h1>Chat</h1>`, que é substituído na 6.4.

No `frontend/index.html`, o título virou `Chat` e o idioma, `pt-BR`.

**Não mexa** em `frontend/src/main.jsx`. Ele é quem "liga" o React na página e já chama o `App.jsx`.

### 6.3 `frontend/vite.config.js` (substituir o conteúdo inteiro)

```js
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Fora do Docker, o backend está em localhost:3000.
// Dentro do Docker, o docker-compose.yml troca para http://backend:3000.
const apiUrl = process.env.API_URL || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: { usePolling: true },
    proxy: {
      '/api': apiUrl,
      '/socket.io': { target: apiUrl, ws: true },
    },
  },
});
```

**Fluxo:**

1. **Escolher para onde repassar** → linha 6. Usa a variável `API_URL` se ela existir (no Docker, na etapa 7) ou `localhost:3000` (fora do Docker).
2. **`proxy`** → linhas 13-16. Pedidos que começam com `/api` ou `/socket.io` não são do React: o Vite repassa para o backend.
3. **`ws: true`** → linha 15. Liga o repasse de **WebSocket**. Sem isso, o `fetch` funciona, mas o chat ao vivo não conecta.
4. **`host: true`** e **`usePolling`** → linhas 11-12. Só importam no Docker (etapa 7). O `host: true` deixa o navegador acessar o Vite de fora do container. O `usePolling` faz o Vite perceber quando você salva um arquivo fora do container (é o mesmo motivo do `--legacy-watch` do nodemon).

### 6.4 `frontend/src/App.jsx` (substituir o conteúdo inteiro)

```jsx
import { useState } from 'react';
import Entrada from './Entrada.jsx';
import Chat from './Chat.jsx';

function App() {
  const [nickname, setNickname] = useState(() => localStorage.getItem('nickname') || '');

  function entrar(novoApelido) {
    localStorage.setItem('nickname', novoApelido);
    setNickname(novoApelido);
  }

  function sair() {
    localStorage.removeItem('nickname');
    setNickname('');
  }

  if (!nickname) {
    return <Entrada onEntrar={entrar} />;
  }

  return <Chat nickname={nickname} onSair={sair} />;
}

export default App;
```

**Fluxo:**

1. **Importar as duas telas** → linhas 2-3.
2. **Guardar o apelido** → linha 6. `useState` cria um **estado**: um valor que, quando muda, faz o React redesenhar a tela. O valor inicial vem do `localStorage` (memória do navegador que sobrevive ao F5). Se não tiver nada lá, começa vazio.
3. **Entrar** → linhas 8-11. Salva o apelido no `localStorage` e no estado. O estado muda, então a tela troca sozinha para o Chat.
4. **Sair** → linhas 13-16. O contrário: apaga o apelido e volta para a Entrada.
5. **Escolher a tela** → linhas 18-22. Sem apelido, mostra a Entrada; com apelido, mostra o Chat. Por isso não precisa de biblioteca de rotas.
6. **Exportar** → linha 25. O `main.jsx` importa o `App`.

`onEntrar={entrar}` passa a **função** `entrar` para a tela de Entrada. Assim, a Entrada consegue avisar o App quando a pessoa digitar o apelido. Essas coisas passadas entre componentes se chamam **props**.

### 6.5 `frontend/src/Entrada.jsx` (arquivo novo)

```jsx
import { useState } from 'react';

function Entrada({ onEntrar }) {
  const [texto, setTexto] = useState('');

  function enviar(event) {
    event.preventDefault();
    const apelido = texto.trim();
    if (apelido) {
      onEntrar(apelido);
    }
  }

  return (
    <main className="card entrada">
      <h1>Chat</h1>
      <form onSubmit={enviar}>
        <input
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="Seu apelido"
          maxLength={30}
          autoFocus
        />
        <button>Entrar</button>
      </form>
    </main>
  );
}

export default Entrada;
```

**Fluxo:**

1. **Receber a função do App** → linha 3. `{ onEntrar }` é a prop que o App passou.
2. **Guardar o que está sendo digitado** → linha 4, e linhas 19-20. Cada tecla chama `setTexto`, e o campo mostra o `texto`. Isso se chama **input controlado**: o React sempre sabe o que está no campo.
3. **Ao enviar o formulário** → linhas 6-12. `preventDefault()` impede o navegador de recarregar a página, que é o comportamento padrão de um `<form>`. Se o apelido não for vazio, avisa o App.
4. **O HTML** → linhas 14-27. Isso é **JSX**: HTML dentro do JavaScript. As diferenças para o HTML normal: `className` em vez de `class`, e `{ }` para colocar valores do JS.

### 6.6 `frontend/src/Chat.jsx` (arquivo novo)

```jsx
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

function Chat({ nickname, onSair }) {
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState(false);
  const [texto, setTexto] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io({ auth: { nickname } });
    socketRef.current = socket;

    socket.on('connect', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));
    socket.on('connect_error', (error) => {
      // active = false: o servidor recusou (apelido inválido) e não vai tentar de novo.
      if (!socket.active) {
        alert(error.message);
        onSair();
      }
    });
    socket.on('message:new', (message) => {
      setMessages((anteriores) => [...anteriores, message]);
    });

    fetch('/api/messages')
      .then((response) => response.json())
      .then((historico) => setMessages(historico));

    return () => {
      socket.disconnect();
    };
  }, [nickname, onSair]);

  function enviar(event) {
    event.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo) {
      return;
    }
    socketRef.current.emit('message:send', conteudo);
    setTexto('');
  }

  return (
    <main className="card chat">
      <header>
        <strong>{nickname}</strong>
        <span className={online ? 'status online' : 'status offline'}>
          {online ? 'online' : 'offline'}
        </span>
        <button onClick={onSair}>Sair</button>
      </header>

      <ul className="mensagens">
        {messages.map((message) => (
          <li key={message.message_id}>
            <strong>{message.author}:</strong> {message.content}
          </li>
        ))}
      </ul>

      <form onSubmit={enviar}>
        <input
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="Mensagem"
          maxLength={500}
        />
        <button disabled={!online}>Enviar</button>
      </form>
    </main>
  );
}

export default Chat;
```

**Fluxo:**

1. **Estados da tela** → linhas 5-7: a lista de mensagens, se está online e o texto sendo digitado.
2. **Guardar o socket** → linha 8. `useRef` é uma "caixa" que guarda um valor **sem redesenhar a tela** quando ele muda. O socket fica aqui porque a função `enviar` (linha 42) precisa dele.
3. **Conectar quando a tela abre** → linhas 10-12. O `useEffect` roda código **depois** que a tela aparece. `io(...)` conecta no socket mandando o apelido. Não precisa passar endereço: o proxy do Vite cuida disso.
4. **Online/offline** → linhas 14-15.
5. **Apelido recusado** → linhas 16-22. Se o servidor recusar (o passo 6 da etapa 5), mostra o erro e volta para a Entrada. O `socket.active` diferencia "recusado" de "o backend caiu". Se o backend cair, o socket tenta reconectar sozinho, e a tela só mostra "offline".
6. **Mensagem nova chegou** → linhas 23-25. Acrescenta no fim da lista. O `[...anteriores, message]` cria uma **lista nova** com a mensagem no final. No React, nunca se altera a lista antiga: cria-se outra, senão a tela não atualiza.
7. **Buscar o histórico** → linhas 27-29. O mesmo `GET /api/messages` da etapa 4.
8. **Limpeza** → linhas 31-33. O `return` do `useEffect` roda quando a tela **fecha** (por exemplo, ao clicar em Sair) e desconecta o socket.
   **Por que isso é obrigatório:** em modo dev, o React roda o `useEffect` **duas vezes** de propósito (por causa do `StrictMode` no `main.jsx`), para pegar bugs. Sem a limpeza, ficariam **duas conexões**, e cada mensagem apareceria duas vezes.
9. **Quando o efeito roda de novo** → linha 34. O `[nickname, onSair]` diz: "só rode de novo se um desses mudar". Sem esse array, ele reconectaria a cada tecla digitada.
10. **Enviar** → linhas 36-44. Só emite `message:send` e limpa o campo. **Não** coloca a mensagem na lista: ela volta do servidor pelo passo 6, e assim não duplica.
11. **Desenhar a lista** → linhas 57-61. O `.map` transforma cada mensagem num `<li>`. O `key` é um identificador único que o React exige em listas, e o `message_id` serve para isso.
12. **Botão desligado offline** → linha 71.

### 6.7 `frontend/src/index.css` (substituir o conteúdo inteiro)

Mesmas cores do `backend/public/style.css` antigo:

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f5f7fb;
  color: #1f2937;
}

.card {
  width: min(100% - 32px, 640px);
  margin: 40px auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.06);
}

form {
  display: flex;
  gap: 8px;
}

input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font: inherit;
}

button {
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: #111827;
  color: white;
  font: inherit;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.chat header button {
  margin-left: auto;
}

.status.online {
  color: #15803d;
}

.status.offline {
  color: #b91c1c;
}

.mensagens {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  height: 360px;
  overflow-y: auto;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.mensagens li {
  padding: 8px 0;
}
```

### 6.8 Testar

1. O backend precisa estar rodando. Na raiz: `docker compose up`.
2. Em **outro terminal**, dentro de `frontend/`:
   ```bash
   npm run dev
   ```
   **Roda o script `dev`** que está no `package.json`. No frontend, esse script é o `vite`, ou seja, liga o Vite em `localhost:5173`. É a mesma ideia do `npm run dev` do backend, que liga o nodemon. Para parar: `Ctrl + C`.
3. Abra `http://localhost:5173`, digite um apelido e entre.

**Deu certo se:**

- aparecem as mensagens antigas (prova que o proxy do `/api` funciona);
- aparece "online" em verde (prova que o proxy do `/socket.io` funciona);
- abrindo uma aba anônima com outro apelido, o que uma manda aparece na outra;
- cada mensagem aparece **uma vez só**;
- dando F5, você continua logado (o `localStorage` funcionou);
- parando o backend (`docker compose stop backend`), aparece "offline". Ao subir de novo, volta sozinho para "online".

---

## 7. Frontend dentro do Docker

O objetivo é subir **tudo** com um único `docker compose up`.

### 7.1 `docker-compose.yml` (na raiz): adicionar o serviço `frontend`

Logo depois do serviço `backend` (com a mesma indentação de `backend:`):

```yaml
  frontend:
    image: node:22-alpine
    container_name: chat_frontend
    working_dir: /app
    command: sh -c "npm install && npm run dev"
    environment:
      API_URL: http://backend:3000
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - frontend_node_modules:/app/node_modules
    depends_on:
      - backend
```

E, no final do arquivo, acrescente o volume novo na lista `volumes:`:

```yaml
volumes:
  postgres_data:
  node_modules:
  frontend_node_modules:
```

**Fluxo:**

1. **`image: node:22-alpine`**: usa direto uma imagem pronta com Node. Não precisa de Dockerfile, porque não tem nada para instalar além do que o `npm install` faz.
2. **`command`**: ao ligar, instala os pacotes e roda o Vite (o mesmo `npm run dev` da etapa 6).
3. **`API_URL: http://backend:3000`**: é a variável que o `vite.config.js` lê na linha 6. Dentro do Docker, `localhost` é o **próprio container** do frontend, não a máquina. Para achar o backend, usa-se o **nome do serviço** (`backend`), igual ao que o backend faz com o banco (`db`).
4. **`./frontend:/app`**: bind mount. O código da pasta `frontend/` aparece no container, e salvar no editor atualiza a página.
5. **`frontend_node_modules`**: volume nomeado só para os pacotes do container.

> **Atenção (foge do normal):** o `frontend/node_modules` da pasta do projeto (o da etapa 6) e o do container são **cópias separadas**. O da pasta serve para o editor e para rodar fora do Docker; o do container serve para o container. Elas são separadas porque alguns pacotes do Vite têm partes compiladas diferentes para cada sistema operacional (Windows, macOS, Linux). Ao instalar um pacote novo, rode `npm install nome` dentro de `frontend/`, fora do Docker, e depois `docker compose restart frontend`.

### 7.2 Testar

1. Pare o `npm run dev` da etapa 6 (`Ctrl + C`), senão a porta 5173 fica ocupada.
2. Na raiz:
   ```bash
   docker compose up
   ```
3. Abra `http://localhost:5173` e repita o teste da etapa 6.8.

---

## 8. Validação final

- [ ] `docker compose down -v` e depois `docker compose up --build`: tudo sobe do zero, com o banco vazio.
- [ ] `http://localhost:5173` abre a Entrada.
- [ ] Apelido vazio não entra.
- [ ] Duas abas (uma anônima): uma manda, a outra vê na hora.
- [ ] Mensagem vazia ou só com espaços não é enviada.
- [ ] F5 mantém o apelido e mostra o histórico.
- [ ] `docker compose stop backend` mostra "offline"; `docker compose start backend` volta para "online".
- [ ] Nenhuma mensagem aparece duplicada.

---

## O que não precisa no primeiro corte

Auth JWT, salas múltiplas, `react-router`, upload, "digitando…", "lido", Redis, Nest, build de produção com Nginx. O núcleo avaliável é: **API + persistência + broadcast**.
