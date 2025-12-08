<template>
    <div class="form-card">
        <h3 class="black-color">{{ isEdit ? 'Editar recurso' : 'Criar recurso' }}</h3>
        <form @submit.prevent="submit" class="black-color">
            <div class="mb-3">
                <label class="form-label">Título <span class="text-danger">*</span></label>
                <input 
                    v-model="form.titulo" 
                    class="form-control" 
                    :class="{ 'is-invalid': errors.titulo }"
                    placeholder="Digite o título"
                />
                <div v-if="errors.titulo" class="invalid-feedback">{{ errors.titulo }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label">Autor <span class="text-danger">*</span></label>
                <input 
                    v-model="form.autor" 
                    class="form-control" 
                    :class="{ 'is-invalid': errors.autor }"
                    placeholder="Digite o nome do autor"
                />
                <div v-if="errors.autor" class="invalid-feedback">{{ errors.autor }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label">Data</label>
                <input 
                    type="datetime-local" 
                    v-model="formLocalDate" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.data }"
                />
                <div v-if="errors.data" class="invalid-feedback">{{ errors.data }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label">Status</label>
                <select v-model="form.status" class="form-select">
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                </select>
            </div>

            <div class="actions d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isEdit ? 'Salvar' : 'Criar' }}
                </button>
                <button type="button" class="btn btn-secondary" @click="$emit('cancel')" :disabled="loading">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, watch, computed, reactive } from 'vue'
import resourceService from '../services/resourceService'

const props = defineProps({ 
    model: Object 
})

const emit = defineEmits(['save', 'cancel', 'notify'])

// Estado reativo do formulário
const form = reactive({
    titulo: '',
    autor: '',
    data: new Date().toISOString(),
    status: 'ativo'
})

const errors = reactive({})
const loading = ref(false)

const isEdit = computed(() => !!props.model?.id)

// Helper para o input datetime-local
const formLocalDate = computed({
    get() {
        if (!form.data) return ''
        try {
            const date = new Date(form.data)
            // Formato: YYYY-MM-DDTHH:mm
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            return `${year}-${month}-${day}T${hours}:${minutes}`
        } catch {
            return ''
        }
    },
    set(val) {
        if (val) {
            form.data = new Date(val).toISOString()
        }
    }
})

// Atualizar formulário quando o model mudar
watch(() => props.model, (newModel) => {
    if (newModel) {
        // Edição: copia o modelo
        Object.assign(form, {
            titulo: newModel.titulo || '',
            autor: newModel.autor || '',
            status: newModel.status || 'ativo',
            data: newModel.data ? new Date(newModel.data).toISOString() : new Date().toISOString()
        })
    } else {
        // Novo: reseta o formulário
        Object.assign(form, {
            titulo: '',
            autor: '',
            data: new Date().toISOString(),
            status: 'ativo'
        })
    }
    // Limpa erros
    Object.keys(errors).forEach(key => delete errors[key])
}, { immediate: true })

// Validação
function validate() {
    let isValid = true
    
    // Limpa erros anteriores
    Object.keys(errors).forEach(key => delete errors[key])
    
    // Título obrigatório
    if (!form.titulo || !String(form.titulo).trim()) {
        errors.titulo = 'Título é obrigatório'
        isValid = false
    } else if (form.titulo.length < 3) {
        errors.titulo = 'Título deve ter pelo menos 3 caracteres'
        isValid = false
    }
    
    // Autor obrigatório
    if (!form.autor || !String(form.autor).trim()) {
        errors.autor = 'Autor é obrigatório'
        isValid = false
    }
    
    // Data válida
    if (form.data) {
        const date = new Date(form.data)
        if (isNaN(date.getTime())) {
            errors.data = 'Data inválida'
            isValid = false
        }
    }
    
    return isValid
}

// Submissão
async function submit() {
    if (!validate()) {
        emit('notify', { 
            message: 'Corrija os erros no formulário', 
            type: 'error' 
        })
        return
    }

    loading.value = true

    try {
        // Prepara payload
        const payload = {
            titulo: form.titulo.trim(),
            autor: form.autor.trim(),
            status: form.status,
            data: form.data
        }

        let response
        
        if (props.model?.id) {
            // Atualização
            response = await resourceService.update(props.model.id, payload)
            emit('notify', { 
                message: 'Recurso atualizado com sucesso', 
                type: 'success' 
            })
        } else {
            // Criação
            response = await resourceService.create(payload)
            emit('notify', { 
                message: 'Recurso criado com sucesso', 
                type: 'success' 
            })
        }

        // Emite o evento com os dados salvos para o ResourceList
        emit('save', response.data || payload)
        
    } catch (err) {
        console.error('Erro ao salvar:', err)
        
        // Tratamento de erros específicos da API
        if (err.response?.status === 400) {
            emit('notify', { 
                message: 'Dados inválidos. Verifique as informações.', 
                type: 'error' 
            })
        } else if (err.response?.status === 409) {
            emit('notify', { 
                message: 'Recurso com este título já existe.', 
                type: 'error' 
            })
        } else {
            emit('notify', { 
                message: 'Erro ao salvar recurso. Tente novamente.', 
                type: 'error',
                details: err.message 
            })
        }
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.form-card {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.black-color {
    color: #333;
}

.actions {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #eee;
}

/* Estilos para o estado de loading */
button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>