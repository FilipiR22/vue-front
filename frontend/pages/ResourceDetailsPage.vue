<template>
    <DefaultLayout>
        <Notification ref="notification" />
        
        <div class="resource-details-page">
            <!-- Cabeçalho com navegação -->
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <router-link to="/resources">
                            <i class="fa fa-arrow-left me-1"></i>
                            Recursos
                        </router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        {{ recurso?.titulo || 'Carregando...' }}
                    </li>
                </ol>
            </nav>

            <!-- Estado de carregamento -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-2 text-muted">Carregando recurso...</p>
            </div>

            <!-- Estado de erro -->
            <div v-else-if="error" class="alert alert-danger">
                <h5><i class="fa fa-exclamation-triangle me-2"></i>Erro ao carregar recurso</h5>
                <p>{{ error }}</p>
                <button @click="carregarRecurso" class="btn btn-sm btn-outline-danger">
                    Tentar novamente
                </button>
            </div>

            <!-- Conteúdo principal -->
            <div v-else-if="recurso" class="card shadow">
                <div class="card-header bg-primary text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 class="mb-0">
                                <i class="fa-solid fa-file-text me-2"></i>
                                {{ recurso.titulo }}
                            </h4>
                            <small class="opacity-75">
                                Criado em {{ formatarData(recurso.data) }}
                            </small>
                        </div>
                        <div class="btn-group">
                            <router-link :to="{ name: 'ResourceEdit', params: { id: recurso.id } }"
                                class="btn btn-light">
                                <i class="fa-solid fa-pencil me-1"></i> Editar
                            </router-link>
                            <button @click="confirmarExclusao" class="btn btn-outline-light">
                                <i class="fa-solid fa-trash me-1"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <!-- Informações do recurso -->
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="info-item">
                                <strong class="text-muted">Status:</strong>
                                <span :class="['badge ms-2', badgeClass(recurso.status)]">
                                    {{ formatarStatus(recurso.status) }}
                                </span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-item">
                                <strong class="text-muted">Categoria:</strong>
                                <span class="ms-2">
                                    {{ recurso.categoria || 'Não definida' }}
                                </span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-item">
                                <strong class="text-muted">ID:</strong>
                                <span class="ms-2">#{{ recurso.id }}</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-item">
                                <strong class="text-muted">Usuário:</strong>
                                <span class="ms-2">ID {{ recurso.idusuario }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Conteúdo do recurso -->
                    <div class="mb-4">
                        <h5 class="border-bottom pb-2 mb-3">
                            <i class="fa-solid fa-card-text me-2"></i>
                            Conteúdo
                        </h5>
                        <div class="content-box p-3 bg-light rounded">
                            <p class="mb-0">{{ recurso.conteudo }}</p>
                        </div>
                    </div>

                    <!-- Seção de Subrecursos -->
                    <div class="subrecursos-section">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="mb-0">
                                <i class="fa fa-list-task me-2"></i>
                                Subrecursos
                                <span class="badge bg-secondary ms-2">
                                    {{ subrecursos.length }}
                                </span>
                            </h5>
                            <button @click="mostrarFormSubrecurso = true" class="btn btn-primary"
                                :disabled="carregandoSubrecursos">
                                <i class="fa-solid fa-plus-circle me-1"></i>
                                Novo Subrecurso
                            </button>
                        </div>

                        <!-- Lista de subrecursos -->
                        <div v-if="carregandoSubrecursos" class="text-center py-3">
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="visually-hidden">Carregando...</span>
                            </div>
                            <small class="text-muted ms-2">Carregando subrecursos...</small>
                        </div>

                        <div v-else-if="subrecursos.length === 0" class="alert alert-info">
                            <div class="text-center py-3">
                                <i class="fa-solid fa-inbox display-4 text-muted mb-2"></i>
                                <p class="mb-0">Nenhum subrecurso encontrado</p>
                                <small>Crie o primeiro clicando no botão acima</small>
                            </div>
                        </div>

                        <div v-else class="list-group">
                            <div v-for="sub in subrecursos" :key="sub.id"
                                class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between align-items-center">
                                    <div>
                                        <h6 class="mb-1">{{ sub.titulo }}</h6>
                                        <small class="text-muted">
                                            {{ sub.autor ? `Autor: ${sub.autor}` : '' }}
                                            {{ sub.categoria ? ` • ${sub.categoria}` : '' }}
                                        </small>
                                    </div>
                                    <div class="btn-group btn-group-sm">
                                        <span :class="['badge me-2', subrecursoBadgeClass(sub.status)]">
                                            {{ formatarSubrecursoStatus(sub.status) }}
                                        </span>
                                        <button @click="editarSubrecurso(sub)" class="btn btn-outline-warning">
                                            <i class="fa-solid fa-pencil"></i>
                                        </button>
                                        <button @click="excluirSubrecurso(sub)" class="btn btn-outline-danger">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <p v-if="sub.conteudo" class="mb-1 mt-2 small">
                                    {{ sub.conteudo.substring(0, 150) }}...
                                </p>
                                <small class="text-muted">
                                    Criado em {{ formatarData(sub.data) }}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal para criar/editar subrecurso -->
            <div v-if="mostrarFormSubrecurso" class="modal d-block" style="background: rgba(0,0,0,0.5)">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="fa" :class="subrecursoEditando ? 'fa-pencil' : 'fa-plus-circle'"></i>
                                {{ subrecursoEditando ? 'Editar Subrecurso' : 'Novo Subrecurso' }}
                            </h5>
                            <button type="button" class="btn-close btn-close-white"
                                @click="fecharFormSubrecurso"></button>
                        </div>
                        <div class="modal-body">
                            <SubResourceForm v-if="recurso" :model="subrecursoEditando" :resource-id="recurso.id"
                                @save="salvarSubrecurso" @cancel="fecharFormSubrecurso" @notify="handleNotification" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import subrecursoService from '../services/subresourceService'
import recursoService from '../services/resourceService'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import SubResourceForm from '../components/SubResourceForm.vue'
import Notification from '../components/Notification.vue'

const route = useRoute()
const router = useRouter()

// Refs
const notification = ref(null)
const recurso = ref(null)
const subrecursos = ref([])
const loading = ref(false)
const carregandoSubrecursos = ref(false)
const error = ref('')
const mostrarFormSubrecurso = ref(false)
const subrecursoEditando = ref(null)

// Funções auxiliares de notificação
const showSuccess = (message) => {
    notification.value?.show({ message, type: 'success' })
}

const showError = (message) => {
    notification.value?.show({ message, type: 'error' })
}

const handleNotification = (data) => {
    notification.value?.show({ 
        message: data.message, 
        type: data.type || 'info' 
    })
}

// Carregar recurso
const carregarRecurso = async () => {
    loading.value = true
    error.value = ''

    try {
        recurso.value = await recursoService.get(route.params.id)
        await carregarSubrecursos()
    } catch (err) {
        console.error('Erro ao carregar recurso:', err)
        error.value = err.message || 'Erro desconhecido'
        showError('Não foi possível carregar o recurso')
    } finally {
        loading.value = false
    }
}

// Carregar subrecursos
const carregarSubrecursos = async () => {
    if (!recurso.value) return

    carregandoSubrecursos.value = true
    try {
        subrecursos.value = await subrecursoService.listByRecurso(recurso.value.id)
    } catch (err) {
        console.error('Erro ao carregar subrecursos:', err)
        showError('Erro ao carregar subrecursos')
    } finally {
        carregandoSubrecursos.value = false
    }
}

// Formatar dados
const formatarData = (data) => {
    if (!data) return 'Data não informada'
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatarStatus = (status) => {
    const map = {
        pendente: 'Pendente',
        em_andamento: 'Em Andamento',
        concluido: 'Concluído',
        cancelado: 'Cancelado'
    }
    return map[status] || status
}

const badgeClass = (status) => {
    const classes = {
        pendente: 'bg-warning text-dark',
        em_andamento: 'bg-info',
        concluido: 'bg-success',
        cancelado: 'bg-danger'
    }
    return classes[status] || 'bg-secondary'
}

// Status para subrecursos (baseado no model: ativo, rascunho, inativo)
const formatarSubrecursoStatus = (status) => {
    const map = {
        ativo: 'Ativo',
        rascunho: 'Rascunho',
        inativo: 'Inativo'
    }
    return map[status] || status
}

const subrecursoBadgeClass = (status) => {
    const classes = {
        ativo: 'bg-success',
        rascunho: 'bg-warning text-dark',
        inativo: 'bg-secondary'
    }
    return classes[status] || 'bg-secondary'
}

// Ações
const confirmarExclusao = async () => {
    if (!confirm(`Tem certeza que deseja excluir o recurso "${recurso.value.titulo}"?`)) {
        return
    }

    try {
        await recursoService.remove(recurso.value.id)
        showSuccess('Recurso excluído com sucesso')
        router.push('/resources')
    } catch (err) {
        showError('Erro ao excluir recurso: ' + (err.message || 'Erro desconhecido'))
    }
}

const salvarSubrecurso = async () => {
    fecharFormSubrecurso()
    await carregarSubrecursos()
    showSuccess('Subrecurso salvo com sucesso')
}

const editarSubrecurso = (sub) => {
    subrecursoEditando.value = { ...sub }
    mostrarFormSubrecurso.value = true
}

const excluirSubrecurso = async (sub) => {
    if (!confirm(`Excluir o subrecurso "${sub.titulo}"?`)) return

    try {
        await subrecursoService.remove(sub.id)
        subrecursos.value = subrecursos.value.filter(s => s.id !== sub.id)
        showSuccess('Subrecurso excluído')
    } catch (err) {
        showError('Erro ao excluir subrecurso')
    }
}

const fecharFormSubrecurso = () => {
    mostrarFormSubrecurso.value = false
    subrecursoEditando.value = null
}

// Lifecycle
onMounted(() => {
    if (!route.params.id) {
        router.push('/resources')
        return
    }
    carregarRecurso()
})
</script>

<style scoped>
.resource-details-page {
    max-width: 1200px;
    margin: 0 auto;
}

.breadcrumb {
    background-color: transparent;
    padding: 0;
}

.breadcrumb-item a {
    text-decoration: none;
    color: #6c757d;
}

.breadcrumb-item a:hover {
    color: #007bff;
}

.card-header {
    border-bottom: none;
}

.info-item {
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.content-box {
    min-height: 100px;
    white-space: pre-line;
}

.subrecursos-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #dee2e6;
}

.list-group-item {
    transition: all 0.2s;
}

.list-group-item:hover {
    background-color: #f8f9fa;
    transform: translateX(2px);
}

.modal {
    backdrop-filter: blur(3px);
}
</style>