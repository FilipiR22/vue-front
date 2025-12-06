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

// Login.vue
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '../services/auth' // Importar serviço

const email = ref('')
const password = ref('')
const router = useRouter()
const isLoading = ref(false) // Para mostrar loading

async function submit() {
    if (isLoading.value) return
    
    isLoading.value = true
    
    try {
        const credentials = {
            email: email.value,
            senha: password.value // Note: backend espera 'senha', não 'password'
        }
        
        const response = await Auth.login(credentials)
        const { token, user } = response.data
        
        // Salvar token e dados do usuário
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Configurar axios para usar o token (se tiver configurado)
        // api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Redirecionar
        router.push('/resources')
        
    } catch (err) {
        console.error('Erro no login:', err)
        
        // Mensagens de erro mais específicas
        if (err.response?.status === 401) {
            alert('Email ou senha incorretos.')
        } else if (err.response?.status === 400) {
            alert('Dados inválidos. Verifique os campos.')
        } else if (err.response?.status === 500) {
            alert('Erro no servidor. Tente novamente mais tarde.')
        } else {
            alert('Erro ao fazer login. Verifique sua conexão.')
        }
        
    } finally {
        isLoading.value = false
    }
}
</script>