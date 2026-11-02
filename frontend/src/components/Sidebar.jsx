import Icon, { BrandMark } from './Icons.jsx';

const navigation = [
  { id: 'conversations', label: 'Conversas', icon: 'conversations' },
  { id: 'teams', label: 'Equipes', icon: 'teams' },
  { id: 'tasks', label: 'Tarefas', icon: 'tasks' },
  { id: 'ai-workspace', label: 'AI Workspace', icon: 'sparkles', badge: 'Novo' },
];

function getInitials(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function Sidebar({ activeView, nickname, onViewChange, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand" aria-label="TalkIA"><BrandMark /><span>TalkIA</span></div>
      <nav className="primary-navigation" aria-label="Navegação principal">
        {navigation.map((item) => (
          <button key={item.id} type="button" className={`nav-item ${activeView === item.id ? 'is-active' : ''}`}
            onClick={() => onViewChange(item.id)} aria-current={activeView === item.id ? 'page' : undefined} title={item.label}>
            <Icon name={item.icon} /><span className="nav-label">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-profile">
        <span className="avatar avatar-profile" aria-hidden="true">{getInitials(nickname)}</span>
        <span className="profile-copy"><strong>{nickname}</strong><small>Demonstração</small></span>
        <button type="button" className="icon-button logout-button" onClick={() => onLogout()} aria-label="Sair da sessão" title="Sair">
          <Icon name="logout" size={19} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
