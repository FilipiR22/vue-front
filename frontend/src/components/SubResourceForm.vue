<template>
    <div class="form">
        <h4>{{ isEdit ? 'Editar subitem' : 'Criar subitem' }}</h4>
        <form @submit.prevent="submit">
            <label>Conteúdo</label>
            <textarea v-model="local.conteudo"></textarea>
            <div v-if="errors.conteudo" class="err">{{ errors.conteudo }}</div>

            <label>Autor</label>
            <input v-model="local.autor" />

            <div class="actions">
                <button type="submit">Salvar</button>
                <button type="button" @click="$emit('cancel')">Cancelar</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import subService from '@/services/subresourceService'

const props = defineProps({ model: { type: Object, default: null }, resourceId: { type: Number, required: true } })
const emit = defineEmits(['save', 'cancel'])

const isEdit = computed(() => !!props.model && props.model.id)
const local = reactive({ conteudo: '', autor: '', data: new Date().toISOString(), resourceId: props.resourceId })
const errors = reactive({ conteudo: null })

if (props.model) Object.assign(local, props.model)

function validate() {
    errors.conteudo = null
    if (!local.conteudo || local.conteudo.trim().length < 2) {
        errors.conteudo = 'Conteúdo mínimo 2 caracteres'
        return false
    }
    return true
}

async function submit() {
    if (!validate()) { emit('save', { error: 'validation' }); return }
    try {
        let res
        if (isEdit.value) res = await subService.update(local.id, local)
        else res = await subService.create(local)
        emit('save', res.data)
    } catch (e) { emit('save', { error: 'request' }) }
}
</script>

<style>
.err {
    color: #900
}

.actions {
    margin-top: 8px
}
</style>
