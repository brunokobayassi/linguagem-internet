import { conversations } from '../data/conversations.js';
import Icon from './Icons.jsx';

function ConversationList({ activeConversation, onSelect }) {
  return (
    <aside className="conversation-list" aria-label="Lista de conversas">
      <header className="list-header">
        <div><span className="eyebrow">Espaços</span><h1>Conversas</h1></div>
        <button className="icon-button" type="button" disabled aria-label="Criar conversa — em planejamento" title="Em planejamento"><Icon name="plus" /></button>
      </header>
      <div className="search-field"><Icon name="search" size={18} /><input aria-label="Buscar conversas" placeholder="Buscar conversas" disabled /></div>
      <div className="conversation-section-heading"><span>Projetos</span><span>{conversations.length}</span></div>
      <div className="conversation-items">
        {conversations.map((conversation) => (
          <button key={conversation.id} type="button" className={`conversation-item ${activeConversation === conversation.id ? 'is-active' : ''}`}
            onClick={() => onSelect(conversation.id)} aria-pressed={activeConversation === conversation.id}>
            <span className={`avatar avatar-${conversation.color}`}>{conversation.initials}</span>
            <span className="conversation-copy">
              <span className="conversation-title-row"><strong>{conversation.name}</strong><small>{conversation.timestamp}</small></span>
              <span className="conversation-preview">{conversation.preview}</span>
              <span className={`conversation-kind ${conversation.isLive ? 'is-live' : ''}`}>{conversation.isLive ? 'Sala ao vivo' : 'Demonstração'}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="list-footnote"><Icon name="info" size={17} /><p>Somente o Projeto Atlas usa a sala global disponível hoje.</p></div>
    </aside>
  );
}

export default ConversationList;
