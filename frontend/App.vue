<template>
  <div class="app">
    <nav class="navbar navbar-dark bg-dark mb-4">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">📚 CRUD - Recursos</span>
      </div>
    </nav>
    <div class="container">
      <Notification ref="noti" />
      <ResourceList @notify="notify" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResourceList from './components/ResourceList.vue'
import Notification from './components/Notification.vue'

const noti = ref(null)
function notify(payload) {
  noti.value?.show(payload)
}
</script>

<style>
.app { 
  min-height: 100vh; 
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 40px;
}
</style>