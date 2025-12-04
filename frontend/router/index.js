import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import CreateUsuario from '../pages/CreateUsuario.vue'
import Home from '../pages/Home.vue'
import ResourceListPage from '../pages/ResourceListPage.vue'
import ResourceNewPage from '../pages/ResourceNewPage.vue'
import ResourceEditPage from '../pages/ResourceEditPage.vue'

const routes = [
    { path: '/login', component: LoginPage },
    { path: '/create-user', component: CreateUsuario },
    { path: '/home', component: Home },
    { path: '/resources', component: ResourceListPage },
    { path: '/resources/new', component: ResourceNewPage },
    { path: '/resources/:id/edit', component: ResourceEditPage, props: true },
    { path: '/', redirect: '/home' }, // Redireciona para a página inicial
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Middleware de autenticação
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')
    const publicRoutes = ['/login', '/create-user'] // Rotas públicas que não exigem autenticação

    if (!publicRoutes.includes(to.path) && !isAuthenticated) {
        next('/login') // Redireciona para login se não autenticado
    } else {
        next() // Permite acesso
    }
})

export default router