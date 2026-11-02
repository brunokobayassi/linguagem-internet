# Plano: frontend / backend API + WebSocket

Plano de trabalho, sem implementação. O projeto hoje é um único Express com EJS + Postgres + Docker. A meta é transformá-lo em **dois apps** (`frontend/` e `backend/`) e **um canal ao vivo**.

A ideia é manter tudo simples: cada passo diz **o que** fazer e **por quê**, e o **como** fica para vocês pesquisarem na documentação oficial (Express, Socket.IO, Vite, React).

---

## 0. Decisões (fechadas)

1. **CRUD de produtos: sai.** Era só o exemplo do fork. O backend fica só com o chat.
2. **Uma sala só.** Todo mundo conectado vê todas as mensagens.
3. **Identidade: só o apelido digitado na entrada**, sem senha.
4. **Socket.IO** (e não `ws`). Os dois fazem WebSocket, mas o `ws` é “cru”: entrega só texto puro, e o resto é com vocês. O Socket.IO já resolve três coisas que o chat precisa:
   - **reconectar sozinho** quando a conexão cai (com `ws`, vocês teriam que programar isso);
   - **eventos com nome** (`message:send`, `message:new`) em vez de um texto qualquer que vocês teriam que interpretar;
   - **mandar para todos de uma vez** (broadcast) com um comando, em vez de percorrer a lista de conexões na mão.

   Também é o mais usado com Node, então tem muito material para estudar.
5. **Proxy do Vite** (e não CORS). O React roda na porta 5173 e a API na 3000. Para o browser são “sites diferentes”, e ele bloqueia a chamada por segurança (isso é o CORS). Com o proxy, o React chama só `/api/...` e o próprio Vite repassa para o backend: para o browser é tudo o mesmo site, e o problema nem aparece. A alternativa, liberar CORS no backend, funciona, mas tem que configurar em dois lugares (Express e Socket.IO) e é mais um conceito para entender agora.

---

## 1. Separar as pastas (estrutura, ainda sem React)

Mover para `backend/` tudo o que é do Express:

```text
backend/
  src/              ← o Express atual
  public/           ← style.css (vai servir de referência pro React depois)
  package.json
  package-lock.json
  Dockerfile
  .dockerignore
  .env.example
  db/init.sql       ← o banco é do backend (o frontend nem sabe que ele existe)
frontend/           ← vazio por enquanto
docker-compose.yml  ← fica na raiz (é o que liga tudo)
```

Apagar o `node_modules/` da raiz (ele vai ser recriado dentro do container).

### Ajustar o `docker-compose.yml`

Como os arquivos mudaram de lugar, os caminhos no Compose precisam acompanhar:

1. Renomear o serviço `app` para `backend` (já com o nome final, para não renomear de novo depois).
2. No serviço `backend`, `build.context: backend`: diz ao Docker que o Dockerfile e o código estão dentro de `backend/`.
3. No serviço `backend`, em `volumes:`, trocar `.:/app` por `./backend:/app`.
4. No serviço `db`, em `volumes:`, trocar `./db/init.sql:...` por `./backend/db/init.sql:...` (só o lado esquerdo).

**O que são essas linhas de `volumes:`.** Tem dois tipos:

- **Bind mount** (começa com `.` ou `/`): liga uma pasta **do seu computador** a uma pasta **dentro do container**. Formato `computador:container`. As duas viram a mesma pasta, então o que você salva no VS Code aparece na hora no container (é por isso que o nodemon reinicia sozinho). Os itens 3 e 4 acima são bind mounts: o lado esquerdo é o caminho no seu computador, que mudou porque os arquivos foram para `backend/`.
- **Volume nomeado** (começa com um nome, como `postgres_data:` e `node_modules:`): uma pasta que o próprio Docker cria e guarda. Serve para dados que precisam sobreviver quando o container é desligado (os dados do banco, as dependências instaladas). Esses não mudam.

### Testar

1. Na raiz do projeto: `docker compose up --build` (o `--build` reconstrói a imagem, porque o Dockerfile mudou de lugar).
2. Abrir `http://localhost:3000/produtos`. Se a lista de produtos aparecer, o passo 1 está concluído.

Neste passo nada mudou no código, só de lugar. Se quebrar aqui, não avançar.

---

## 2. Limpar o CRUD e preparar o backend como API

Tirar o que era do exemplo e deixar o backend pronto para responder JSON.

### `backend/src/server.js`, linha por linha

| Linhas | O que fazem | O que fazer |
|---|---|---|
| 1 `const path = require('path')` | Módulo do Node que monta caminhos de pasta. | Manter (a linha 12 usa). |
| 2 `const express = require('express')` | Carrega o Express. | Manter. |
| 3 `const productsRouter = require(...)` | Importa as rotas de produtos. | **Apagar.** |
| 5-6 `app` e `port` | Cria o servidor e define a porta. | Manter. |
| 8-9 `app.set('view engine'...)` / `app.set('views'...)` | Mandam o Express montar HTML com os `.ejs` da pasta `views/`. Agora quem monta tela é o React. | **Apagar as duas.** |
| 11 `express.urlencoded(...)` | Faz o Express entender dados de `<form>` HTML. | **Trocar** por `express.json()`, usado do mesmo jeito: faz o Express entender JSON. |
| 12 `express.static(...)` | Serve os arquivos de `public/` direto pro browser. | Manter (a página de teste do passo 5 fica lá). |
| 14-16 `app.get('/', ...)` | Redireciona `/` para `/produtos`. | **Apagar.** |
| 18 `app.use('/produtos', ...)` | Liga as rotas de produtos. | **Apagar.** |
| 20-22 | Resposta para endereço inexistente (404). Hoje responde texto. | Manter, mas trocar `.send('texto')` por `.json(...)` com um objeto (ex.: propriedade `error` com a mensagem). |
| 24-27 | Resposta quando o código dá erro (500). | Manter, mesma troca para `.json(...)`. |
| 29-31 `app.listen(...)` | Liga o servidor na porta. | Manter por enquanto (muda no passo 5). |

### Arquivos para apagar inteiros

- `backend/src/routes/products.js` (rotas do CRUD).
- A pasta `backend/src/views/` inteira (páginas EJS).
- A pasta `src/routes/` fica vazia, mas não precisa apagar: o arquivo de rotas das mensagens vai nela no passo 4.

### `backend/package.json`

O EJS já não está nas dependências. Opcional: atualizar o texto da `description` (linha 5).

### `backend/db/init.sql`

Apagar do comentário “Exemplo antigo do CRUD” até o fim do arquivo. Fica só a tabela `messages`.

### Recriar o banco

Na raiz: `docker compose down -v` e depois `docker compose up --build`. O `-v` apaga o banco antigo (que tem a tabela de produtos); na subida, o `init.sql` novo cria a tabela `messages`.

### Como saber que deu certo

- O log mostra `Aplicação disponível em http://localhost:3000`.
- Abrir `http://localhost:3000/qualquercoisa` mostra o JSON do 404.

Daqui pra frente, toda rota nova começa com `/api` (é por esse prefixo que o proxy do Vite sabe o que repassar ao backend).

---

## 3. Modelo do chat no Postgres

Tabela mínima, uma sala só:

- `messages`: `message_id`, `author` (texto), `content`, `created_at`

`init.sql` passa a ter só essa tabela. O init **só roda na primeira criação do volume**. Como o banco de vocês já existe (com a tabela de produtos), rodar `docker compose down -v` (apaga os dados) e subir de novo.

---

## 4. API HTTP do chat (histórico, não o ao vivo)

Antes do WebSocket:

- `GET /api/messages`: últimas N mensagens (ex.: 50), para quem **acabou de entrar** ver o passado.

Testar com Thunder Client / Insomnia / `curl` (vai voltar uma lista vazia). **Frontend ainda não precisa existir.** API se testa sozinha.

**Não** criar `POST /api/messages`. O envio vai ser pelo socket, e ter dois caminhos de envio só complica. Regra simples: **envio = WebSocket; HTTP = leitura.**

---

## 5. WebSocket no mesmo processo da API

No `backend`:

1. Hoje o servidor sobe com `app.listen`. O Socket.IO precisa de um servidor HTTP do Node “de verdade” para se acoplar. Então: criar o servidor HTTP, passar o Express para ele e ligar o Socket.IO nesse mesmo servidor. A documentação do Socket.IO tem uma seção exatamente sobre “com Express”.
2. Combinar os nomes dos eventos com o front, por exemplo:
   - cliente → servidor: `message:send` com o texto
   - servidor → todos: `message:new` com a mensagem completa (`message_id`, `author`, `content`, `created_at`)
3. Ao receber `message:send`: validar (não vazia, tamanho máximo), **gravar no Postgres** e **só depois** mandar para todos. Persistir primeiro: se mandasse antes e o INSERT falhasse, a sala veria uma mensagem que não existe.
4. **Apelido:** o cliente manda o apelido uma vez, ao conectar. O servidor valida nesse momento (recusa vazio ou grande demais) e guarda na própria conexão. Daí em diante, o autor da mensagem vem do que o servidor guardou, não do que o cliente manda a cada mensagem. Pesquisar: “Socket.IO handshake auth” e “socket.data”.

Quem não está com o site aberto **não** recebe o evento. Por isso o `GET` do histórico existe.

**Testar sem React:** criar uma página HTML simples em `backend/public/` que conecta no socket, mostra as mensagens que chegam e tem um input. Abrir em duas abas (uma anônima), mandar de uma e ver aparecer na outra. Isso já prova que o chat funciona.

---

## 6. Frontend React (Vite)

Em `frontend/`: criar o projeto com o template React do Vite.

Duas telas:

1. **Entrada:** campo de apelido, guardado no estado e no `localStorage`.
2. **Chat:** lista de mensagens + input.

Para trocar de tela não precisa de biblioteca: se não tem apelido, mostra a Entrada; se tem, mostra o Chat.

Configurar o proxy no Vite: `/api` e `/socket.io` vão para o backend. Pesquisar: “Vite server.proxy” (detalhes de endereço na seção 7).

No chat:

1. Conectar o socket. Como o proxy faz tudo parecer a mesma origem, o cliente conecta sem passar URL.
2. Buscar o histórico com `fetch('/api/messages')` e preencher a lista.
3. Ao chegar `message:new`, adicionar na lista.
4. Ao enviar, só emitir `message:send`. **Não** desenhar a mensagem na hora: o servidor reenvia para todos, inclusive para quem mandou, e ela aparece pelo passo 3. Assim não duplica.
5. Mostrar “offline” quando o socket desconectar (é realista e costuma valer ponto).

**Armadilha clássica:** em modo dev, o React roda os `useEffect` duas vezes de propósito (StrictMode). Se o efeito que conecta o socket e registra os listeners não tiver **função de limpeza** (remover listener / desconectar), aparecem duas conexões e cada mensagem duas vezes. Pesquisar: “useEffect cleanup”.

CSS: reaproveitar a cara do `backend/public/style.css` atual.

---

## 7. Ligar os três no Docker

Raiz:

- `db`: como hoje
- `backend`: porta 3000, espera o Postgres ficar healthy
- `frontend`: porta 5173, rodando o servidor de dev do Vite, com bind mount do código (igual ao backend)

Cuidados com o Vite dentro do Docker:

- Por padrão ele só aceita conexão de dentro do próprio container. Precisa mandar ele escutar em todas as interfaces, senão o browser não abre a 5173. Pesquisar: “Vite server.host”.
- No Mac, mudanças nos arquivos às vezes não são detectadas dentro do container. Mesmo motivo do `--legacy-watch` que vocês já usam no nodemon. No Vite a opção é de “polling” no watch.

**Quem chama quem (importante):**

- O **browser** fala com o **Vite** (`localhost:5173`).
- O **proxy do Vite**, que roda dentro do container `frontend`, repassa `/api` e `/socket.io` para o backend. Dentro da rede do Docker o endereço é o nome do serviço: `http://backend:3000`, não `localhost`.
- O proxy do `/socket.io` precisa estar com a opção de WebSocket ligada, senão o socket não passa.
- O **backend** fala com o Postgres como `db`, igual hoje.

---

## 8. Ordem de validação

1. Pastas + Docker: o CRUD EJS antigo ainda abre.
2. CRUD removido: o backend sobe sem erro.
3. Tabela `messages` + `GET /api/messages` responde lista vazia no `curl`.
4. Socket com a página HTML de teste: duas abas, uma manda, a outra vê, e depois do F5 o `GET` ainda mostra a mensagem.
5. React: uma página feia que só lista o histórico (isso já prova que o proxy do `/api` funciona).
6. React + socket (prova o proxy do `/socket.io`).
7. Apelido + validações (mensagem vazia, tamanho máximo).
8. Beleza da UI por último.

---

## O que não precisa no primeiro corte

Auth JWT, salas múltiplas, `react-router`, upload, “digitando…”, “lido”, Redis, Nest, dois bancos, build de produção com Nginx. O núcleo avaliável é: **API + persistência + broadcast**.

---

## Divisão boa de trabalho (2 pessoas)

- Um: pastas, Docker, limpeza do CRUD, SQL, API, Socket.IO.
- Outro: Vite, telas, `fetch`, cliente Socket.IO, CSS.

Contrato entre os dois (README curto): rotas da API, formato JSON da mensagem e nomes dos eventos do socket. Sem isso, um espera o outro no escuro.
