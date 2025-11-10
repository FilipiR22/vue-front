<template>
    <div>
        <h4>Subitens</h4>
        <button @click="openForm(null)">Criar subitem</button>
        <div v-if="loading">Carregando subitens...</div>
        <ul v-else>
            <li v-for="s in subs" :key="s.id">
                <strong>{{ s.autor }}</strong>: {{ s.conteudo }} ({{ formatDate(s.data) }})
                <button @click="openForm(s)">Editar</button>
                <button @click="del(s.id)">Excluir</button>
            </li>
        </ul>

        <div v-if="showForm" class="subform">
            <!-- podemos reutilizar ResourceForm passando fields diferentes, ou criar SubResourceForm -->
            <SubResourceForm :model="editing" :resourceId="resourceId" @save="onSaved" @cancel="closeForm" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import subService from '@/services/subresourceService'
import SubResourceForm from './SubResourceForm.vue'

const props = defineProps({ resourceId: { type: Number, required: true } })
const emit = defineEmits(['notify'])

const subs = ref([])
const loading = ref(false)
const showForm = ref(false)
const editing = ref(null)

function formatDate(d) { return new Date(d).toLocaleString() }

async function fetch() {
    loading.value = true
    try {
        const res = await subService.list({ resourceId: props.resourceId })
        subs.value = res.data
    } catch (e) { emit('notify', { message: 'Erro ao buscar subitens', type: 'error' }) }
    finally { loading.value = false }
}

function openForm(model) { editing.value = model ? { ...model } : { resourceId: props.resourceId }; showForm.value = true }
function closeForm() { showForm.value = false; editing.value = null }

async function onSaved(payload) {
    emit('notify', { message: 'Subitem salvo', type: 'success' })
    closeForm()
    fetch()
}

async function del(id) {
    if (!confirm('Confirma exclusão do subitem?')) return
    try {
        await subService.remove(id)
        emit('notify', { message: 'Subitem removido', type: 'success' })
        fetch()
    } catch (e) { emit('notify', { message: 'Erro ao remover subitem', type: 'error' }) }
}

onMounted(fetch)
watch(() => props.resourceId, fetch)
</script>

<style>
.subform {
    margin-top: 8px;
}
</style>
