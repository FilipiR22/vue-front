<template>
    <div>
        <div class="toolbar">
            <input v-model="filters.q" placeholder="Pesquisar por título/autor..." @input="applyFilters" />
            <input type="date" v-model="filters.from" @change="applyFilters" />
            <input type="date" v-model="filters.to" @change="applyFilters" />
            <button @click="openForm(null)">Criar recurso</button>
        </div>

        <div v-if="loading">Carregando...</div>
        <div v-else>
            <table v-if="resources.length">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in resources" :key="r.id">
                        <td>{{ r.titulo }}</td>
                        <td>{{ r.autor }}</td>
                        <td>{{ formatDate(r.data) }}</td>
                        <td>{{ r.status }}</td>
                        <td>
                            <button @click="toggleSubs(r.id)">{{ openedId === r.id ? 'Ocultar' : 'Subitens' }}</button>
                            <button @click="openForm(r)">Editar</button>
                            <button @click="confirmDelete(r.id)">Excluir</button>
                        </td>
                    </tr>
                    <tr v-if="openedId === r.id">
                        <td colspan="5">
                            <SubResourceList :resourceId="r.id" @notify="notify" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-else>
                <!-- lista vazia state -->
                <p>Não há recursos. Crie o primeiro.</p>
            </div>
        </div>

        <!-- modal / area de form -->
        <div v-if="showForm" class="modal">
            <ResourceForm :model="editing" @save="onSaved" @cancel="closeForm" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import resourceService from '@/services/resourceService'
import ResourceForm from './ResourceForm.vue'
import SubResourceList from './SubResourceList.vue'

const resources = ref([])
const loading = ref(false)
const showForm = ref(false)
const editing = ref(null)
const openedId = ref(null)

const filters = reactive({ q: '', from: '', to: '' })

function formatDate(d) { return new Date(d).toLocaleString() }

async function fetchList() {
    loading.value = true
    try {
        const params = {}
        if (filters.q) params.q = filters.q
        // json-server: filter by data with gte/lte (example) requires actual timestamp strings
        if (filters.from) params.data_gte = new Date(filters.from).toISOString()
        if (filters.to) params.data_lte = new Date(filters.to).toISOString()
        const res = await resourceService.list(params)
        resources.value = res.data
    } catch (err) {
        // emitir notificação
        notify({ message: 'Falha ao buscar recursos', type: 'error' })
    } finally {
        loading.value = false
    }
}

function applyFilters() { fetchList() }
function openForm(model) { editing.value = model ? { ...model } : null; showForm.value = true }
function closeForm() { showForm.value = false; editing.value = null }
async function onSaved(payload) {
    // payload é o recurso retornado do save
    notify({ message: 'Salvo com sucesso', type: 'success' })
    closeForm()
    fetchList()
}

async function confirmDelete(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await resourceService.remove(id)
        notify({ message: 'Removido', type: 'success' })
        fetchList()
    } catch (e) { notify({ message: 'Erro ao remover', type: 'error' }) }
}

function toggleSubs(id) { openedId.value = openedId.value === id ? null : id }

function notify(payload) { // repassa para App via emit
    // emitir evento para pai (App.vue)
    // usando $emit não disponível em setup sem defineEmits, então:
    // vamos emitir custom event
    emit('notify', payload)
}

onMounted(fetchList)
</script>

<style>
/* estilos simples */
.toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    align-items: center;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    border: 1px solid #ddd;
}

.modal {
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
