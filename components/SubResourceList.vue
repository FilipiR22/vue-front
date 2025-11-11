<template>
    <div class="sub-resource-container">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0">📋 Subitens</h5>
            <button @click="openForm(null)" class="btn btn-sm btn-success">
                ✨ Novo Subitem
            </button>
        </div>

        <div v-if="loading" class="text-center">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <div v-else>
            <div v-if="subresources.length" class="space-y-2">
                <div v-for="sub in subresources" :key="sub.id" class="card shadow-sm sub-item">
                    <div class="card-body p-3">
                        <div class="row align-items-center">
                            <div class="col-md-1 text-center">
                                <span class="badge bg-info">{{ sub.likes }} 👍</span>
                            </div>
                            <div class="col-md-5">
                                <h6 class="mb-1">{{ sub.titulo }}</h6>
                                <small class="text-muted d-block">{{ sub.conteudo }}</small>
                            </div>
                            <div class="col-md-6 text-end">
                                <button @click="openForm(sub)" class="btn btn-sm btn-outline-warning me-2">
                                    ✏️ Editar
                                </button>
                                <button @click="confirmDelete(sub.id)" class="btn btn-sm btn-outline-danger">
                                    🗑️ Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="alert alert-light text-center py-3 mb-0">
                <small class="text-muted">Nenhum subitem ainda. Crie um!</small>
            </div>
        </div>

        <!-- modal subitem -->
        <div v-if="showForm" class="modal d-block" style="background: rgba(0, 0, 0, 0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content w-100">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">{{ editing ? 'Editar Subitem' : 'Novo Subitem' }}</h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeForm"></button>
                    </div>
                    <div class="modal-body">
                        <SubResourceForm 
                            :model="editing" 
                            :resourceId="resourceId"
                            @save="onSaved" 
                            @cancel="closeForm" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import subService from '../services/subresourceService'
import SubResourceForm from './SubResourceForm.vue'

const props = defineProps({ resourceId: String })
const emit = defineEmits(['notify'])

const subresources = ref([])
const loading = ref(false)
const showForm = ref(false)
const editing = ref(null)

async function fetchSubs() {
    loading.value = true
    try {
        const res = await subService.listByResource(props.resourceId)
        subresources.value = res.data
    } catch (err) {
        notify({ message: 'Erro ao buscar subitens', type: 'error' })
    } finally {
        loading.value = false
    }
}

function openForm(model) { 
    editing.value = model ? { ...model } : null
    showForm.value = true 
}

function closeForm() { 
    showForm.value = false
    editing.value = null 
}

async function onSaved() {
    notify({ message: 'Subitem salvo com sucesso!', type: 'success' })
    closeForm()
    fetchSubs()
}

async function confirmDelete(id) {
    if (!confirm('Remover este subitem?')) return
    try {
        await subService.remove(id)
        notify({ message: 'Subitem removido!', type: 'success' })
        fetchSubs()
    } catch (e) {
        notify({ message: 'Erro ao remover', type: 'error' })
    }
}

function notify(payload) {
    emit('notify', payload)
}

onMounted(fetchSubs)
</script>

<style scoped>
.sub-resource-container {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 0.5rem;
}

.sub-item {
    border: none;
    background: white;
    transition: all 0.3s ease;
}

.sub-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.space-y-2 > * + * {
    margin-top: 0.75rem;
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
</style>
