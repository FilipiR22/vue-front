<template>
    <div class="form-card">
        <h3 class="black-color">{{ isEdit ? 'Editar recurso' : 'Criar recurso' }}</h3>
        <form @submit.prevent="submit" class="black-color">
            <div class="mb-3">
                <label class="form-label">Título</label>
                <input v-model="form.titulo" class="form-control" />
                <div v-if="errors.titulo" class="err">{{ errors.titulo }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label">Autor</label>
                <input v-model="form.autor" class="form-control" />
            </div>

            <div class="mb-3">
                <label class="form-label">Data</label>
                <input type="datetime-local" v-model="formLocalDate" class="form-control" />
            </div>

            <div class="mb-3">
                <label class="form-label">Status</label>
                <select v-model="form.status" class="form-select">
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                </select>
            </div>

            <div class="actions d-flex gap-2">
                <button type="submit" class="btn btn-primary">{{ isEdit ? 'Salvar' : 'Criar' }}</button>
                <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancelar</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import resourceService from '../services/resourceService'

const props = defineProps({ model: Object })
const emit = defineEmits(['save', 'cancel', 'notify'])

const form = ref({
    titulo: '',
    autor: '',
    data: new Date().toISOString().slice(0,16),
    status: 'ativo'
})

const errors = ref({})

const isEdit = computed(() => !!props.model?.id)

// helper to bind datetime-local (YYYY-MM-DDTHH:mm)
const formLocalDate = computed({
    get() {
        return form.value.data ? form.value.data.slice(0,16) : new Date().toISOString().slice(0,16)
    },
    set(val) {
        form.value.data = new Date(val).toISOString()
    }
})

watch(() => props.model, (newModel) => {
    if (newModel) {
        form.value = {
            ...newModel,
            // garante formato ISO para o campo
            data: newModel.data ? new Date(newModel.data).toISOString() : new Date().toISOString()
        }
    } else {
        // reset quando criando novo
        form.value = {
            titulo: '',
            autor: '',
            data: new Date().toISOString(),
            status: 'ativo'
        }
    }
}, { immediate: true })

function validate() {
    errors.value = {}
    if (!form.value.titulo || !String(form.value.titulo).trim()) {
        errors.value.titulo = 'Título é obrigatório'
    }
    return Object.keys(errors.value).length === 0
}

async function submit() {
    if (!validate()) {
        emit('notify', { message: 'Corrija os campos do formulário', type: 'error' })
        return
    }

    try {
        const payload = {
            ...form.value,
            data: new Date(form.value.data).toISOString()
        }

        if (props.model?.id) {
            await resourceService.update(props.model.id, payload)
            emit('notify', { message: 'Recurso atualizado com sucesso', type: 'success' })
        } else {
            await resourceService.create(payload)
            emit('notify', { message: 'Recurso criado com sucesso', type: 'success' })
        }
        emit('save')
    } catch (err) {
        console.error('Erro ao salvar:', err)
        emit('notify', { message: 'Erro ao salvar recurso', type: 'error' })
    }
}
</script>

<style>
.form-card {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    width: 100%;
    max-width: 700px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.err {
    color: #900;
    font-size: 12px;
    margin-top: 6px;
}

.actions {
    margin-top: 10px;
}
</style>
