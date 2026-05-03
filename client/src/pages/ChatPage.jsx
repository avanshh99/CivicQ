import { useState, useContext, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatContext } from '../store/ChatContext.jsx';
import ChatBubble, { TypingIndicator } from '../components/ChatBubble/ChatBubble.jsx';
import './ChatPage.css';

export default function ChatPage() {
  const { t } = useTranslation();
  const { messages, isLoading, sendMessage, clearMessages } = useContext(ChatContext);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const SUGGESTION_CHIPS = [
    { label: t('chatPage.chips.register'), query: 'How do I register to vote?' },
    { label: t('chatPage.chips.vote'), query: 'What is the voting process?' },
    { label: t('chatPage.chips.timeline'), query: 'Show me the election timeline' },
    { label: t('chatPage.chips.count'), query: 'How are votes counted?' },
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (query) => {
    if (isLoading) return;
    sendMessage(query);
  };

  // Simple markdown-like rendering
  const renderContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^## (.*$)/gm, '<h3 style="font-size:1.1rem;margin:0.75rem 0 0.5rem;">$1</h3>')
      .replace(/^### (.*$)/gm, '<h4 style="font-size:1rem;margin:0.5rem 0 0.25rem;">$1</h4>')
      .replace(/^\- (.*$)/gm, '<li style="margin-left:1rem;list-style:disc;">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li style="margin-left:1rem;list-style:decimal;">$1</li>')
      .replace(/\|(.*)\|/g, (match) => {
        const cells = match.split('|').filter(Boolean).map(c => c.trim());
        return `<div style="display:flex;gap:1rem;padding:0.25rem 0;font-size:0.85rem;">${cells.map(c => `<span style="flex:1">${c}</span>`).join('')}</div>`;
      })
      .replace(/\n/g, '<br/>');
  };

  return (
    <main className="chat-page" role="main" aria-label="Chat with CivicQ">
      <div className="chat-header">
        <div className="chat-header-title">
          <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🏛️</span>
          <div>
            <h2>{t('chatPage.title')}</h2>
            <div className="chat-status">
              <span className="chat-status-dot" aria-hidden="true" />
              <span>{t('chatPage.statusOnline')}</span>
            </div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={clearMessages}
          aria-label="Clear chat history"
        >
          {t('chatPage.clearBtn')}
        </button>
      </div>

      <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={{
              ...msg,
              contentHtml: renderContent(msg.content),
            }}
            isUser={msg.role === 'user'}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips */}
      <div className="chat-suggestions" role="group" aria-label="Suggested questions">
        {SUGGESTION_CHIPS.map((chip, i) => (
          <button
            key={i}
            className="suggestion-chip"
            onClick={() => handleChipClick(chip.query)}
            disabled={isLoading}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder={t('chatPage.placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Type your message"
            disabled={isLoading}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            {t('chatPage.sendBtn')}
          </button>
        </div>
      </div>
    </main>
  );
}
