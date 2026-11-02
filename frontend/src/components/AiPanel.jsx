import Icon from './Icons.jsx';

function AiPanel({ isOpen, onClose }) {
  return (
    <aside className={`ai-panel ${isOpen ? 'is-open' : ''}`} aria-label="Painel TalkIA AI">
      <header className="ai-panel-header">
        <div className="ai-title"><span className="ai-icon"><Icon name="sparkles" /></span><div><span className="eyebrow">Assistente da conversa</span><h2>TalkIA AI</h2></div></div>
        <button className="icon-button ai-close" type="button" onClick={onClose} aria-label="Fechar painel de IA"><Icon name="close" /></button>
      </header>
      <div className="planning-card">
        <span className="planning-icon"><Icon name="sparkles" size={24} /></span><span className="planning-badge">Em planejamento</span>
        <h3>IA em planejamento</h3><p>No futuro, este espaço poderá transformar a conversa em resumos, tarefas e decisões.</p>
      </div>
      <div className="ai-capabilities">
        <h3>Recursos previstos</h3>
        <div className="capability-row"><span><Icon name="summary" size={18} /></span><div><strong>Resumir conversa</strong><small>Síntese dos principais pontos</small></div></div>
        <div className="capability-row"><span><Icon name="clipboard" size={18} /></span><div><strong>Identificar tarefas</strong><small>Ações, responsáveis e prazos</small></div></div>
        <div className="capability-row"><span><Icon name="decision" size={18} /></span><div><strong>Registrar decisões</strong><small>Acordos importantes da equipe</small></div></div>
      </div>
      <div className="ai-actions"><button className="button button-primary" type="button" disabled>Gerar resumo</button><button className="button button-secondary" type="button" disabled>Extrair tarefas</button></div>
      <p className="ai-honesty-note"><Icon name="lock" size={16} /> Nenhum conteúdo desta conversa é enviado para uma IA nesta versão.</p>
    </aside>
  );
}

export default AiPanel;
