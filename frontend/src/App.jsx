import { useEffect, useState } from 'react'
import useThemeStore from './context/themeStore'
import MainLayout from './components/MainLayout'

export default function App() {
  const { initTheme } = useThemeStore()
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    initTheme()
    setValidating(false)
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

  return <MainLayout />
}
