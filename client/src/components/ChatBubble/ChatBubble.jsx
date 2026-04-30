import { useState, useEffect, useRef } from 'react';
import './ChatBubble.css';

export default function ChatBubble({ message, isUser }) {
  const [displayedContent, setDisplayedContent] = useState(isUser ? message.contentHtml : '');
  const contentRef = useRef(message.contentHtml);
  
  useEffect(() => {
    if (isUser) {
      setDisplayedContent(message.contentHtml);
      return;
    }

    // Reset if content changes
    if (contentRef.current !== message.contentHtml) {
      contentRef.current = message.contentHtml;
      setDisplayedContent('');
    }

    // Streaming simulation
    let currentIndex = 0;
    const fullText = message.contentHtml;
    
    // Determine speed - faster for longer messages
    const speed = fullText.length > 500 ? 5 : fullText.length > 200 ? 10 : 20;

    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        // Find next HTML tag to skip typing effect inside tags
        if (fullText[currentIndex] === '<') {
          const closingIndex = fullText.indexOf('>', currentIndex);
          if (closingIndex !== -1) {
            currentIndex = closingIndex + 1;
          }
        }
        
        setDisplayedContent(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [message.contentHtml, isUser]);

  return (
    <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
      {!isUser && (
        <div className="chat-avatar chat-avatar-assistant" aria-hidden="true">
          🏛️
        </div>
      )}
      <div>
        <div 
          className="chat-content"
          dangerouslySetInnerHTML={{ __html: displayedContent || (isUser ? '' : '<span class="typing-cursor"></span>') }}
        />
        <div className="chat-timestamp">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {isUser && (
        <div className="chat-avatar chat-avatar-user" aria-hidden="true">
          👤
        </div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="chat-bubble chat-bubble-assistant">
      <div className="chat-avatar chat-avatar-assistant" aria-hidden="true">
        🏛️
      </div>
      <div className="chat-content typing-indicator">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
