import { useState } from 'react'
import useAuthStore from '../context/authStore'
import useThemeStore from '../context/themeStore'
import { FiSun, FiMoon } from 'react-icons/fi'
import { TbBrandOpenai } from 'react-icons/tb'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [localError, setLocalError] = useState('')

  const { login, signup, isLoading, error, clearError } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setLocalError('')

    if (mode === 'signup') {
      if (!username.trim()) { setLocalError('Username is required'); return }
      if (password.length < 6) { setLocalError('Password must be at least 6 characters'); return }
      await signup(email, password, username)
    } else {
      await login(email, password)
    }
  }

  return (
    <div className="auth-page">
      <button
        className="icon-btn"
        onClick={toggleTheme}
        style={{ position: 'fixed', top: 16, right: 16 }}
        title="Toggle theme"
      >
        {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <TbBrandOpenai size={26} />
          </div>
        </div>

        <h1 className="auth-title">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to continue your conversations'
            : 'Start chatting with AI for free'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="Your name"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {(error || localError) && (
            <div className="form-error">{localError || error}</div>
          )}

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? <span className="spinner" /> : null}
            {isLoading
              ? 'Please wait...'
              : mode === 'login' ? 'Sign in' : 'Create account'
            }
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>Don't have an account? <span className="auth-link" onClick={() => { setMode('signup'); clearError(); setLocalError('') }}>Sign up</span></>
          ) : (
            <>Already have an account? <span className="auth-link" onClick={() => { setMode('login'); clearError(); setLocalError('') }}>Sign in</span></>
          )}
        </div>
      </div>
    </div>
  )
}
