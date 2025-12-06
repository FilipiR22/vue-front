// services/api.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
})

// Interceptor para adicionar token a cada requisição
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor para tratar erros 401 (não autorizado)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api