import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const clearSessionAndRedirect = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // Use replace so browser back button doesn't loop
  window.location.replace('/')
}

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    // 401 = no/invalid token, 403 = token present but auth failed (stale user)
    if (status === 401 || status === 403) {
      clearSessionAndRedirect()
    }
    return Promise.reject(error)
  }
)

export default api
