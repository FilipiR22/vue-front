<template>
    <div>
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-md-4">
                        <input v-model="filters.q" @input="applyFilters" placeholder="🔍 Pesquisar por título..."
                            class="form-control" />
                    </div>
                    <div class="col-md-3">
                        <input v-model="filters.author" @input="applyFilters" placeholder="👤 Filtrar por autor"
                            class="form-control" />
                    </div>
                    <div class="col-md-2">
                        <select v-model="filters.status" @change="applyFilters" class="form-select">
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

        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>
        <div v-else>
            <div v-if="filteredResources.length" class="space-y-3">
                <template v-for="r in filteredResources" :key="r.id">
                    <div class="card shadow-sm resource-card">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-2">
                                    <h6 class="card-title mb-0">{{ r.titulo }}</h6>
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
                                    <button @click="openForm(r)" class="btn btn-sm btn-outline-warning me-2">✏️
                                        Editar</button>
                                    <button @click="confirmDelete(r.id)" class="btn btn-sm btn-outline-danger">🗑️
                                        Excluir</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="openedId === r.id" class="card card-body bg-light ms-4 mb-3">
                        <SubResourceList :resourceId="r.id" @notify="notify" />
                    </div>
                </template>
            </div>

            <div v-else class="alert alert-info text-center">
                <h5>📭 Nenhum recurso encontrado</h5>
                <p>Crie o primeiro clicando no botão "+ Novo"</p>
            </div>
        </div>

        <!-- modal / area de form -->
        <div v-if="showForm" class="modal d-block" style="background: rgba(0, 0, 0, 0.5);">
            <div class="modal-dialog modal-dialog-centered">
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
import { ref, reactive, onMounted, computed } from 'vue'
import resourceService from '../services/resourceService'
import ResourceForm from './ResourceForm.vue'
import SubResourceList from './SubResourceList.vue'

const emit = defineEmits(['notify'])

const allResources = ref([])   // armazena tudo vindo do backend
const loading = ref(false)
const showForm = ref(false)
const editing = ref(null)
const openedId = ref(null)

// filtros
const filters = reactive({
    q: '',           // título
    author: '',      // autor
    status: 'todos'  // 'todos' | 'ativo' | 'inativo'
})

// computed que aplica os filtros localmente (AND entre filtros)
const filteredResources = computed(() => {
    const list = Array.isArray(allResources.value) ? allResources.value : []
    return list.filter(item => {
        // título (match parcial, case-insensitive)
        if (filters.q) {
            const t = String(item.titulo || '').toLowerCase()
            if (!t.includes(filters.q.toLowerCase())) return false
        }
        // autor (match parcial, case-insensitive)
        if (filters.author) {
            const a = String(item.autor || '').toLowerCase()
            if (!a.includes(filters.author.toLowerCase())) return false
        }
        // status (igual)
        if (filters.status && filters.status !== 'todos') {
            if (String(item.status) !== String(filters.status)) return false
        }
        return true
    })
})

function formatDate(d) { return new Date(d).toLocaleString('pt-BR') }

async function fetchList() {
    loading.value = true
    try {
        // busca todos de uma vez e aplica filtros localmente
        const res = await resourceService.list()
        allResources.value = Array.isArray(res.data) ? res.data : (res.data || [])
    } catch (err) {
        notify({ message: 'Falha ao buscar recursos', type: 'error' })
        allResources.value = []
    } finally {
        loading.value = false
    }
}

// mantemos applyFilters como gatilho visual — os filtros são reativos pelo computed
function applyFilters() { /* noop: computed atualiza automaticamente */ }

function openForm(model) { editing.value = model ? { ...model } : null; showForm.value = true }
function closeForm() { showForm.value = false; editing.value = null }

async function onSaved() {
    notify({ message: 'Salvo com sucesso', type: 'success' })
    closeForm()
    await fetchList()
}

async function confirmDelete(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await resourceService.remove(id)
        notify({ message: 'Removido com sucesso', type: 'success' })
        await fetchList()
    } catch (e) { notify({ message: 'Erro ao remover', type: 'error' }) }
}

function toggleSubs(id) { openedId.value = openedId.value === id ? null : id }

function notify(payload) { emit('notify', payload) }

onMounted(fetchList)
</script>

<style scoped>
.resource-card {
    transition: all 0.3s ease;
    border: none;
}

.resource-card:hover {
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
}

.modal-content {
    width: max-content;
}
</style>
