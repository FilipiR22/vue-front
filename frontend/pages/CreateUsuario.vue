<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 400px;">
            <h3 class="text-center mb-4">Criar Usuário</h3>
            <form @submit.prevent="submit">
                <div class="mb-3">
                    <label class="form-label">Nome</label>
                    <input v-model="name" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input v-model="email" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Senha</label>
                    <input v-model="password" type="password" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Criar Conta</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Usuario from '../services/usuario'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

async function submit() {
    try {
        // Simula criação de usuário (substitua pela chamada real à API)
        console.log('Criando usuário:', { name: name.value, email: email.value, password: password.value })
        Usuario.create({
            name: name.value,
            email: email.value,
            password: password.value
        })
        alert('Usuário criado com sucesso!')
        router.push('/login')
    } catch (err) {
        alert('Erro ao criar usuário')
    }
}
</script>