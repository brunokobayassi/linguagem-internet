import Icon from './Icons.jsx';

function DemoConversation({ conversation, onBack, onOpenAi }) {
  return (
    <section className="chat-panel demo-conversation" aria-labelledby="demo-conversation-title">
      <header className="chat-header">
        <button className="icon-button mobile-back" type="button" onClick={onBack} aria-label="Voltar para conversas"><Icon name="chevronLeft" /></button>
        <span className={`avatar avatar-${conversation.color} chat-avatar`}>{conversation.initials}</span>
        <div className="chat-title-group"><div className="chat-title-line"><h1 id="demo-conversation-title">{conversation.name}</h1><span className="demo-badge">Demonstração</span></div><span>Conversa ilustrativa · sem conexão com o backend</span></div>
        <button className="icon-button ai-panel-trigger" type="button" onClick={onOpenAi} aria-label="Abrir painel TalkIA AI"><Icon name="panel" /></button>
      </header>
      <div className="demo-conversation-body">
        <span className="future-main-icon"><Icon name="conversations" size={30} /></span><span className="demo-badge">Espaço demonstrativo</span>
        <h2>Salas independentes ainda não estão disponíveis</h2>
        <p>Hoje o backend possui uma única sala global, representada pelo Projeto Atlas. Esta conversa não abre socket, não envia mensagens e não simula um histórico separado.</p>
        <div className="demo-safety-note"><Icon name="lock" size={17} /> Nada digitado aqui será enviado à sala global.</div>
      </div>
      <footer className="composer-wrap demo-composer"><div className="message-composer"><input aria-label="Mensagem indisponível" placeholder="Disponível quando o backend tiver múltiplas salas" disabled /><button className="send-button" type="button" disabled aria-label="Envio indisponível"><Icon name="send" size={20} /></button></div></footer>
    </section>
  );
}

export default DemoConversation;
