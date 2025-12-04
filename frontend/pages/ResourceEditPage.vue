<template>
    <DefaultLayout>
        <div class="card p-4">
            <h3>Editar Recurso</h3>
            <ResourceForm :model="resource" @save="goBack" @cancel="goBack" />
        </div>
    </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ResourceForm from '../components/ResourceForm.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import resourceService from '../services/resourceService'

const router = useRouter()
const route = useRoute()
const resource = ref(null)

onMounted(async () => {
    const { id } = route.params
    const res = await resourceService.get(id)
    resource.value = res.data
})

function goBack() {
    router.push('/resources')
}
</script>