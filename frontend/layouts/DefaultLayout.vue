<template>
    <div class="app-layout">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
            <div class="container">
                <router-link to="/home" class="navbar-brand">
                    <i class="bi bi-stack me-2"></i>
                    Meu Projeto Full-Stack
                </router-link>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <router-link to="/home" class="nav-link" active-class="active">
                                <i class="bi bi-house-door me-1"></i> Home
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/resources" class="nav-link" active-class="active">
                                <i class="bi bi-files me-1"></i> Recursos
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" @click="novoRecurso">
                                <i class="bi bi-plus-circle me-1"></i> Novo Recurso
                            </a>
                        </li>
                    </ul>

                    <div class="navbar-nav">
                        <div class="nav-item dropdown">
                            <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                <i class="bi bi-person-circle me-1"></i>
                                {{ usuario?.nome || 'Usuário' }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <router-link to="/profile" class="dropdown-item">
                                        <i class="bi bi-person me-2"></i> Perfil
                                    </router-link>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <button @click="logout" class="dropdown-item text-danger">
                                        <i class="bi bi-box-arrow-right me-2"></i> Sair
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Container principal -->
        <main class="main-content">
            <div class="container py-4">
                <!-- Notificações -->
                <Notification />

                <!-- Conteúdo da página -->
                <slot />
            </div>
        </main>

        <!-- Footer -->
        <footer class="footer bg-light border-top mt-auto py-3">
            <div class="container text-center text-muted">
                <small>
                    Projeto Full-Stack &copy; {{ new Date().getFullYear() }} -
                    Vue.js 3 + Backend + JWT
                </small>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clearAuth, getCurrentUser } from '../services/api'
import Notification from '../components/Notification.vue'

const router = useRouter()
const usuario = ref(null)

const carregarUsuario = () => {
    usuario.value = getCurrentUser()
}

const logout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
        clearAuth()
        router.push('/login')
    }
}

const novoRecurso = () => {
    router.push('/resources/new')
}

onMounted(() => {
    carregarUsuario()
})
</script>

<style scoped>
.app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.main-content {
    flex: 1;
}

.navbar {
    padding: 1rem 0;
}

.navbar-brand {
    font-weight: 600;
}

.nav-link {
    cursor: pointer;
}

.nav-link.active {
    font-weight: 500;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.dropdown-item {
    cursor: pointer;
}

.footer {
    margin-top: auto;
}
</style>