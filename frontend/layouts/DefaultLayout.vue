<template>
    <div>
        <Navbar />
        <main class="container mt-4">
            <RouterView />
        </main>
    </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
</script>