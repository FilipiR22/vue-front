<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<script setup>
// Nenhum script adicional é necessário aqui, pois o roteador gerencia as páginas.
</script>

<style>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 40px;
}
</style>