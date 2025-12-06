<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 400px;">
            <h3 class="text-center mb-4">Criar Usuário</h3>
            <form @submit.prevent="submit">
                <div class="mb-3">
                    <label class="form-label">Nome</label>
                    <input v-model="nome" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input v-model="email" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Senha</label>
                    <input v-model="senha" type="password" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Criar Conta</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Usuario from '../services/user'

const nome = ref('')
const email = ref('')
const senha = ref('')
const router = useRouter()

async function submit() {
    try {
        console.log('Criando usuário:', { 
            nome: nome.value, 
            email: email.value, 
            senha: senha.value  // CORRIGIDO
        })
        
        const dataUser = {
            nome: nome.value,
            email: email.value,
            senha: senha.value  // AQUI ESTÁ O ERRO! Estava 'semha'
        }
        
        await Usuario.create(dataUser)
        alert('Usuário criado com sucesso!')
        router.push('/login')
        
    } catch (err) {
        console.error('Erro completo:', err)
        console.error('Resposta do servidor:', err.response?.data)
        
        // Adicione isso para ver o que está sendo enviado:
        console.log('Dados enviados:', dataUser) // Adicione esta linha
        
        if (err.response?.status === 422) {
            alert('Dados inválidos. Verifique os campos.')
        } else if (err.response?.status === 400) {
            alert(`Erro: ${err.response.data?.error || 'Dados incorretos'}`)
        } else {
            alert('Erro ao criar usuário. Tente novamente.')
        }
    }
}
</script>