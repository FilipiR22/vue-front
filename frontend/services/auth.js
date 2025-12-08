// services/auth.js
import api, { setAuthToken, clearAuth } from './api'

export default {
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials)
            const { access_token} = response.data
            
            // Usar a função helper para configurar token
            setAuthToken(access_token)
            
            return response
        } catch (error) {
            // Tratamento específico para erro de login
            if (error.response?.status === 401) {
                throw new Error('Email ou senha incorretos')
            }
            throw error
        }
    },
    
    logout() {
        clearAuth()
        // Se quiser chamar API para logout no backend:
        // await api.post('/auth/logout')
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
    },
    
    // Atualizar dados do usuário
    updateUser(userData) {
        const currentUser = this.getUser()
        const updatedUser = { ...currentUser, ...userData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
    }
}