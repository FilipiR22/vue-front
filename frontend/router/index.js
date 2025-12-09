// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import CreateUsuario from '../pages/CreateUsuario.vue'
import Home from '../pages/Home.vue'
import ResourceListPage from '../pages/ResourceListPage.vue'
import ResourceNewPage from '../pages/ResourceNewPage.vue'
import ResourceEditPage from '../pages/ResourceEditPage.vue'
import { isAuthenticated } from '../services/api' // Importar da sua API service

const routes = [
    // ============ ROTAS PÚBLICAS (sem autenticação) ============
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { requiresAuth: false, title: 'Login' }
    },
    // No router/index.js, adicione:
    {
        path: '/resources/:id',
        name: 'ResourceDetails',
        component: () => import('../pages/ResourceDetailsPage.vue'),
        props: true,
        meta: { requiresAuth: true }
    },
    // router/index.js - Adicione esta rota:
    {
        path: '/resources/:id/subrecursos',
        name: 'SubResources',
        component: () => import('../pages/SubResourcePage.vue'),
        props: true,
        meta: {
            requiresAuth: true,
            title: 'Subrecursos',
            breadcrumb: 'Subrecursos'
        }
    },
    {
        path: '/create-user',
        name: 'CreateUser',
        component: CreateUsuario,
        meta: { requiresAuth: false, title: 'Criar Usuário' }
    },

    // ============ ROTAS PROTEGIDAS (com autenticação) ============
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            requiresAuth: true,
            title: 'Dashboard',
            breadcrumb: 'Início'
        }
    },
    {
        path: '/resources',
        name: 'Resources',
        component: ResourceListPage,
        meta: {
            requiresAuth: true,
            title: 'Recursos',
            breadcrumb: 'Recursos'
        }
    },
    {
        path: '/resources/new',
        name: 'ResourceNew',
        component: ResourceNewPage,
        meta: {
            requiresAuth: true,
            title: 'Novo Recurso',
            breadcrumb: 'Novo Recurso'
        }
    },
    {
        path: '/resources/:id/edit',
        name: 'ResourceEdit',
        component: ResourceEditPage,
        props: true,
        meta: {
            requiresAuth: true,
            title: 'Editar Recurso',
            breadcrumb: 'Editar Recurso'
        }
    },

    // ============ ROTA DE REDIRECIONAMENTO ============
    {
        path: '/',
        redirect: '/home'
    },

    // ============ ROTA DE FALLBACK (404) ============
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/NotFoundPage.vue'), // Crie esta página
        meta: { requiresAuth: false, title: 'Página não encontrada' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Restaura posição de scroll ou vai para topo
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// ============ GUARDAS DE NAVEGAÇÃO ============

// Guarda global para autenticação
router.beforeEach((to, from, next) => {
    const authRequired = to.matched.some(record => record.meta.requiresAuth)
    const isAuth = isAuthenticated()

    // Atualizar título da página
    if (to.meta.title) {
        document.title = `${to.meta.title} | ${import.meta.env.VITE_APP_NAME || 'Meu App'}`
    }

    // Se a rota requer autenticação e usuário não está autenticado
    if (authRequired && !isAuth) {
        // Redirecionar para login com página de destino
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
        return
    }

    // Se usuário já está autenticado e tenta acessar login/cadastro
    if (isAuth && (to.path === '/login' || to.path === '/create-user')) {
        // Redirecionar para home
        next('/home')
        return
    }

    // Verificar se token está expirado (mesmo que localStorage tenha token)
    if (authRequired && isAuth) {
        const token = localStorage.getItem('token')
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const isExpired = payload.exp < Date.now() / 1000

            if (isExpired) {
                console.warn('Token expirado, limpando autenticação...')
                localStorage.removeItem('token')
                localStorage.removeItem('usuario')

                next({
                    path: '/login',
                    query: {
                        redirect: to.fullPath,
                        expired: 'true'
                    }
                })
                return
            }
        } catch (error) {
            console.error('Erro ao verificar token:', error)
            // Token inválido, limpar e redirecionar
            localStorage.removeItem('token')
            localStorage.removeItem('usuario')

            next({
                path: '/login',
                query: { invalid: 'true' }
            })
            return
        }
    }

    next()
})

// ============ GUARDA PARA ERROS DE API ============
// Adicionar listener para erros de autenticação da API
if (typeof window !== 'undefined') {
    window.addEventListener('auth-expired', () => {
        if (router.currentRoute.value.path !== '/login') {
            router.push({
                path: '/login',
                query: {
                    redirect: router.currentRoute.value.fullPath,
                    expired: 'true'
                }
            })
        }
    })
}

// ============ HELPER FUNCTIONS ============

/**
 * Verifica se o usuário tem permissão para acessar uma rota
 * @param {string} routeName - Nome da rota
 * @returns {boolean}
 */
export function canAccess(routeName) {
    const route = router.getRoutes().find(r => r.name === routeName)
    if (!route) return false

    if (route.meta.requiresAuth && !isAuthenticated()) {
        return false
    }

    // Aqui você pode adicionar lógica de roles/permissions
    // Ex: if (route.meta.requiresAdmin && !user.isAdmin) return false

    return true
}

/**
 * Navega para uma rota se o usuário tem permissão
 * @param {string} routeName - Nome da rota
 * @param {object} params - Parâmetros da rota
 */
export function navigateTo(routeName, params = {}) {
    if (canAccess(routeName)) {
        router.push({ name: routeName, params })
    } else {
        console.warn(`Usuário não tem permissão para acessar ${routeName}`)
        router.push('/login')
    }
}

export default router

/*rpaiazzzzzzzzzz*/