<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-primary-100">Tableau Kanban</h2>
      <button
        @click="showNewTaskModal = true"
        class="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg flex items-center shadow-lg hover:shadow-xl transition-all"
      >
        <span class="mr-2">Nouvelle tâche</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Navigation mobile pour les colonnes -->
    <div class="lg:hidden mb-4">
      <div class="flex space-x-2 overflow-x-auto pb-2">
        <button
          v-for="status in ['to_do', 'in_progress', 'done']"
          :key="status"
          @click="currentMobileStatus = status"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
            currentMobileStatus === status
              ? 'bg-accent text-white'
              : 'bg-primary-800 text-primary-300 hover:bg-primary-700'
          ]"
        >
          {{ getStatusLabel(status) }}
          <span class="ml-2 bg-primary-700/50 px-2 py-0.5 rounded-full text-sm">
            {{ getTaskCountByStatus(status) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Vue mobile -->
    <div class="lg:hidden">
      <div class="space-y-4">
        <KanbanTask
          v-for="task in getTasksByStatus(currentMobileStatus)"
          :key="task.id"
          :task="task"
          class="transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          @task-status-change="handleMobileStatusChange"
        />
      </div>
      
      <!-- Menu de sélection du statut (apparaît lors du drag) -->
      <div
        v-if="showStatusMenu"
        class="fixed inset-x-0 bottom-0 bg-primary-800 rounded-t-xl shadow-lg transform transition-transform duration-300 z-50"
        :class="showStatusMenu ? 'translate-y-0' : 'translate-y-full'"
      >
        <div class="p-4">
          <h4 class="text-primary-100 font-medium mb-4">Déplacer vers</h4>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="status in ['to_do', 'in_progress', 'done']"
              :key="status"
              @click="handleMobileStatusSelect(status)"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                currentDragStatus === status
                  ? 'bg-accent text-white'
                  : 'bg-primary-700 text-primary-300 hover:bg-primary-600'
              ]"
            >
              {{ getStatusLabel(status) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue desktop -->
    <div class="hidden lg:flex gap-6 overflow-x-auto pb-4">
      <KanbanColumn 
        v-for="status in ['to_do', 'in_progress', 'done']"
        :key="status"
        :title="getStatusLabel(status)"
        :status="status"
        :task-count="getTaskCountByStatus(status)"
      >
        <KanbanTask
          v-for="task in getTasksByStatus(status)"
          :key="task.id"
          :task="task"
          class="transform transition-all hover:scale-[1.02] active:scale-[0.98]"
        />
      </KanbanColumn>
    </div>

    <!-- Modal nouvelle tâche -->
    <div v-if="showNewTaskModal" class="fixed inset-0 bg-primary-950/80 flex items-center justify-center z-50 p-4">
      <div class="bg-primary-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4 text-primary-100">Nouvelle tâche</h3>
        <form @submit.prevent="createTask">
          <div class="mb-4">
            <label class="block text-sm font-medium text-primary-200 mb-1">Titre</label>
            <input
              v-model="newTask.title"
              type="text"
              class="w-full bg-primary-700 border border-primary-600 rounded-lg px-3 py-2 text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-primary-200 mb-1">Description</label>
            <textarea
              v-model="newTask.description"
              class="w-full bg-primary-700 border border-primary-600 rounded-lg px-3 py-2 text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-primary-200 mb-1">Priorité</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="newTask.priority = 'low'"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  newTask.priority === 'low'
                    ? 'bg-success/20 text-success border-2 border-success'
                    : 'bg-primary-700 text-primary-300 border border-primary-600 hover:bg-primary-600'
                ]"
              >
                Basse
              </button>
              <button
                type="button"
                @click="newTask.priority = 'medium'"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  newTask.priority === 'medium'
                    ? 'bg-warning/20 text-warning border-2 border-warning'
                    : 'bg-primary-700 text-primary-300 border border-primary-600 hover:bg-primary-600'
                ]"
              >
                Moyenne
              </button>
              <button
                type="button"
                @click="newTask.priority = 'high'"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  newTask.priority === 'high'
                    ? 'bg-error/20 text-error border-2 border-error'
                    : 'bg-primary-700 text-primary-300 border border-primary-600 hover:bg-primary-600'
                ]"
              >
                Haute
              </button>
            </div>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-primary-200 mb-1">Date d'échéance</label>
            <input
              v-model="newTask.due_date"
              type="date"
              class="w-full bg-primary-700 border border-primary-600 rounded-lg px-3 py-2 text-primary-100 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showNewTaskModal = false"
              class="px-4 py-2 text-primary-300 hover:text-primary-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useKanbanStore } from '@/stores/kanban'
import KanbanColumn from './KanbanColumn.vue'
import KanbanTask from './KanbanTask.vue'

const kanbanStore = useKanbanStore()
const showNewTaskModal = ref(false)
const currentMobileStatus = ref('to_do')
const showStatusMenu = ref(false)
const currentDragTaskId = ref(null)
const currentDragStatus = ref(null)
const newTask = ref({
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
  status: 'to_do'
})

const getStatusLabel = (status) => {
  const labels = {
    'to_do': 'À faire',
    'in_progress': 'En cours',
    'done': 'Terminé'
  }
  return labels[status]
}

const getTasksByStatus = (status) => {
  return kanbanStore.tasks.filter(task => task.status === status)
}

const getTaskCountByStatus = (status) => {
  return getTasksByStatus(status).length
}

onMounted(async () => {
  await kanbanStore.fetchTasks()
})

const createTask = async () => {
  await kanbanStore.addTask(newTask.value)
  showNewTaskModal.value = false
  newTask.value = {
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    status: 'to_do'
  }
}

const handleMobileStatusChange = (taskId) => {
  currentDragTaskId.value = taskId
  showStatusMenu.value = true
  const task = kanbanStore.tasks.find(t => t.id === taskId)
  currentDragStatus.value = task?.status || 'to_do'
}

const handleMobileStatusSelect = async (newStatus) => {
  if (currentDragTaskId.value) {
    await kanbanStore.updateTaskStatus(currentDragTaskId.value, newStatus)
    showStatusMenu.value = false
    currentDragTaskId.value = null
    currentDragStatus.value = null
  }
}
</script> 