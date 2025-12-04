<template>
    <form @submit.prevent="submit">
        <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
            <label class="form-label">Senha</label>
            <input v-model="password" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Entrar</button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

async function submit() {
    try {
        // Simula login (substitua pela chamada real à API)
        if (email.value && password.value) {
            localStorage.setItem('token', 'fake-jwt-token')
            router.push('/resources')
        }
    } catch (err) {
        alert('Erro ao fazer login')
    }
}
</script>