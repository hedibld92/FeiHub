<template>
  <div class="min-h-screen bg-primary-950">
    <div class="p-4 lg:p-8 pt-20 lg:pt-8">
      <div class="max-w-7xl mx-auto">
        <header class="mb-8">
          <div class="flex items-center mb-4">
            <router-link
              to="/dashboard"
              class="mr-4 text-primary-200 hover:text-primary-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </router-link>
            <div>
              <h2 class="text-2xl lg:text-3xl font-bold text-primary-100">Kanban</h2>
              <p class="mt-2 text-primary-300">Gérez vos tâches avec le tableau Kanban</p>
            </div>
          </div>
        </header>

        <KanbanBoard />
      </div>
    </div>
  </div>
</template>

<script setup>
import KanbanBoard from '@/components/Kanban/KanbanBoard.vue'
</script> 