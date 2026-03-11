import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import Header from './Header'
import useChatStore from '../context/chatStore'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { loadConversations } = useChatStore()

  useEffect(() => {
    loadConversations()
    // Collapse sidebar on mobile
    if (window.innerWidth < 768) setSidebarOpen(false)
  }, [])

  return (
    <div className="app-layout">
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen && window.innerWidth < 768 ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-area">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
        />
        <ChatArea />
      </div>
    </div>
  )
}
