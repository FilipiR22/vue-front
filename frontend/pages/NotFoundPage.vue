<!-- pages/NotFoundPage.vue -->
<template>
    <div class="not-found">
        <div class="error-container">
            <h1>404</h1>
            <h2>Página não encontrada</h2>
            <p>A página que você está procurando não existe ou foi movida.</p>
            <router-link to="/home" class="btn btn-primary">
                Voltar para Home
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Opcional: Redirecionar automaticamente após alguns segundos
// setTimeout(() => {
//   router.push('/home')
// }, 5000)
</script>

<style scoped>
.not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    text-align: center;
}

.error-container {
    padding: 2rem;
}

h1 {
    font-size: 6rem;
    margin: 0;
    color: #dc3545;
}

h2 {
    font-size: 2rem;
    margin: 1rem 0;
}

p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #666;
}

.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #0056b3;
}
</style>