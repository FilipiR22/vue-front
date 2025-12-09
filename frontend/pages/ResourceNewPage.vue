<template>
    <DefaultLayout>
        <div class="card p-4">
            <ResourceForm @save="goBack" @cancel="goBack" />
        </div>
    </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ResourceForm from '../components/ResourceForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
    router.push('/resources')
}
</script>