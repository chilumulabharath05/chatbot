import { useEffect, useState } from 'react'
import useThemeStore from './context/themeStore'
import useAuthStore from './context/authStore'
import MainLayout from './components/MainLayout'
import AuthPage from './components/AuthPage'

export default function App() {
  const { initTheme } = useThemeStore()
  const { token } = useAuthStore()
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    initTheme()
    setValidating(false)
  }, [])

  if (validating) {
    return <div>Loading...</div>
  }

  return token ? <MainLayout /> : <AuthPage />
}
