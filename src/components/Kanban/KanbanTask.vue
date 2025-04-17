<template>
  <div
    :draggable="true"
    @dragstart="onDragStart"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    :class="[
      'bg-primary-700 rounded-lg shadow-sm p-4 mb-2 cursor-move hover:shadow-md transition-all border-l-4',
      {
        'border-error border-l-error': task.priority === 'high',
        'border-warning border-l-warning': task.priority === 'medium',
        'border-success border-l-success': task.priority === 'low',
        'opacity-50 scale-[1.02]': isDragging
      }
    ]"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-medium text-primary-100">{{ task.title }}</h3>
      <div class="flex space-x-2">
        <button
          @click="showEditModal = true"
          class="text-primary-300 hover:text-accent transition-colors p-1 rounded-lg hover:bg-primary-600/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          @click="deleteTask"
          class="text-primary-300 hover:text-error transition-colors p-1 rounded-lg hover:bg-primary-600/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <p class="text-sm text-primary-300 mb-3">{{ task.description }}</p>
    
    <div class="flex flex-wrap gap-2 items-center">
      <span
        :class="[
          'px-2 py-1 rounded-full text-xs font-medium flex items-center',
          {
            'bg-error/20 text-error': task.priority === 'high',
            'bg-warning/20 text-warning': task.priority === 'medium',
            'bg-success/20 text-success': task.priority === 'low'
          }
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a3 3 0 013 3v2a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm0 8a3 3 0 013-3h10a3 3 0 013 3v2a3 3 0 01-3 3H6a3 3 0 01-3-3v-2z" clip-rule="evenodd" />
        </svg>
        {{ formatPriority(task.priority) }}
      </span>
      
      <span class="text-xs text-primary-400 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
        {{ formatDate(task.due_date) }}
      </span>
    </div>

    <!-- Modal d'édition -->
    <div v-if="showEditModal" class="fixed inset-0 bg-primary-950/80 flex items-center justify-center z-50 p-4">
      <div class="bg-primary-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4 text-primary-100">Modifier la tâche</h3>
        <form @submit.prevent="handleEdit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-primary-200 mb-1">Titre</label>
            <input
              v-model="editedTask.title"
              type="text"
              class="w-full bg-primary-700 border border-primary-600 rounded-lg px-3 py-2 text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-primary-200 mb-1">Description</label>
            <textarea
              v-model="editedTask.description"
              class="w-full bg-primary-700 border border-primary-600 rounded-lg px-3 py-2 text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-primary-200 mb-1">Priorité</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="editedTask.priority = 'low'"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  editedTask.priority === 'low'
                    ? 'bg-success/20 text-success border-2 border-success'
                    : 'bg-primary-700 text-primary-300 border border-primary-600 hover:bg-primary-600'
                ]"
              >
                Basse
              </button>
              <button
                type="button"
                @click="editedTask.priority = 'medium'"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  editedTask.priority === 'medium'
                    ? 'bg-warning/20 text-warning border-2 border-warning'
                    : 'bg-primary-700 text-primary-300 border border-primary-600 hover:bg-primary-600'
                ]"
              >
                Moyenne
              </button>
              <button
                type="button"
                @click="editedTask.priority = 'high'"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  editedTask.priority === 'high'
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
              v-model="editedTask.due_date"
              type="date"
              class="w-full bg-primary-700 border border-primary-600 rounded-lg px-3 py-2 text-primary-100 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 text-primary-300 hover:text-primary-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { useKanbanStore } from '@/stores/kanban'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['task-status-change'])

const kanbanStore = useKanbanStore()
const showEditModal = ref(false)
const editedTask = ref({})

const isDragging = ref(false)
const touchStartY = ref(0)
const touchMoveY = ref(0)
const dragThreshold = 50 // Seuil de déplacement en pixels

// Initialiser les données d'édition quand le modal s'ouvre
watch(showEditModal, (newValue) => {
  if (newValue) {
    editedTask.value = { ...props.task }
  }
})

const onDragStart = (event) => {
  event.dataTransfer.setData('taskId', props.task.id)
}

const onTouchStart = (event) => {
  touchStartY.value = event.touches[0].clientY
}

const onTouchMove = (event) => {
  touchMoveY.value = event.touches[0].clientY
  const deltaY = touchMoveY.value - touchStartY.value

  if (Math.abs(deltaY) > dragThreshold) {
    isDragging.value = true
  }

  // Empêcher le défilement de la page pendant le drag
  if (isDragging.value) {
    event.preventDefault()
  }
}

const onTouchEnd = () => {
  if (isDragging.value) {
    emit('task-status-change', props.task.id)
    isDragging.value = false
  }
  touchStartY.value = 0
  touchMoveY.value = 0
}

const deleteTask = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    await kanbanStore.deleteTask(props.task.id)
  }
}

const handleEdit = async () => {
  await kanbanStore.updateTask(props.task.id, editedTask.value)
  showEditModal.value = false
}

const formatPriority = (priority) => {
  const priorities = {
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse'
  }
  return priorities[priority] || priority
}

const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'dd MMM yyyy', { locale: fr })
}
</script>

<style scoped>
.cursor-move {
  touch-action: none; /* Désactive le comportement tactile par défaut */
}
</style> 