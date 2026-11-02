import Icon from './Icons.jsx';

const metrics = [
  { label: 'Resumos gerados', value: 0, icon: 'summary', tone: 'indigo' },
  { label: 'Tarefas identificadas', value: 0, icon: 'clipboard', tone: 'violet' },
  { label: 'Decisões registradas', value: 0, icon: 'decision', tone: 'sky' },
];

const emptyCards = [
  { title: 'Resumos recentes', description: 'Quando a integração estiver pronta, os resumos aparecerão organizados aqui.', icon: 'summary' },
  { title: 'Tarefas da equipe', description: 'As ações identificadas nas conversas poderão ser acompanhadas neste espaço.', icon: 'clipboard' },
  { title: 'Decisões importantes', description: 'Acordos registrados pela IA ficarão disponíveis para consulta rápida.', icon: 'decision' },
];

function AiWorkspace() {
  return (
    <main className="page-view ai-workspace" aria-labelledby="ai-workspace-title">
      <header className="page-header workspace-hero">
        <div><span className="eyebrow">Inteligência para o trabalho</span><h1 id="ai-workspace-title">AI Workspace</h1><p>Uma visão organizada dos aprendizados das suas conversas — em breve.</p></div>
        <span className="workspace-status"><Icon name="sparkles" size={17} /> Integração em planejamento</span>
      </header>
      <section className="metrics-grid" aria-label="Indicadores da IA">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}><span className={`metric-icon tone-${metric.tone}`}><Icon name={metric.icon} /></span><div><strong>{metric.value}</strong><span>{metric.label}</span></div></article>
        ))}
      </section>
      <section className="workspace-intro">
        <span><Icon name="info" size={20} /></span><div><strong>Este workspace ainda não processa conversas.</strong><p>A estratégia de IA, privacidade e integrações será definida em uma etapa futura. Os números acima são contadores vazios, não resultados simulados.</p></div>
      </section>
      <section className="workspace-grid" aria-label="Áreas do AI Workspace">
        {emptyCards.map((card) => (
          <article className="workspace-card" key={card.title}>
            <header><span><Icon name={card.icon} /></span><span className="planning-badge">Em planejamento</span></header>
            <div className="workspace-empty-illustration" aria-hidden="true"><span /><span /><span /></div>
            <h2>{card.title}</h2><p>{card.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AiWorkspace;
