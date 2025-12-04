<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 400px;">
            <h3 class="text-center mb-4">Login</h3>
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
                <p class="text-center mt-3">
                    Não tem uma conta? <RouterLink to="/create-user">Crie uma aqui</RouterLink>
                </p>
            </form>
        </div>
    </div>
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
        if (email.value === 'admin@example.com' && password.value === 'password') {
            localStorage.setItem('token', 'fake-jwt-token')
            router.push('/resources')
        } else {
            alert('Credenciais inválidas. Tente novamente.')
        }
    } catch (err) {
        alert('Erro ao fazer login. Tente novamente mais tarde.')
    }
}
</script>