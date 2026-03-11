import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiMessageSquare, FiCheck, FiX } from 'react-icons/fi'
import { TbBrandOpenai } from 'react-icons/tb'
import useChatStore from '../context/chatStore'
import useAuthStore from '../context/authStore'
import { formatDistanceToNow } from 'date-fns'

const groupConversations = (conversations) => {
  const now = new Date()
  const today = [], yesterday = [], week = [], older = []

  conversations.forEach(conv => {
    const d = new Date(conv.updatedAt || conv.createdAt)
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diff === 0) today.push(conv)
    else if (diff === 1) yesterday.push(conv)
    else if (diff <= 7) week.push(conv)
    else older.push(conv)
  })

  return { today, yesterday, week, older }
}

export default function Sidebar({ isOpen, onClose }) {
  const {
    conversations, activeConversationId,
    loadConversation, clearMessages, deleteConversation, renameConversation
  } = useChatStore()
  const { user, logout } = useAuthStore()

  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const groups = groupConversations(conversations)

  const handleNewChat = () => {
    clearMessages()
    if (window.innerWidth < 768) onClose()
  }

  const handleSelectConv = (id) => {
    loadConversation(id)
    if (window.innerWidth < 768) onClose()
  }

  const handleRenameSubmit = (id) => {
    if (renameVal.trim()) {
      renameConversation(id, renameVal.trim())
    }
    setRenamingId(null)
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deleteConversation(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const renderGroup = (title, items) => {
    if (!items.length) return null
    return (
      <div key={title}>
        <div className="sidebar-section-title">{title}</div>
        {items.map(conv => (
          <div key={conv.id} className="conv-item-wrap">
            {renamingId === conv.id ? (
              <div style={{ display: 'flex', gap: 4, padding: '4px 8px', alignItems: 'center' }}>
                <input
                  className="rename-input"
                  value={renameVal}
                  onChange={e => setRenameVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRenameSubmit(conv.id)
                    if (e.key === 'Escape') setRenamingId(null)
                  }}
                  autoFocus
                />
                <button className="conv-action-btn" onClick={() => handleRenameSubmit(conv.id)}>
                  <FiCheck size={13} />
                </button>
                <button className="conv-action-btn" onClick={() => setRenamingId(null)}>
                  <FiX size={13} />
                </button>
              </div>
            ) : (
              <button
                className={`conversation-item ${activeConversationId === conv.id ? 'active' : ''}`}
                onClick={() => handleSelectConv(conv.id)}
              >
                <FiMessageSquare size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
                <span className="conversation-title">{conv.title || 'New Chat'}</span>
                <div className="conversation-actions">
                  <button
                    className="conv-action-btn"
                    onClick={e => { e.stopPropagation(); setRenamingId(conv.id); setRenameVal(conv.title || '') }}
                    title="Rename"
                  >
                    <FiEdit2 size={12} />
                  </button>
                  <button
                    className={`conv-action-btn delete`}
                    onClick={e => { e.stopPropagation(); handleDelete(conv.id) }}
                    title={deleteConfirm === conv.id ? 'Click again to confirm' : 'Delete'}
                    style={deleteConfirm === conv.id ? { color: '#ef4444', background: 'rgba(239,68,68,0.1)' } : {}}
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    )
  }

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  return (
    <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 8px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), #1a7aff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <TbBrandOpenai size={16} color="white" />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Chat</span>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          <FiPlus size={16} />
          New conversation
        </button>
      </div>

      <div className="sidebar-conversations">
        {conversations.length === 0 ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No conversations yet.<br />Start a new chat!
          </div>
        ) : (
          <>
            {renderGroup('Today', groups.today)}
            {renderGroup('Yesterday', groups.yesterday)}
            {renderGroup('This week', groups.week)}
            {renderGroup('Older', groups.older)}
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile" onClick={logout} title="Click to logout">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.username || 'User'}</div>
            <div className="user-email">{user?.email}</div>
          </div>
          <FiLogOut size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  )
}
