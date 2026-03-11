import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FiCopy, FiCheck, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import { TbBrandOpenai } from 'react-icons/tb'
import CodeBlock from './CodeBlock'
import useChatStore from '../context/chatStore'
import useAuthStore from '../context/authStore'

const formatTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false)
  const { regenerateMessage, deleteMessage } = useChatStore()
  const { user } = useAuthStore()

  const isUser = message.role === 'user'

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`message-wrapper fade-in`}>
      <div className="message-header">
        <div className={`message-avatar ${isUser ? 'user' : 'assistant'}`}>
          {isUser ? initials : <TbBrandOpenai size={14} />}
        </div>
        <span className="message-sender">{isUser ? (user?.username || 'You') : 'AI Assistant'}</span>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>

      <div className={`message-content ${isUser ? 'user-content' : ''}`}>
        {isUser ? (
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.content}
          </div>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <CodeBlock language={match[1]}>{children}</CodeBlock>
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  )
                },
                pre({ children }) {
                  return <>{children}</>
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="message-actions">
        <button
          className={`msg-action-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title="Copy message"
        >
          {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>

        {!isUser && (
          <button
            className="msg-action-btn"
            onClick={regenerateMessage}
            title="Regenerate"
          >
            <FiRefreshCw size={13} />
            Regenerate
          </button>
        )}

        <button
          className="msg-action-btn delete"
          onClick={() => deleteMessage(message.id)}
          title="Delete message"
        >
          <FiTrash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  )
}
