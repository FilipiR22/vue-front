<template>
  <div class="app">
    <h1>CRUD - Recursos</h1>
    <Notification ref="noti" />
    <ResourceList @notify="notify" />
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
.app { max-width: 1000px; margin: 20px auto; padding: 0 12px; font-family: Arial, sans-serif; }
</style>