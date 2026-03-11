import { useEffect, useState } from 'react'
import useAuthStore from './context/authStore'
import useThemeStore from './context/themeStore'
import AuthPage from './components/AuthPage'
import MainLayout from './components/MainLayout'
import api from './utils/api'

export default function App() {
  const { user, logout } = useAuthStore()
  const { initTheme } = useThemeStore()
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    initTheme()
  }, [])

  useEffect(() => {
    // Validate the stored token on every page load.
    // If the token is stale (DB reset, expired, etc.) the axios interceptor
    // will clear localStorage + redirect, preventing the 403 loop.
    const token = localStorage.getItem('token')
    if (user && token) {
      api.get('/api/conversations')
        .catch(() => { /* interceptor handles clearing session */ })
        .finally(() => setValidating(false))
    } else {
      setValidating(false)
    }
  }, [])

  if (validating) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg-primary)'
      }}>
        <div className="typing-indicator">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />
  return <MainLayout />
}
