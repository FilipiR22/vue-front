<template>
    <div>
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-md-4">
                        <input v-model.lazy="filters.q" placeholder="🔍 Pesquisar por título..." class="form-control" />
                    </div>
                    <div class="col-md-3">
                        <input v-model.lazy="filters.author" placeholder="👤 Filtrar por autor" class="form-control" />
                    </div>
                    <div class="col-md-2">
                        <select v-model="filters.status" class="form-select">
                            <option value="todos">Todos</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <button @click="openForm(null)" class="btn btn-primary w-100">+ Novo</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <!-- Lista de recursos -->
        <div v-else-if="filteredResources.length" class="space-y-3">
            <template v-for="r in filteredResources" :key="r.id">
                <div class="card shadow-sm resource-card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-2">
                                <h6 class="card-title mb-0 text-truncate" :title="r.titulo">{{ r.titulo }}</h6>
                            </div>
                            <div class="col-md-2">
                                <small class="text-muted">{{ r.autor }}</small>
                            </div>
                            <div class="col-md-2">
                                <small class="text-muted">{{ formatDate(r.data) }}</small>
                            </div>
                            <div class="col-md-2">
                                <span :class="['badge', r.status === 'ativo' ? 'bg-success' : 'bg-danger']">
                                    {{ r.status }}
                                </span>
                            </div>
                            <div class="col-md-4 text-end">
                                <button @click="toggleSubs(r.id)" class="btn btn-sm btn-outline-info me-2">
                                    {{ openedId === r.id ? '▼ Ocultar' : '▶ Subitens' }}
                                </button>
                                <button @click="openForm(r)" class="btn btn-sm btn-outline-warning me-2">
                                    ✏️ Editar
                                </button>
                                <button @click="confirmDelete(r.id)" class="btn btn-sm btn-outline-danger">
                                    🗑️ Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="openedId === r.id" class="card card-body bg-light ms-4 mb-3">
                    <SubResourceList :resourceId="r.id" @notify="notify" />
                </div>
            </template>
        </div>

        <!-- Empty state -->
        <div v-else class="alert alert-info text-center">
            <h5>📭 Nenhum recurso encontrado</h5>
            <p v-if="filters.q || filters.author || filters.status !== 'todos'">
                Tente ajustar os filtros ou
                <a href="#" @click.prevent="clearFilters" class="alert-link">limpar filtros</a>
            </p>
            <p v-else>Crie o primeiro clicando no botão "+ Novo"</p>
        </div>

        <!-- Modal de formulário -->
        <div v-if="showForm" class="modal d-block" style="background: rgba(0, 0, 0, 0.5);">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">{{ editing ? 'Editar Recurso' : 'Novo Recurso' }}</h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeForm"></button>
                    </div>
                    <div class="modal-body">
                        <ResourceForm :model="editing" @save="onSaved" @cancel="closeForm" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import resourceService from '../services/resourceService'
import ResourceForm from './ResourceForm.vue'
import SubResourceList from './SubResourceList.vue'

const emit = defineEmits(['notify'])

const allResources = ref([])
const loading = ref(false)
const showForm = ref(false)
const editing = ref(null)
const openedId = ref(null)

// Filtros
const filters = reactive({
    q: '',
    author: '',
    status: 'todos'
})

// Computed com memoização melhor
const filteredResources = computed(() => {
    const list = Array.isArray(allResources.value) ? allResources.value : []

    if (!filters.q && !filters.author && filters.status === 'todos') {
        return list
    }

    return list.filter(item => {
        // Título
        if (filters.q) {
            const titulo = String(item.titulo || '').toLowerCase()
            if (!titulo.includes(filters.q.toLowerCase())) return false
        }

        // Autor
        if (filters.author) {
            const autor = String(item.autor || '').toLowerCase()
            if (!autor.includes(filters.author.toLowerCase())) return false
        }

        // Status
        if (filters.status !== 'todos') {
            if (String(item.status) !== String(filters.status)) return false
        }

        return true
    })
})

function formatDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('pt-BR')
}

async function fetchList() {
    loading.value = true
    try {
        // Envia os filtros como params para a API (filtragem no servidor)
        const params = {}
        if (filters.q) params.titulo_like = filters.q
        if (filters.author) params.autor_like = filters.author
        if (filters.status !== 'todos') params.status = filters.status

        const response = await resourceService.list(params)

        // DEBUG: Veja a estrutura da resposta
        console.log('Resposta da API:', response)

        // Ajuste conforme a estrutura real da resposta
        // Se a resposta for direto um array:
        if (Array.isArray(response)) {
            allResources.value = response
        }
        // Se for { data: [...] } (Axios padrão):
        else if (response.data && Array.isArray(response.data)) {
            allResources.value = response.data
        }
        // Se for outra estrutura:
        else if (response.data && typeof response.data === 'object') {
            // Se for paginado: response.data.items ou response.data.results
            allResources.value = response.data.items || response.data.results || []
        }
        else {
            allResources.value = []
        }

        console.log('Dados carregados:', allResources.value.length, 'itens')

    } catch (err) {
        console.error('Erro ao buscar recursos:', err)
        notify({
            message: 'Falha ao buscar recursos',
            type: 'error',
            details: err.message
        })
        allResources.value = []
    } finally {
        loading.value = false
    }
}

function clearFilters() {
    filters.q = ''
    filters.author = ''
    filters.status = 'todos'
    fetchList() // Recarrega os dados sem filtros
}

function openForm(model) {
    editing.value = model ? { ...model } : null
    showForm.value = true
}

function closeForm() {
    showForm.value = false
    editing.value = null
}

// No ResourceList.vue
async function onSaved(savedData) {
    try {
        // Notificação já foi feita pelo form
        closeForm()

        // Recarrega a lista para garantir dados atualizados
        await fetchList()

    } catch (err) {
        console.error('Erro após salvar:', err)
    }
}


async function confirmDelete(id) {
    if (!confirm('Tem certeza que deseja excluir este recurso?')) return

    try {
        await resourceService.remove(id)
        notify({ message: 'Removido com sucesso', type: 'success' })

        if (openedId.value === id) {
            openedId.value = null
        }

        await fetchList()
    } catch (err) {
        console.error('Erro ao excluir:', err)
        notify({
            message: 'Erro ao remover recurso',
            type: 'error',
            details: err.message
        })
    }
}

function toggleSubs(id) {
    openedId.value = openedId.value === id ? null : id
}

function notify(payload) {
    emit('notify', payload)
}

// Carregar dados ao montar
onMounted(fetchList)

// Observar mudanças nos filtros e recarregar da API
watch(filters, () => {
    // Usando debounce para evitar muitas chamadas
    clearTimeout(window.filterTimeout)
    window.filterTimeout = setTimeout(fetchList, 300)
})
</script>

<style scoped>
.resource-card {
    transition: all 0.3s ease;
    border: none;
    border-left: 4px solid #007bff;
}

.resource-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.space-y-3>*+* {
    margin-top: 1rem;
}

.modal {
    display: flex !important;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1050;
    backdrop-filter: blur(2px);
}

/* Responsividade */
@media (max-width: 768px) {
    .resource-card .card-body .row>div {
        margin-bottom: 0.5rem;
    }

    .resource-card .text-end {
        text-align: left !important;
        margin-top: 1rem;
    }
}
</style>