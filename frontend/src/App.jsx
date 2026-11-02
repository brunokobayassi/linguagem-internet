import { useCallback, useState } from 'react';
import AppShell from './components/AppShell.jsx';
import Login from './components/Login.jsx';
import { conversations } from './data/conversations.js';

const NICKNAME_KEY = 'talkia.nickname';
const ACTIVE_VIEW_KEY = 'talkia.activeView';
const ACTIVE_CONVERSATION_KEY = 'talkia.activeConversation';
const validViews = new Set(['conversations', 'teams', 'tasks', 'ai-workspace']);
const validConversationIds = new Set(conversations.map(({ id }) => id));

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The application still works when browser storage is unavailable.
  }
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // The in-memory session is still cleared.
  }
}

function getInitialNickname() {
  const nickname = (readStorage(NICKNAME_KEY) || '').trim();
  return nickname.length > 0 && nickname.length <= 30 ? nickname : '';
}

function getInitialView() {
  const storedView = readStorage(ACTIVE_VIEW_KEY);
  return validViews.has(storedView) ? storedView : 'conversations';
}

function getInitialConversation() {
  const storedConversation = readStorage(ACTIVE_CONVERSATION_KEY);
  return validConversationIds.has(storedConversation) ? storedConversation : 'atlas';
}

function App() {
  const [nickname, setNickname] = useState(getInitialNickname);
  const [activeView, setActiveViewState] = useState(getInitialView);
  const [activeConversation, setActiveConversationState] = useState(getInitialConversation);
  const [sessionNotice, setSessionNotice] = useState('');

  const startSession = useCallback((newNickname) => {
    const normalizedNickname = newNickname.trim();
    if (!normalizedNickname || normalizedNickname.length > 30) return false;

    writeStorage(NICKNAME_KEY, normalizedNickname);
    setNickname(normalizedNickname);
    setSessionNotice('');
    return true;
  }, []);

  const endSession = useCallback((notice = '') => {
    removeStorage(NICKNAME_KEY);
    setNickname('');
    setSessionNotice(typeof notice === 'string' ? notice : '');
  }, []);

  const changeView = useCallback((view) => {
    if (!validViews.has(view)) return;
    writeStorage(ACTIVE_VIEW_KEY, view);
    setActiveViewState(view);
  }, []);

  const changeConversation = useCallback((conversationId) => {
    if (!validConversationIds.has(conversationId)) return;
    writeStorage(ACTIVE_CONVERSATION_KEY, conversationId);
    setActiveConversationState(conversationId);
  }, []);

  const handleRejectedNickname = useCallback((message) => {
    endSession(message || 'O backend recusou este apelido. Escolha outro para continuar.');
  }, [endSession]);

  if (!nickname) return <Login onSubmit={startSession} notice={sessionNotice} />;

  return (
    <AppShell
      nickname={nickname}
      activeView={activeView}
      activeConversation={activeConversation}
      onViewChange={changeView}
      onConversationChange={changeConversation}
      onLogout={endSession}
      onRejectedNickname={handleRejectedNickname}
    />
  );
}

export default App;
