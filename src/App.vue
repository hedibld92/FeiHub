<template>
  <router-view v-if="!authStore.loading" />
  <div v-else class="min-h-screen flex items-center justify-center bg-primary-900">
    <div class="text-primary-200">Chargement...</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initialize()
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Reset de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #0a0a0a; /* Correspond à bg-primary-950 */
  min-height: 100vh;
}
</style>
