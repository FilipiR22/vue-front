<template>
    <DefaultLayout>
        <div class="container py-4">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <!-- Cabeçalho da página -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 class="mb-1">
                                <i class="fas fa-edit me-2 text-primary"></i>
                                Editar Recurso
                            </h2>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb mb-0">
                                    <li class="breadcrumb-item">
                                        <router-link to="/resources">Recursos</router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">
                                        {{ resource?.titulo || 'Carregando...' }}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <button @click="goBack" class="btn btn-outline-secondary">
                            <i class="fas fa-arrow-left me-2"></i>
                            Voltar
                        </button>
                    </div>

                    <!-- Loading state -->
                    <div v-if="loading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                            <span class="visually-hidden">Carregando...</span>
                        </div>
                        <p class="mt-3 text-muted fs-5">Carregando recurso...</p>
                    </div>

                    <!-- Error state -->
                    <div v-else-if="error" class="alert alert-danger">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                            <div>
                                <h5 class="alert-heading mb-2">Erro ao carregar recurso</h5>
                                <p class="mb-0">{{ error }}</p>
                            </div>
                        </div>
                        <div class="mt-3">
                            <button @click="goBack" class="btn btn-outline-danger me-2">
                                <i class="fas fa-arrow-left me-1"></i> Voltar
                            </button>
                            <button @click="loadResource" class="btn btn-danger">
                                <i class="fas fa-redo me-1"></i> Tentar novamente
                            </button>
                        </div>
                    </div>

                    <!-- Formulário de edição -->
                    <div v-else-if="resource" class="card shadow-lg border-0">
                        <div class="card-header bg-gradient-primary text-white py-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h4 class="mb-0">
                                    <i class="fas fa-file-alt me-2"></i>
                                    Editando: {{ resource.titulo }}
                                </h4>
                                <span class="badge bg-white text-primary fs-6">
                                    ID: {{ resource.id }}
                                </span>
                            </div>
                        </div>
                        <div class="card-body p-4">
                            <ResourceForm :model="resource" @save="onSave" @cancel="goBack"
                                @notify="handleNotification" />
                        </div>
                        <div class="card-footer bg-light py-3">
                            <div class="row">
                                <div class="col-md-6">
                                    <small class="text-muted">
                                        <i class="fas fa-info-circle me-1"></i>
                                        Última atualização: {{ formatDate(resource.data) }}
                                    </small>
                                </div>
                                <div class="col-md-6 text-end">
                                    <small class="text-muted">
                                        Status:
                                        <span :class="statusBadgeClass(resource.status)" class="badge ms-1">
                                            {{ formatStatus(resource.status) }}
                                        </span>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ResourceForm from '../components/ResourceForm.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import resourceService from '../services/resourceService'

const router = useRouter()
const route = useRoute()
const resource = ref(null)
const loading = ref(true)
const error = ref('')

// Função para carregar o recurso
const loadResource = async () => {
    try {
        loading.value = true
        error.value = ''

        const { id } = route.params
        console.log('🔍 Carregando recurso ID:', id)

        // Buscar recurso da API
        const response = await resourceService.get(id)
        console.log('📦 Resposta da API:', response)

        // Verificar diferentes formatos de resposta
        if (response) {
            // Tente diferentes estruturas comuns de resposta
            resource.value =response
            console.log('✅ Recurso carregado para edição:', resource.value)

            if (!resource.value) {
                throw new Error('Recurso não encontrado na resposta')
            }
        } else {
            throw new Error('Resposta vazia da API')
        }

    } catch (err) {
        console.error('❌ Erro ao carregar recurso:', err)
        error.value = err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Erro desconhecido ao carregar recurso'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadResource()
})

function onSave(savedData) {
    console.log('💾 Recurso salvo com sucesso:', savedData)

    // Mostrar mensagem de sucesso
    showNotification({
        message: '✅ Recurso atualizado com sucesso!',
        type: 'success',
        duration: 3000
    })

    // Voltar após um breve delay
    setTimeout(() => {
        goBack()
    }, 1500)
}

function goBack() {
    router.push('/resources')
}

function handleNotification(notification) {
    showNotification(notification)
}

function showNotification({ message, type = 'info', duration = 5000 }) {
    // Criar elemento de notificação
    const notification = document.createElement('div')
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info'

    const icon = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle'

    notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed top-0 end-0 m-3`
    notification.style.zIndex = '1060'
    notification.style.minWidth = '300px'
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="${icon} fa-lg me-3"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `

    document.body.appendChild(notification)

    // Auto-remover após duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove()
        }
    }, duration)
}

function formatDate(date) {
    if (!date) return 'Data não informada'
    try {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return 'Data inválida'
    }
}

function formatStatus(status) {
    const map = {
        'ativo': 'Ativo',
        'inativo': 'Inativo',
        'rascunho': 'Rascunho'
    }
    return map[status] || status
}

function statusBadgeClass(status) {
    const classes = {
        'ativo': 'bg-success',
        'inativo': 'bg-danger',
        'rascunho': 'bg-warning text-dark'
    }
    return classes[status] || 'bg-secondary'
}
</script>

<style scoped>
.bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.card {
    border-radius: 15px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
    border-radius: 15px 15px 0 0 !important;
    border-bottom: none;
}

.card-footer {
    border-top: 1px solid #e9ecef;
    border-radius: 0 0 15px 15px;
}

.breadcrumb {
    background-color: transparent;
    padding: 0;
}

.breadcrumb-item a {
    color: #6c757d;
    text-decoration: none;
    transition: color 0.2s;
}

.breadcrumb-item a:hover {
    color: #007bff;
}

.breadcrumb-item.active {
    color: #495057;
    font-weight: 500;
}

/* Animação para loading */
@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

.spinner-border {
    animation: pulse 1.5s infinite;
}
</style>