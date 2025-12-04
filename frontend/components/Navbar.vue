<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <RouterLink to="/resources" class="navbar-brand">📚 Recursos</RouterLink>
            <button class="btn btn-outline-light" @click="logout">Sair</button>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
    localStorage.removeItem('token')
    router.push('/login')
}
</script>