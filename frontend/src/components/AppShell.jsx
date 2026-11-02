import { useEffect, useMemo, useState } from 'react';
import { conversations } from '../data/conversations.js';
import AiPanel from './AiPanel.jsx';
import AiWorkspace from './AiWorkspace.jsx';
import ChatPanel from './ChatPanel.jsx';
import ConversationList from './ConversationList.jsx';
import DemoConversation from './DemoConversation.jsx';
import FutureView from './FutureView.jsx';
import Sidebar from './Sidebar.jsx';

function AppShell({ nickname, activeView, activeConversation, onViewChange, onConversationChange, onLogout, onRejectedNickname }) {
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const selectedConversation = useMemo(
    () => conversations.find(({ id }) => id === activeConversation) || conversations[0],
    [activeConversation],
  );

  useEffect(() => {
    function handleEscape(event) { if (event.key === 'Escape') setIsAiPanelOpen(false); }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  function handleConversationSelect(conversationId) {
    onConversationChange(conversationId);
    setIsMobileConversationOpen(true);
  }

  function handleViewChange(view) {
    setIsMobileConversationOpen(false);
    setIsAiPanelOpen(false);
    onViewChange(view);
  }

  return (
    <div className={`app-shell view-${activeView} ${isMobileConversationOpen ? 'mobile-conversation-open' : ''}`}>
      <Sidebar activeView={activeView} nickname={nickname} onViewChange={handleViewChange} onLogout={onLogout} />
      {activeView === 'conversations' && <ConversationList activeConversation={selectedConversation.id} onSelect={handleConversationSelect} />}
      <div className="app-content">
        {activeView === 'conversations' && (
          <div className="conversation-workspace">
            {selectedConversation.isLive ? (
              <ChatPanel nickname={nickname} conversation={selectedConversation} onBack={() => setIsMobileConversationOpen(false)}
                onOpenAi={() => setIsAiPanelOpen(true)} onRejectedNickname={onRejectedNickname} />
            ) : (
              <DemoConversation conversation={selectedConversation} onBack={() => setIsMobileConversationOpen(false)} onOpenAi={() => setIsAiPanelOpen(true)} />
            )}
            <AiPanel isOpen={isAiPanelOpen} onClose={() => setIsAiPanelOpen(false)} />
            {isAiPanelOpen && <button className="drawer-backdrop" type="button" onClick={() => setIsAiPanelOpen(false)} aria-label="Fechar painel de IA" />}
          </div>
        )}
        {activeView === 'ai-workspace' && <AiWorkspace />}
        {(activeView === 'teams' || activeView === 'tasks') && <FutureView view={activeView} />}
      </div>
    </div>
  );
}

export default AppShell;
