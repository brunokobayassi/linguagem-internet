# Plano de implementação do frontend TalkIA

## 1. Contexto

Este plano compara o projeto atual com o documento de planejamento localizado em:

`C:\Users\bruno\Downloads\Nome_TalkIA_1_.pdf.pdf`

O PDF descreve o TalkIA como uma plataforma para transformar conversas de trabalho em resumos, decisões e tarefas. O MVP priorizado no documento contém chat, autenticação, grupos e IA para resumos e identificação de tarefas.

O projeto atual já possui:

- backend em Express e Socket.IO;
- uma sala global de chat em tempo real;
- histórico das últimas 50 mensagens em PostgreSQL;
- entrada por apelido, sem autenticação real;
- validação de apelidos e mensagens;
- uma página HTML simples para testar o backend;
- uma base React com Vite que ainda exibe somente o título `Chat`.

Em relação ao PDF, ainda não existem autenticação real, equipes, múltiplos grupos persistidos, perfis e permissões, processamento por IA, tarefas, decisões, arquivos ou a interface visual do TalkIA.

## 2. Objetivo desta etapa

Construir apenas a experiência frontend em React, visualmente próxima das duas telas de referência do PDF, aproveitando o chat real já disponível no backend.

Esta etapa deve entregar:

- login demonstrativo;
- navegação principal do TalkIA;
- lista simulada de conversas e grupos;
- uma conversa conectada ao backend real;
- AI Workspace e painel de IA em estado vazio;
- identidade visual e comportamento responsivo;
- documentação clara sobre o que é real e o que ainda é demonstrativo.

Esta entrega representa a parte visual do MVP. Ela não deve ser apresentada como autenticação, grupos ou IA reais.

## 3. Limites da implementação

Somente o frontend e a documentação devem ser alterados.

Não fazem parte desta etapa:

- mudanças no backend;
- mudanças no banco de dados;
- mudanças no Docker Compose;
- autenticação segura com senha ou token;
- cadastro persistente de usuários e equipes;
- múltiplas salas no Socket.IO;
- uploads de arquivos;
- geração real de resumos por IA;
- criação automática de tarefas e decisões;
- responsáveis e prazos persistidos;
- integrações, notificações ou automações avançadas;
- execução do frontend dentro do Docker.

## 4. Estrutura da aplicação React

O componente principal deve controlar três estados globais simples:

- sessão demonstrativa do usuário;
- seção ativa da aplicação;
- conversa selecionada.

Não será necessário adicionar uma biblioteca de rotas nesta etapa. A navegação pode ser controlada por estado React.

A interface deve ser dividida conceitualmente em:

- `Login`: entrada demonstrativa por apelido;
- `AppShell`: estrutura geral com navegação e perfil;
- `Sidebar`: Conversas, Equipes, Tarefas e AI Workspace;
- `ConversationList`: projetos e conversas demonstrativas;
- `ChatPanel`: histórico e envio de mensagens;
- `AiPanel`: área lateral da IA em planejamento;
- `AiWorkspace`: visão geral com estados vazios para resumos, tarefas e decisões.

Os componentes podem ser organizados em arquivos separados para evitar concentrar toda a interface em `App.jsx`.

## 5. Login demonstrativo

A primeira tela deve solicitar um apelido.

Regras:

- remover espaços no início e no fim;
- exigir entre 1 e 30 caracteres;
- salvar o apelido em `localStorage`;
- restaurar a sessão ao recarregar a página;
- oferecer uma ação de saída que apague a sessão;
- identificar discretamente que se trata de uma demonstração;
- não solicitar ou simular senha, pois não há autenticação segura no backend.

Chave local prevista:

- `talkia.nickname`.

## 6. Navegação e grupos simulados

A navegação deve seguir a referência visual do PDF e conter:

- Conversas;
- Equipes;
- Tarefas;
- AI Workspace.

As seções Equipes e Tarefas podem apresentar estados vazios informando que dependem da evolução do backend.

A lista de conversas deve incluir dados de demonstração inspirados no PDF, como:

- Projeto Atlas;
- Design System Core;
- Sprint Planning Q3.

Somente `Projeto Atlas` será um grupo ao vivo. Ele representa temporariamente a única sala global existente no backend.

Ao selecionar outro grupo:

- exibir um estado demonstrativo;
- explicar que salas independentes ainda não estão disponíveis;
- não abrir conexão ou enviar mensagens para a sala global;
- não fingir persistência separada.

Chaves locais previstas:

- `talkia.activeView`;
- `talkia.activeConversation`.

## 7. Chat real

O grupo `Projeto Atlas` deve usar o contrato atual do backend.

### Histórico

- Buscar `GET /api/messages` ao abrir a conversa.
- Exibir as últimas 50 mensagens em ordem cronológica.
- Tratar falhas de carregamento com mensagem clara e opção de tentar novamente.

### Socket.IO

- Conectar enviando `auth: { nickname }`.
- Enviar texto pelo evento `message:send`.
- Receber mensagens pelo evento `message:new`.
- Mostrar estados online, offline e reconectando.
- Se o apelido for recusado, limpar a sessão e retornar ao login.
- Desconectar o socket ao sair da conversa ou encerrar a sessão.

### Mensagens

- Aceitar de 1 a 500 caracteres após remover espaços externos.
- Desabilitar o envio quando estiver offline ou com conteúdo vazio.
- Limpar o campo após o envio.
- Permitir envio pelo formulário com Enter.
- Fazer rolagem automática quando chegarem mensagens novas.
- Renderizar conteúdo como texto React, sem interpretar HTML.

### Consistência

O histórico HTTP e os eventos ao vivo podem chegar em ordens diferentes. A interface deve:

- mesclar mensagens usando `message_id` como identificador;
- eliminar duplicações;
- ordenar por `created_at` e, em caso de empate, por `message_id`;
- evitar conexões duplicadas durante o `StrictMode` do React.

## 8. Proxy do Vite

O frontend deve continuar rodando separadamente do backend durante o desenvolvimento.

O `vite.config.js` deve encaminhar:

- `/api` para o backend;
- `/socket.io` para o backend com WebSocket habilitado.

O destino deve usar:

- `process.env.API_URL`, quando definido;
- `http://localhost:3000`, como padrão local.

Também devem ser mantidas configurações adequadas para acesso local e observação de arquivos.

## 9. Painel de IA e AI Workspace

A IA real será planejada posteriormente. Esta etapa não deve produzir resumos ou tarefas fictícias como se fossem resultados reais.

Na tela de conversa, o painel lateral deve conter:

- título TalkIA AI;
- mensagem `IA em planejamento`;
- breve explicação sobre futuros resumos, tarefas e decisões;
- ações visíveis, porém desabilitadas;
- nenhum resultado atribuído à conversa real.

O AI Workspace deve seguir a composição geral do PDF e mostrar:

- zero resumos gerados;
- zero tarefas identificadas;
- zero decisões registradas;
- cartões em estado vazio;
- orientação de que a integração de IA ainda será definida.

## 10. Identidade visual

A interface deve se aproximar das referências do PDF sem depender de imagens externas.

### 10.1 Conceito visual

O TalkIA deve transmitir inteligência, organização, confiança e colaboração. A aparência deve ser clara e leve, com bastante espaço em branco, superfícies em lavanda, detalhes em roxo e informações distribuídas em cartões. O resultado deve parecer uma ferramenta profissional de produtividade, sem perder a sensação de proximidade de um chat.

Princípios visuais:

- priorizar clareza e hierarquia sobre decoração;
- usar o roxo como assinatura da marca e indicador de ações inteligentes;
- manter superfícies claras para acomodar grande volume de conversas e informações;
- diferenciar estados com cor, texto e ícone, nunca apenas com cor;
- aplicar bordas, sombras e movimentos de forma discreta;
- manter consistência entre chat, workspace, formulários e estados vazios.

### 10.2 Paleta de marca

#### Cor primária - índigo

A cor primária representa a marca, ações principais, navegação selecionada, foco e elementos relacionados à IA.

| Token | Cor | Uso recomendado |
|---|---|---|
| `primary-50` | `#EEF2FF` | fundos suaves e mensagens destacadas |
| `primary-100` | `#E0E7FF` | hover de itens claros e badges |
| `primary-200` | `#C7D2FE` | bordas de destaque |
| `primary-300` | `#A5B4FC` | ilustrações e estados inativos |
| `primary-400` | `#818CF8` | detalhes secundários |
| `primary-500` | `#6366F1` | elementos interativos auxiliares |
| `primary-600` | `#4F46E5` | cor principal da marca e botões primários |
| `primary-700` | `#4338CA` | hover de botões primários |
| `primary-800` | `#3730A3` | estado pressionado |
| `primary-900` | `#312E81` | textos ou fundos de alto contraste |

#### Cor secundária - violeta

A cor secundária complementa o índigo e deve ser usada em badges, gradientes, indicadores de IA e elementos que precisam de diferenciação sem competir com a ação principal.

| Token | Cor | Uso recomendado |
|---|---|---|
| `secondary-50` | `#F5F3FF` | fundo do AI Workspace e cartões suaves |
| `secondary-100` | `#EDE9FE` | badges e estados selecionados claros |
| `secondary-200` | `#DDD6FE` | bordas decorativas |
| `secondary-300` | `#C4B5FD` | gráficos e indicadores |
| `secondary-400` | `#A78BFA` | detalhes visuais |
| `secondary-500` | `#8B5CF6` | cor secundária oficial |
| `secondary-600` | `#7C3AED` | ações alternativas e ícones |
| `secondary-700` | `#6D28D9` | hover de ações secundárias |
| `secondary-800` | `#5B21B6` | elementos de alto contraste |
| `secondary-900` | `#4C1D95` | textos sobre fundos claros especiais |

#### Cor terciária - azul

A cor terciária identifica links, informações, filtros, recursos auxiliares e elementos que não representam uma ação primária.

| Token | Cor | Uso recomendado |
|---|---|---|
| `tertiary-50` | `#F0F9FF` | fundos informativos |
| `tertiary-100` | `#E0F2FE` | badges e alertas suaves |
| `tertiary-200` | `#BAE6FD` | bordas informativas |
| `tertiary-300` | `#7DD3FC` | detalhes e gráficos |
| `tertiary-400` | `#38BDF8` | ícones auxiliares |
| `tertiary-500` | `#0EA5E9` | cor terciária oficial |
| `tertiary-600` | `#0284C7` | links e hover |
| `tertiary-700` | `#0369A1` | texto informativo de alto contraste |

#### Cores neutras

| Token | Cor | Uso recomendado |
|---|---|---|
| `neutral-50` | `#F8FAFC` | fundo geral alternativo |
| `neutral-100` | `#F1F5F9` | fundos de campos e itens |
| `neutral-200` | `#E2E8F0` | bordas e divisores |
| `neutral-300` | `#CBD5E1` | campos desabilitados |
| `neutral-400` | `#94A3B8` | placeholders e ícones inativos |
| `neutral-500` | `#64748B` | textos auxiliares |
| `neutral-600` | `#475569` | textos secundários |
| `neutral-700` | `#334155` | textos de apoio com maior contraste |
| `neutral-800` | `#1E293B` | títulos e navegação |
| `neutral-900` | `#0F172A` | texto principal e fundo escuro da marca |

#### Superfícies e fundos

- fundo principal da aplicação: `#F8F7FF`;
- superfície padrão: `#FFFFFF`;
- superfície suave: `#F5F3FF`;
- superfície selecionada: `#EEF2FF`;
- borda padrão: `#E2E8F0`;
- borda de destaque: `#C7D2FE`;
- sobreposição de modal: `rgba(15, 23, 42, 0.48)`.

#### Cores semânticas

| Estado | Cor principal | Fundo suave | Uso |
|---|---|---|---|
| sucesso/online | `#16A34A` | `#DCFCE7` | conexão ativa e confirmações |
| atenção | `#D97706` | `#FEF3C7` | pendências e alertas não bloqueantes |
| erro/offline | `#DC2626` | `#FEE2E2` | falhas, desconexão e ações destrutivas |
| informação | `#0284C7` | `#E0F2FE` | mensagens auxiliares e estados informativos |

O vermelho deve ser reservado para erros e ações destrutivas. Verde e vermelho não devem ser usados como única forma de comunicar um estado.

### 10.3 Tipografia

A família principal da marca é **Plus Jakarta Sans**, utilizada no PDF em títulos, corpo e rótulos.

Stack recomendada:

```css
font-family: "Plus Jakarta Sans", "Inter", "Segoe UI", Arial, sans-serif;
```

Caso a fonte principal não esteja disponível, a interface deve usar os fallbacks sem alterar o layout. A fonte poderá ser incorporada localmente em uma etapa futura; esta especificação não exige dependência de rede.

Pesos permitidos:

- `400`: textos corridos e mensagens;
- `500`: legendas, navegação e metadados;
- `600`: botões, rótulos e subtítulos;
- `700`: títulos e números de destaque;
- `800`: uso pontual na marca ou chamada principal.

Escala tipográfica:

| Estilo | Tamanho / altura de linha | Peso | Uso |
|---|---|---|---|
| `display` | `32px / 40px` | `700` | título principal do AI Workspace |
| `heading-1` | `28px / 36px` | `700` | título de página |
| `heading-2` | `22px / 30px` | `700` | título de painel |
| `heading-3` | `18px / 26px` | `600` | título de cartão ou conversa |
| `body` | `14px / 22px` | `400` | mensagens e textos gerais |
| `body-small` | `13px / 20px` | `400` | descrições e textos compactos |
| `label` | `12px / 16px` | `600` | campos, badges e navegação |
| `caption` | `11px / 16px` | `500` | horários, contadores e metadados |
| `button` | `14px / 20px` | `600` | ações e botões |

Títulos devem usar espaçamento de letras normal ou levemente negativo. Labels em caixa alta devem ser usados apenas em categorias pequenas, com espaçamento entre letras de aproximadamente `0.04em`.

### 10.4 Espaçamento e dimensões

Usar uma escala baseada em múltiplos de `4px`:

- `4px`: separação mínima entre ícone e badge;
- `8px`: elementos internos compactos;
- `12px`: grupos pequenos e campos;
- `16px`: espaçamento padrão entre componentes;
- `20px`: conteúdo interno de cartões pequenos;
- `24px`: conteúdo interno de painéis;
- `32px`: separação entre seções;
- `40px` e `48px`: margens de páginas e grandes blocos.

Dimensões recomendadas:

- altura de campos e botões: entre `40px` e `44px`;
- ícones de navegação: `18px` a `20px`;
- ícones de ações principais: `20px` a `24px`;
- avatares compactos: `28px` a `32px`;
- avatar de perfil: `36px` a `40px`;
- largura mínima confortável para alvos de toque: `44px`.

### 10.5 Bordas, raios e sombras

Raios recomendados:

- `6px`: badges pequenos;
- `8px`: campos e botões compactos;
- `12px`: mensagens e cartões;
- `16px`: painéis principais e modais;
- `999px`: avatares, indicadores e pills.

Bordas devem usar preferencialmente `1px solid #E2E8F0`. Elementos selecionados podem usar `#C7D2FE` ou uma borda lateral de `3px` em `#4F46E5`.

Sombras:

```css
--shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
--shadow-md: 0 8px 24px rgba(79, 70, 229, 0.08);
--shadow-focus: 0 0 0 3px rgba(79, 70, 229, 0.22);
```

Sombras devem separar planos sem fazer os cartões parecerem flutuantes em excesso.

### 10.6 Componentes principais

#### Botões

- primário: fundo `#4F46E5`, texto branco, hover `#4338CA` e estado pressionado `#3730A3`;
- secundário: fundo `#EEF2FF`, texto `#4338CA` e borda `#C7D2FE`;
- discreto: fundo transparente, texto `#475569` e hover `#F1F5F9`;
- destrutivo: fundo `#DC2626` ou versão discreta com fundo `#FEE2E2`;
- desabilitado: fundo `#E2E8F0`, texto `#94A3B8` e cursor não interativo.

#### Campos

- fundo branco ou `#F8FAFC`;
- borda padrão `#CBD5E1`;
- placeholder `#94A3B8`;
- foco com borda `#4F46E5` e `--shadow-focus`;
- erro com borda `#DC2626` e mensagem textual associada.

#### Navegação

- item padrão com texto `#475569`;
- hover com fundo `#F1F5F9`;
- item ativo com fundo `#4F46E5`, texto e ícone brancos;
- contadores em pills com fundo contrastante e texto legível;
- AI Workspace pode receber um pequeno badge `Novo` em violeta.

#### Cartões e painéis

- superfície branca;
- borda `#E2E8F0`;
- raio entre `12px` e `16px`;
- padding entre `16px` e `24px`;
- cabeçalho com título, contexto e ação opcional;
- estados vazios centralizados, com ícone simples, título e explicação curta.

#### Mensagens

- mensagens de outras pessoas em branco com borda suave;
- mensagens do usuário atual com fundo `#EEF2FF`;
- autor em `#1E293B`, horário em `#64748B` e corpo em `#334155`;
- mensagens não devem depender somente da posição ou da cor para identificar o autor;
- resultados futuros da IA devem ter ícone próprio e destaque lateral em `#8B5CF6`.

#### Badges e status

- usar formato pill e texto curto;
- online deve combinar ponto verde e texto `Online`;
- offline deve combinar ícone ou ponto vermelho e texto `Offline`;
- itens demonstrativos devem usar badge neutro ou informativo com texto `Demonstração`;
- recursos indisponíveis devem usar `Em planejamento`, sem aparência de ação habilitada.

### 10.7 Ícones, avatares e marca

- criar ícones com SVG local ou CSS, sem adicionar biblioteca visual;
- usar traço consistente entre `1.75px` e `2px`, com terminais arredondados;
- manter a mesma caixa visual para ícones equivalentes;
- adicionar `aria-label` ou texto oculto a botões que tenham somente ícones;
- usar iniciais coloridas nos avatares, evitando dependência de fotografias;
- escolher fundos de avatar a partir das versões claras da paleta e texto em tom escuro correspondente;
- representar a marca com um símbolo simples em índigo/violeta e o nome `TalkIA` em `neutral-900`;
- não deformar, rotacionar ou aplicar efeitos pesados ao símbolo da marca.

### 10.8 Movimento e feedback

- transições de hover, foco e abertura devem durar entre `150ms` e `200ms`;
- usar curvas suaves como `ease-out`;
- evitar animações contínuas, exceto um indicador discreto durante conexão ou carregamento;
- respeitar `prefers-reduced-motion` e remover movimentos não essenciais;
- toda ação deve apresentar feedback visual imediato, mesmo quando aguarda o backend.

### 10.9 Acessibilidade visual

- manter contraste mínimo compatível com WCAG AA;
- garantir foco visível em links, botões, campos e itens de navegação;
- não usar texto menor que `11px`;
- não comunicar estados exclusivamente por cor;
- manter áreas clicáveis com pelo menos `44px` quando possível;
- preservar legibilidade em zoom de até `200%`;
- evitar texto sobre gradientes sem contraste verificado;
- manter a ordem visual coerente com a ordem de navegação por teclado.

## 11. Responsividade

### Desktop

- sidebar principal;
- lista de conversas;
- área central do chat;
- painel lateral da IA.

### Tablet

- manter navegação e chat;
- permitir recolher ou abrir o painel da IA;
- reduzir a largura da lista de conversas.

### Celular

- mostrar uma área principal por vez;
- usar cabeçalho compacto com ação de voltar;
- oferecer navegação acessível entre conversas e AI Workspace;
- manter formulário de mensagem sempre utilizável;
- evitar rolagem horizontal.

## 12. Estados e tratamento de falhas

A interface deve prever:

- carregamento inicial do histórico;
- histórico vazio;
- backend indisponível;
- desconexão e reconexão;
- erro ao buscar mensagens;
- apelido inválido;
- grupo demonstrativo sem backend;
- seção futura ainda não implementada;
- conteúdo longo em mensagens;
- lista extensa de mensagens.

## 13. Documentação

Após a implementação do frontend:

- atualizar o `README.md` com o fluxo correto para iniciar backend e frontend;
- atualizar o status do `PLANO.md` sem apagar seu histórico didático;
- informar quais recursos são reais e quais são demonstrativos;
- registrar que a IA e a autenticação real continuam pendentes.

## 14. Validação técnica

Executar:

```bash
npm run lint
npm run build
```

Verificar manualmente:

1. Apelido vazio não inicia a sessão.
2. Apelido com mais de 30 caracteres é impedido.
3. O login permanece após recarregar a página.
4. Sair remove a sessão e desconecta o socket.
5. O histórico aparece no Projeto Atlas.
6. Duas abas com apelidos diferentes recebem mensagens em tempo real.
7. Cada mensagem aparece apenas uma vez.
8. Mensagens vazias não são enviadas.
9. Ao parar o backend, a interface mostra estado offline.
10. Ao reiniciar o backend, o socket volta ao estado online.
11. Grupos demonstrativos não enviam mensagens para a sala global.
12. O painel de IA não apresenta dados fictícios.
13. A interface funciona em desktop, tablet e celular.
14. A navegação principal pode ser utilizada por teclado.
15. Não há rolagem horizontal indevida.

## 15. Critérios de aceite

A etapa estará concluída quando:

- o frontend deixar de ser apenas o título `Chat`;
- a interface estiver visualmente alinhada ao TalkIA do PDF;
- o login demonstrativo funcionar e persistir localmente;
- o Projeto Atlas utilizar o chat real existente;
- os demais grupos forem claramente demonstrativos;
- o AI Workspace e o painel de IA exibirem estados vazios honestos;
- o layout responder corretamente nos três tamanhos de tela;
- lint e build terminarem sem erros;
- a documentação refletir o estado real do produto.

## 16. Premissas

- O backend estará disponível em `http://localhost:3000` durante o desenvolvimento.
- A sala global atual será apresentada como `Projeto Atlas`.
- O apelido continuará sendo a identidade enviada ao Socket.IO.
- Nenhum dado sensível será armazenado no navegador.
- A implementação real de IA terá um planejamento próprio antes de qualquer integração externa.
