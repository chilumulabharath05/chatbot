import { useEffect, useRef } from 'react'
import useChatStore from '../context/chatStore'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import { TbBrandOpenai } from 'react-icons/tb'

const SUGGESTIONS = [
  { title: 'Explain a concept', text: 'Explain quantum computing in simple terms' },
  { title: 'Write code', text: 'Write a Python function to sort a list of dictionaries by a key' },
  { title: 'Creative writing', text: 'Write a short story about an AI that learns to paint' },
  { title: 'Summarize', text: 'What are the key principles of clean code?' },
]

export default function ChatArea() {
  const { messages, isTyping, isLoading, error, sendMessage } = useChatStore()
  const bottomRef = useRef(null)
  const chatRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  const isEmpty = messages.length === 0

  return (
    <>
      <div className="chat-area" ref={chatRef}>
        {isEmpty && !isLoading ? (
          <div className="chat-empty">
            <div className="chat-empty-logo">
              <TbBrandOpenai size={28} />
            </div>
            <h2>How can I help you today?</h2>
            <p>Ask me anything — from writing and coding to analysis and creative projects.</p>
            <div className="suggestion-grid">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-card"
                  onClick={() => sendMessage(s.text)}
                >
                  <strong>{s.title}</strong>
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {isLoading && messages.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            ) : (
              messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))
            )}

            {isTyping && (
              <div className="message-wrapper fade-in">
                <div className="message-header">
                  <div className="message-avatar assistant">
                    <TbBrandOpenai size={14} />
                  </div>
                  <span className="message-sender">AI Assistant</span>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div style={{
                margin: '12px 0',
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10,
                color: 'var(--danger)',
                fontSize: '0.875rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <ChatInput />
        </div>
      </div>
    </>
  )
}
