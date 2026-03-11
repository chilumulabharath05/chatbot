import { create } from 'zustand'
import api from '../utils/api'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const { token, email: userEmail, username, userId } = res.data
      const user = { email: userEmail, username, userId }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ token, user, isLoading: false })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      set({ error: msg, isLoading: false })
      return { success: false, error: msg }
    }
  },

  signup: async (email, password, username) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/api/auth/signup', { email, password, username })
      const { token, email: userEmail, username: uname, userId } = res.data
      const user = { email: userEmail, username: uname, userId }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ token, user, isLoading: false })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed'
      set({ error: msg, isLoading: false })
      return { success: false, error: msg }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
