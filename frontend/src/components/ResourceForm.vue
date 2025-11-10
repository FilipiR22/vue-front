<template>
    <div class="form-card">
        <h3 class="black-color">{{ isEdit ? 'Editar recurso' : 'Criar recurso' }}</h3>
        <form @submit.prevent="submit" class="black-color">
            <div>
                <label>Título</label>
                <input v-model="local.titulo" />
                <div v-if="errors.titulo" class="err">{{ errors.titulo }}</div>
            </div>
            <div>
                <label>Autor</label>
                <input v-model="local.autor" />
            </div>
            <div>
                <label>Data</label>
                <input type="datetime-local" v-model="localData" />
            </div>
            <div>
                <label>Status</label>
                <select v-model="local.status">
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                </select>
            </div>

            <div class="actions">
                <button type="submit">{{ isEdit ? 'Salvar' : 'Criar' }}</button>
                <button type="button" @click="$emit('cancel')">Cancelar</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import resourceService from '@/services/resourceService'

const props = defineProps({
    model: { type: Object, default: null } // null -> create, object -> edit
})
const emit = defineEmits(['save', 'cancel'])

const isEdit = computed(() => !!props.model)
const local = reactive({
    titulo: '',
    autor: '',
    data: new Date().toISOString(),
    status: 'ativo'
})
const errors = reactive({ titulo: null })

// se for editar, preencher fields
if (props.model) {
    Object.assign(local, props.model)
}

// helper para binding datetime-local (string <-> input)
const localData = computed({
    get() {
        return local.data ? new Date(local.data).toISOString().slice(0, 16) : ''
    },
    set(val) {
        local.data = new Date(val).toISOString()
    }
})

function validate() {
    errors.titulo = null
    if (!local.titulo || local.titulo.trim().length < 3) {
        errors.titulo = 'Título obrigatório (mínimo 3 caracteres)'
        return false
    }
    return true
}

async function submit() {
    if (!validate()) {
        emit('save', { error: 'validation' }) // opcional
        return
    }
    try {
        let res
        if (isEdit.value) {
            res = await resourceService.update(local.id, local)
        } else {
            res = await resourceService.create(local)
        }
        emit('save', res.data)
    } catch (e) {
        emit('save', { error: 'request', details: e })
    }
}
</script>

<style>
.form-card {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    width: 600px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.err {
    color: #900;
    font-size: 12px;
}

.actions {
    margin-top: 10px;
    display: flex;
    gap: 8px;
}
</style>
