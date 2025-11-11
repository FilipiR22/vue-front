<template>
    <div v-if="visible" class="noti" :class="type">{{ message }}</div>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const message = ref('')
const type = ref('info')

function show({ message: m, type: t = 'info', timeout = 3000 }) {
    message.value = m
    type.value = t
    visible.value = true
    setTimeout(() => (visible.value = false), timeout)
}

defineExpose({ show })
</script>

<style>
.noti {
    padding: 10px;
    margin: 10px 0;
    border-radius: 6px;
}

.noti.info {
    background: #eef;
    color: #024;
}

.noti.success {
    background: #e6ffed;
    color: #064;
}

.noti.error {
    background: #ffe6e6;
    color: #600;
}
</style>
