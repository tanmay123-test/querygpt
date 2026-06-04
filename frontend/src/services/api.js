import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password })

export const registerUser = ({ full_name, email, password, confirm_password }) =>
  api.post('/auth/register', {
    full_name,
    email,
    password,
    confirm_password,
  })

export const getMe = () => api.get('/auth/me')

export default api
