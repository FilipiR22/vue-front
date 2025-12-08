import axios from 'axios'
import router from '../router' // Importe o router Vue

// Configuração base do axios
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Lista de rotas públicas que não devem redirecionar para login
const publicRoutes = ['/login', '/create-user', '/auth/login']

// INTERCEPTOR de requisição
api.interceptors.request.use(
    (config) => {
        // Obter token do localStorage
        const token = localStorage.getItem('token')
        
        // Se token existir, adicionar ao header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        
        // DEBUG (opcional - remova em produção)
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data
        })
        
        return config
    },
    (error) => {
        console.error('[API Request Error]', error)
        return Promise.reject(error)
    }
)

// INTERCEPTOR de resposta
api.interceptors.response.use(
    (response) => {
        // DEBUG (opcional)
        console.log(`[API Response] ${response.status} ${response.config.url}`, response.data)
        return response
    },
    (error) => {
        // Log do erro completo
        console.error('[API Error]', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
            response: error.response?.data
        })
        
        // Se não tem response, é erro de rede/CORS
        if (!error.response) {
            console.error('[API Network Error] Servidor offline ou problema de CORS')
            
            // Emita um evento ou use um store para mostrar mensagem de erro
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('api-network-error', {
                    detail: { message: 'Erro de conexão com o servidor' }
                }))
            }
            
            return Promise.reject(error)
        }
        
        const { status } = error.response
        const currentPath = window.location.pathname
        
        // Tratar erros de autenticação
        if (status === 401 || status === 403) {
            console.warn(`[Auth Error] Token inválido/expirado (${status})`)
            
            // Remover credenciais inválidas
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            
            // Só redireciona se não estiver em rota pública
            const isPublicRoute = publicRoutes.some(route => currentPath.includes(route))
            
            if (!isPublicRoute && router) {
                // Usa Vue Router para navegação SPA (sem recarregar página)
                router.push('/login')
            } else if (!isPublicRoute) {
                // Fallback se router não estiver disponível
                window.location.href = '/login'
            }
            
            // Rejeita a promise com mensagem amigável
            return Promise.reject(new Error('Sessão expirada. Faça login novamente.'))
        }
        
        // Tratar outros erros HTTP
        switch (status) {
            case 404:
                console.error('[API 404] Recurso não encontrado')
                break
            case 500:
                console.error('[API 500] Erro interno do servidor')
                // Emita evento para mostrar mensagem ao usuário
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('api-server-error'))
                }
                break
            case 422:
                console.error('[API 422] Erro de validação', error.response.data)
                break
        }
        
        // Propagar o erro para ser tratado no componente
        return Promise.reject(error)
    }
)

// Função helper para verificar se está autenticado
export function isAuthenticated() {
    return !!localStorage.getItem('token')
}

// Função para definir token manualmente (útil após login)
export function setAuthToken(token) {
    if (token) {
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
    }
}

// Função para limpar autenticação
export function clearAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
}

// Inicializar token se existir
const savedToken = localStorage.getItem('token')
if (savedToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
}

export default api