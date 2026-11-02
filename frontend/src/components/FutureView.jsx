import Icon from './Icons.jsx';

const viewContent = {
  teams: {
    eyebrow: 'Colaboração', title: 'Equipes', description: 'Organize pessoas, projetos e permissões em um só lugar.', icon: 'users',
    emptyTitle: 'As equipes chegam em uma próxima etapa', emptyDescription: 'Perfis, membros e grupos persistentes dependem de novas estruturas no backend.',
    bullets: ['Cadastro de membros', 'Papéis e permissões', 'Grupos independentes'],
  },
  tasks: {
    eyebrow: 'Organização', title: 'Tarefas', description: 'Acompanhe ações que surgem durante as conversas.', icon: 'clipboard',
    emptyTitle: 'Ainda não há tarefas para acompanhar', emptyDescription: 'Tarefas, responsáveis e prazos persistidos farão parte da evolução do produto.',
    bullets: ['Responsáveis', 'Prazos e status', 'Origem na conversa'],
  },
};

function FutureView({ view }) {
  const content = viewContent[view];
  return (
    <main className="page-view future-view" aria-labelledby={`${view}-title`}>
      <header className="page-header"><div><span className="eyebrow">{content.eyebrow}</span><h1 id={`${view}-title`}>{content.title}</h1><p>{content.description}</p></div><span className="demo-badge">Demonstração</span></header>
      <section className="future-empty-card">
        <span className="future-main-icon"><Icon name={content.icon} size={30} /></span><span className="planning-badge">Depende do backend</span>
        <h2>{content.emptyTitle}</h2><p>{content.emptyDescription}</p>
        <div className="future-features">{content.bullets.map((item) => <span key={item}><Icon name="check" size={16} /> {item}</span>)}</div>
      </section>
    </main>
  );
}

export default FutureView;
