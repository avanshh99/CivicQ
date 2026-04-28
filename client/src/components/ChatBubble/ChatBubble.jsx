import './ChatBubble.css';

/**
 * ChatBubble — Renders user or assistant messages
 */
export default function ChatBubble({ message, isUser = false }) {
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
      role="article"
      aria-label={`${isUser ? 'Your' : 'CivicQ'} message`}
    >
      <div className={`chat-avatar ${isUser ? 'chat-avatar-user' : 'chat-avatar-assistant'}`} aria-hidden="true">
        {isUser ? '👤' : '🏛️'}
      </div>
      <div>
        <div className="chat-content">
          {typeof message.content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: message.contentHtml || message.content }} />
          ) : (
            message.content
          )}
          {message.card && (
            <div className="chat-card-embed" role="button" tabIndex={0}>
              {message.card}
            </div>
          )}
        </div>
        {time && <div className="chat-timestamp">{time}</div>}
      </div>
    </div>
  );
}

/** Typing indicator component */
export function TypingIndicator() {
  return (
    <div className="chat-bubble chat-bubble-assistant" role="status" aria-label="CivicQ is typing">
      <div className="chat-avatar chat-avatar-assistant" aria-hidden="true">🏛️</div>
      <div className="chat-content">
        <div className="typing-indicator">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
