import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useLang } from '../i18n.jsx';

const STORAGE_KEY = 'conversationId';

function readId() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
function saveId(id) {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export default function Chat() {
  const { t } = useLang();
  const [conversationId, setConversationId] = useState(readId);
  const [messages, setMessages] = useState([]);
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(() => searchParams.get('q') ?? '');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  // Load saved history from PostgreSQL when the page opens
  useEffect(() => {
    if (!conversationId) return;
    api
      .getConversation(conversationId)
      .then((data) => setMessages(data.messages))
      .catch(() => {
        saveId(null);
        setConversationId(null);
      });
    // only on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  async function send(text) {
    const message = text.trim();
    if (!message || sending) return;
    setError('');
    setInput('');
    setMessages((m) => [...m, { id: `tmp-${Date.now()}`, role: 'user', content: message }]);
    setSending(true);
    try {
      const res = await api.sendMessage(message, conversationId);
      setConversationId(res.conversationId);
      saveId(res.conversationId);
      setMessages((m) => [...m, { id: `ai-${Date.now()}`, role: 'assistant', content: res.reply }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  async function newChat() {
    if (conversationId) await api.deleteConversation(conversationId).catch(() => {});
    saveId(null);
    setConversationId(null);
    setMessages([]);
    setError('');
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <main className="page chat-page">
      <div className="card chat">
        <div className="chat-header">
          <div className="nova-orb small">AI</div>
          <div>
            <h1>{t('chatTitle')}</h1>
            <p className="muted">{t('chatSubtitle')}</p>
          </div>
          <button className="btn ghost small" onClick={newChat} disabled={sending}>
            ↺ {t('newChat')}
          </button>
        </div>

        <div className="messages" aria-live="polite">
          <div className="msg assistant">
            <div className="bubble"><span className="who">Nova</span>{t('welcome')}</div>
          </div>
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.role}`}>
              <div className="bubble">
                <span className="who">{m.role === 'user' ? t('you') : 'Nova'}</span>
                {m.role === 'assistant' ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="msg assistant">
              <div className="bubble typing">
                <span className="who">Nova</span>
                {t('thinking')}<i /><i /><i />
              </div>
            </div>
          )}
          {error && <div className="chat-error">⚠ {error}</div>}
          <div ref={bottomRef} />
        </div>

        {messages.length === 0 && (
          <div className="suggestions">
            {t('suggestions').map((s) => (
              <button key={s} onClick={() => send(s)} disabled={sending}>{s}</button>
            ))}
          </div>
        )}

        <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('placeholder')}
            rows={1}
            maxLength={2000}
            aria-label={t('placeholder')}
          />
          <button className="btn primary" type="submit" disabled={sending || !input.trim()}>
            {t('send')} ➤
          </button>
        </form>
      </div>
    </main>
  );
}
