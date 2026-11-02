import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Icon from './Icons.jsx';

const statusLabels = { connecting: 'Conectando', online: 'Online', reconnecting: 'Reconectando', offline: 'Offline' };

function compareMessages(first, second) {
  const firstTime = new Date(first.created_at).getTime();
  const secondTime = new Date(second.created_at).getTime();
  const safeFirstTime = Number.isNaN(firstTime) ? 0 : firstTime;
  const safeSecondTime = Number.isNaN(secondTime) ? 0 : secondTime;
  if (safeFirstTime !== safeSecondTime) return safeFirstTime - safeSecondTime;
  return String(first.message_id).localeCompare(String(second.message_id), 'pt-BR', { numeric: true });
}

function mergeMessages(currentMessages, incomingMessages) {
  const messagesById = new Map();
  [...currentMessages, ...incomingMessages].forEach((message) => {
    if (message?.message_id !== undefined && message?.message_id !== null) {
      messagesById.set(String(message.message_id), message);
    }
  });
  return [...messagesById.values()].sort(compareMessages);
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
}

function ChatPanel({ nickname, conversation, onBack, onOpenAi, onRejectedNickname }) {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [historyStatus, setHistoryStatus] = useState('loading');
  const [historyError, setHistoryError] = useState('');
  const [historyAttempt, setHistoryAttempt] = useState(0);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const messageListRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHistory() {
      try {
        const response = await fetch('/api/messages', { signal: controller.signal });
        if (!response.ok) throw new Error(`O histórico respondeu com status ${response.status}.`);
        const history = await response.json();
        if (!Array.isArray(history)) throw new Error('O histórico retornou um formato inesperado.');
        setMessages((current) => mergeMessages(current, history));
        setHistoryStatus('success');
      } catch (error) {
        if (error.name === 'AbortError') return;
        setHistoryStatus('error');
        setHistoryError('Não foi possível carregar o histórico. Verifique se o backend está disponível.');
      }
    }

    loadHistory();
    return () => controller.abort();
  }, [historyAttempt]);

  useEffect(() => {
    const socket = io({ auth: { nickname }, reconnection: true });
    socketRef.current = socket;

    function handleConnect() { setConnectionStatus('online'); }
    function handleDisconnect(reason) { setConnectionStatus(reason === 'io client disconnect' ? 'offline' : 'reconnecting'); }
    function handleConnectError(error) {
      if (!socket.active) {
        onRejectedNickname(error.message || 'O backend recusou este apelido.');
        return;
      }
      setConnectionStatus('reconnecting');
    }
    function handleNewMessage(message) { setMessages((current) => mergeMessages(current, [message])); }
    function handleReconnectAttempt() { setConnectionStatus('reconnecting'); }
    function handleReconnectFailed() { setConnectionStatus('offline'); }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('message:new', handleNewMessage);
    socket.io.on('reconnect_attempt', handleReconnectAttempt);
    socket.io.on('reconnect_failed', handleReconnectFailed);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('message:new', handleNewMessage);
      socket.io.off('reconnect_attempt', handleReconnectAttempt);
      socket.io.off('reconnect_failed', handleReconnectFailed);
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [nickname, onRejectedNickname]);

  useEffect(() => {
    const list = messageListRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const isOnline = connectionStatus === 'online';
  const normalizedText = text.trim();
  const canSend = isOnline && normalizedText.length > 0 && normalizedText.length <= 500;
  const memberSummary = useMemo(() => `${conversation.members.length + 1} participantes`, [conversation.members.length]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSend || !socketRef.current?.connected) return;
    socketRef.current.emit('message:send', normalizedText);
    setText('');
  }

  function retryHistory() {
    setHistoryStatus('loading');
    setHistoryError('');
    setHistoryAttempt((attempt) => attempt + 1);
  }

  return (
    <section className="chat-panel" aria-labelledby="chat-title">
      <header className="chat-header">
        <button className="icon-button mobile-back" type="button" onClick={onBack} aria-label="Voltar para conversas"><Icon name="chevronLeft" /></button>
        <span className="avatar avatar-indigo chat-avatar">{conversation.initials}</span>
        <div className="chat-title-group">
          <div className="chat-title-line"><h1 id="chat-title">{conversation.name}</h1><span className="live-badge">Ao vivo</span></div>
          <span>{memberSummary} · sala global do backend</span>
        </div>
        <div className={`connection-status status-${connectionStatus}`} role="status" aria-live="polite"><span className="status-dot" />{statusLabels[connectionStatus]}</div>
        <button className="icon-button ai-panel-trigger" type="button" onClick={onOpenAi} aria-label="Abrir painel TalkIA AI"><Icon name="panel" /></button>
      </header>

      <div className="message-area" ref={messageListRef} role="log" aria-live="polite" aria-label="Mensagens da conversa">
        <div className="history-marker"><span>Histórico recente</span></div>
        {historyStatus === 'loading' && messages.length === 0 && (
          <div className="message-state" role="status"><span className="loading-spinner" aria-hidden="true" /><p>Carregando as últimas mensagens…</p></div>
        )}
        {historyStatus === 'error' && (
          <div className="inline-error" role="alert">
            <div><strong>Histórico indisponível</strong><p>{historyError}</p></div>
            <button className="button button-secondary button-small" type="button" onClick={retryHistory}><Icon name="retry" size={17} /> Tentar novamente</button>
          </div>
        )}
        {historyStatus === 'success' && messages.length === 0 && (
          <div className="empty-chat"><span className="empty-icon"><Icon name="conversations" size={26} /></span><h2>A conversa começa aqui</h2><p>Envie a primeira mensagem do Projeto Atlas.</p></div>
        )}
        <div className="messages">
          {messages.map((message) => {
            const isOwnMessage = message.author === nickname;
            return (
              <article className={`message ${isOwnMessage ? 'is-own' : ''}`} key={message.message_id}>
                <span className={`avatar message-author-avatar ${isOwnMessage ? 'avatar-indigo' : 'avatar-sky'}`} aria-hidden="true">{String(message.author).slice(0, 2).toUpperCase()}</span>
                <div className="message-content">
                  <header><strong>{message.author}</strong>{isOwnMessage && <span className="you-badge">Você</span>}<time dateTime={message.created_at}>{formatTime(message.created_at)}</time></header>
                  <p>{message.content}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <footer className="composer-wrap">
        {!isOnline && <p className="composer-warning" role="status"><Icon name="info" size={16} /> O envio será liberado quando a conexão estiver online.</p>}
        <form className="message-composer" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="message-input">Mensagem</label>
          <input id="message-input" value={text} onChange={(event) => setText(event.target.value)}
            placeholder={isOnline ? 'Escreva uma mensagem…' : 'Aguardando conexão…'} maxLength={500} disabled={!isOnline} />
          <span className={`character-count ${text.length > 450 ? 'is-near-limit' : ''}`}>{text.length}/500</span>
          <button className="send-button" type="submit" disabled={!canSend} aria-label="Enviar mensagem"><Icon name="send" size={20} /></button>
        </form>
        <p className="composer-hint">Enter para enviar · mensagens são exibidas como texto</p>
      </footer>
    </section>
  );
}

export default ChatPanel;
