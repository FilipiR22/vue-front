<template>
    <form @submit.prevent="submit">
        <div class="mb-3">
            <label class="form-label">Título *</label>
            <input 
                v-model="form.titulo" 
                type="text" 
                class="form-control" 
                required 
                placeholder="Digite o título do subitem..."
            />
        </div>

        <div class="mb-3">
            <label class="form-label">Conteúdo *</label>
            <textarea 
                v-model="form.conteudo" 
                class="form-control" 
                rows="3" 
                required 
                placeholder="Digite o conteúdo..."
            ></textarea>
        </div>

        <div class="mb-3">
            <label class="form-label">Categoria *</label>
            <select 
                v-model="form.categoria" 
                class="form-select" 
                required
            >
                <option value="">Selecione uma categoria</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="educacao">Educação</option>
                <option value="saude">Saúde</option>
                <option value="negocios">Negócios</option>
                <option value="entretenimento">Entretenimento</option>
                <option value="outros">Outros</option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Autor</label>
            <input 
                v-model="form.autor" 
                type="text" 
                class="form-control" 
                placeholder="Nome do autor (opcional)"
            />
        </div>

        <div class="mb-3">
            <label class="form-label">Status</label>
            <select 
                v-model="form.status" 
                class="form-select"
            >
                <option value="ativo">Ativo</option>
                <option value="rascunho">Rascunho</option>
                <option value="inativo">Inativo</option>
            </select>
        </div>

        <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-success flex-grow-1">
                💾 Salvar Subitem
            </button>
            <button type="button" @click="$emit('cancel')" class="btn btn-secondary flex-grow-1">
                ✕ Cancelar
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import subService from '../services/subresourceService'

const props = defineProps({
    model: Object,
    resourceId: String
})
const emit = defineEmits(['save', 'cancel', 'notify'])

const form = ref({
    titulo: '',
    conteudo: '',
    categoria: '',
    autor: '',
    status: 'ativo',
    idrecurso: props.resourceId
})

watch(() => props.model, (newModel) => {
    if (newModel) {
        form.value = { 
            ...newModel,
            idrecurso: props.resourceId
        }
    } else {
        form.value = {
            titulo: '',
            conteudo: '',
            categoria: '',
            autor: '',
            status: 'ativo',
            idrecurso: props.resourceId
        }
    }
}, { immediate: true })

async function submit() {
    try {
        // Validação da categoria obrigatória
        if (!form.value.categoria) {
            emit('notify', { message: 'A categoria é obrigatória', type: 'error' })
            return
        }

        if (props.model?.id) {
            await subService.update(props.model.id, form.value)
        } else {
            await subService.create(form.value)
        }
        emit('save')
    } catch (err) {
        console.error('Erro ao salvar:', err)
        emit('notify', { message: 'Erro ao salvar subitem', type: 'error' })
    }
}
</script>

<style scoped>
form {
    padding: 0.5rem;
}

.form-label {
    font-weight: 500;
    color: #333;
    margin-bottom: 0.5rem;
}

.form-control, .form-select, textarea {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
}

.form-control:focus, .form-select:focus, textarea:focus {
    border-color: #198754;
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

button {
    font-weight: 500;
    border-radius: 0.5rem;
}
</style>