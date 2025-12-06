// services/auth.js
import api from './api'

export default {
    async login(credentials) {
        const response = await api.post('/auth/login', credentials)
        const { token, user } = response.data
        
        // Salvar no localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return response
    },
    
    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },
    
    getToken() {
        return localStorage.getItem('token')
    },
    
    getUser() {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    },
    
    isAuthenticated() {
        return !!this.getToken()
    }
}