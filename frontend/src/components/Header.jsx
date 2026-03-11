import { FiMenu, FiSun, FiMoon, FiEdit } from 'react-icons/fi'
import ModelSelector from './ModelSelector'
import useThemeStore from '../context/themeStore'
import useChatStore from '../context/chatStore'

export default function Header({ sidebarOpen, onToggleSidebar }) {
  const { theme, toggleTheme } = useThemeStore()
  const { clearMessages, createConversation, loadConversations } = useChatStore()

  const handleNewChat = async () => {
    clearMessages()
  }

  return (
    <div className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar} title="Toggle sidebar">
          <FiMenu size={18} />
        </button>

        <ModelSelector />
      </div>

      <div className="header-right">
        <button
          className="icon-btn"
          onClick={handleNewChat}
          title="New chat"
        >
          <FiEdit size={17} />
        </button>

        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
        </button>
      </div>
    </div>
  )
}
