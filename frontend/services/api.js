// services/api.js
import axios from 'axios'
import router from '../router/index.js' // Verifique o caminho correto

// Configuração base do axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 5000, // Aumentei para 5s (melhor para operações CRUD)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Lista de rotas públicas (que não exigem autenticação)
const publicRoutes = ['/login', '/auth/login', '/register', '/auth/register']

// ============ INTERCEPTOR DE REQUISIÇÃO ============
api.interceptors.request.use(
    (config) => {
        // Obter token do localStorage
        const token = localStorage.getItem('token')
        
        // Se token existir, adicionar ao header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        
        // DEBUG - Apenas em desenvolvimento
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
                headers: config.headers,
                data: config.data,
                params: config.params
            })
        }
        
        return config
    },
    (error) => {
        console.error('[API Request Error]', error)
        return Promise.reject(error)
    }
)

// ============ INTERCEPTOR DE RESPOSTA ============
api.interceptors.response.use(
    (response) => {
        // DEBUG - Apenas em desenvolvimento
        if (import.meta.env.DEV) {
            console.log(`[API Response] ${response.status} ${response.config.url}`)
        }
        return response
    },
    (error) => {
        // Se não tem response, é erro de rede/CORS
        if (!error.response) {
            console.error('[API Network Error]', {
                message: error.message,
                code: error.code,
                url: error.config?.url
            })
            
            // Emitir evento global para mostrar mensagem ao usuário
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('api-error', {
                    detail: {
                        type: 'network',
                        message: 'Erro de conexão. Verifique sua internet.',
                        originalError: error
                    }
                })
                window.dispatchEvent(event)
            }
            
            return Promise.reject({
                type: 'network',
                message: 'Erro de conexão com o servidor',
                original: error
            })
        }
        
        const { status, data } = error.response
        const currentPath = window.location.pathname
        
        // Log do erro
        console.error('[API Error]', {
            url: error.config?.url,
            method: error.config?.method,
            status: status,
            data: data,
            message: error.message
        })
        
        // Tratar erros de autenticação (401/403)
        if (status === 401 || status === 403) {
            console.warn(`[Auth Error] ${status === 401 ? 'Não autorizado' : 'Proibido'}`)
            
            // Limpar dados de autenticação
            localStorage.removeItem('token')
            localStorage.removeItem('usuario') // Note: você usava 'user', mudei para 'usuario'
            
            // Remover header do axios
            delete api.defaults.headers.common['Authorization']
            
            // Verificar se está em rota pública
            const isPublicRoute = publicRoutes.some(route => currentPath.includes(route))
            
            // Só redireciona se não estiver em rota pública e tiver router disponível
            if (!isPublicRoute && router && router.currentRoute) {
                // Usar Vue Router para navegação SPA
                router.push({
                    path: '/login',
                    query: { redirect: router.currentRoute.value.fullPath }
                })
            } else if (!isPublicRoute) {
                // Fallback se router não estiver disponível
                window.location.href = '/login?redirect=' + encodeURIComponent(currentPath)
            }
            
            // Emitir evento para componentes Vue
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('auth-expired', {
                    detail: { message: 'Sua sessão expirou. Faça login novamente.' }
                })
                window.dispatchEvent(event)
            }
            
            return Promise.reject({
                type: 'auth',
                status: status,
                message: status === 401 ? 'Sessão expirada' : 'Acesso proibido',
                details: data
            })
        }
        
        // Tratar outros erros HTTP específicos
        let errorType = 'general'
        let userMessage = 'Ocorreu um erro inesperado'
        
        switch (status) {
            case 400:
                errorType = 'bad-request'
                userMessage = 'Requisição inválida'
                break
            case 404:
                errorType = 'not-found'
                userMessage = 'Recurso não encontrado'
                break
            case 422:
                errorType = 'validation'
                userMessage = 'Erro de validação'
                // Emitir evento para formulários
                if (typeof window !== 'undefined') {
                    const event = new CustomEvent('validation-error', {
                        detail: { errors: data.errors || data }
                    })
                    window.dispatchEvent(event)
                }
                break
            case 500:
                errorType = 'server'
                userMessage = 'Erro interno do servidor'
                // Emitir evento global
                if (typeof window !== 'undefined') {
                    const event = new CustomEvent('server-error', {
                        detail: { message: 'Erro no servidor. Tente novamente mais tarde.' }
                    })
                    window.dispatchEvent(event)
                }
                break
        }
        
        // Emitir evento geral de erro para UI
        if (typeof window !== 'undefined' && status !== 422) {
            const event = new CustomEvent('api-error', {
                detail: {
                    type: errorType,
                    status: status,
                    message: userMessage,
                    details: data,
                    originalError: error
                }
            })
            window.dispatchEvent(event)
        }
        
        return Promise.reject({
            type: errorType,
            status: status,
            message: userMessage,
            details: data,
            original: error
        })
    }
)

// ============ FUNÇÕES AUXILIARES ============

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean}
 */
export function isAuthenticated() {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    // Verificar se token não está expirado (decodificação básica)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.exp > Date.now() / 1000
    } catch {
        return false
    }
}

/**
 * Define o token de autenticação manualmente
 * @param {string} token - Token JWT
 * @param {object} usuario - Dados do usuário
 */
export function setAuthToken(token, usuario = null) {
    if (token) {
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        if (usuario) {
            localStorage.setItem('usuario', JSON.stringify(usuario))
        }
    }
}

/**
 * Limpa dados de autenticação
 */
export function clearAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    delete api.defaults.headers.common['Authorization']
}

/**
 * Obtém dados do usuário logado
 * @returns {object|null}
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('usuario')
    return userStr ? JSON.parse(userStr) : null
}

// ============ INICIALIZAÇÃO ============

// Inicializar token se existir
const savedToken = localStorage.getItem('token')
if (savedToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
}

export default api