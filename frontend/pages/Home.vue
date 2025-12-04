<template>
    <DefaultLayout>
        <div class="text-center">
            <h1>Bem-vindo à Aplicação</h1>
            <p>Escolha uma opção abaixo:</p>
            <div class="d-flex justify-content-center gap-3 mt-4">
                <RouterLink to="/resources" class="btn btn-primary">Gerenciar Recursos</RouterLink>
                <RouterLink to="/resources/new" class="btn btn-success">Criar Novo Recurso</RouterLink>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue'
</script>