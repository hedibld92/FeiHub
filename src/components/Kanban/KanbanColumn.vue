<template>
  <div
    class="flex-1 min-w-[300px] bg-primary-800 rounded-xl p-4 border border-primary-700 shadow-soft"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-primary-100">{{ title }}</h3>
      <span class="bg-primary-700/50 px-2 py-1 rounded-full text-sm text-primary-300">
        {{ taskCount }}
      </span>
    </div>
    <div class="space-y-3 min-h-[200px]">
      <slot></slot>
      <div
        v-if="!hasSlotContent"
        class="h-full flex items-center justify-center text-primary-400 text-sm italic border-2 border-dashed border-primary-700 rounded-lg p-4"
      >
        Aucune tâche
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, useSlots, computed } from 'vue'
import { useKanbanStore } from '@/stores/kanban'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    validator: (value) => ['to_do', 'in_progress', 'done'].includes(value)
  },
  taskCount: {
    type: Number,
    default: 0
  }
})

const slots = useSlots()
const hasSlotContent = computed(() => {
  return slots.default && slots.default().length > 0
})

const kanbanStore = useKanbanStore()

const handleDrop = async (event) => {
  const taskId = event.dataTransfer.getData('taskId')
  if (taskId) {
    await kanbanStore.updateTaskStatus(taskId, props.status)
  }
}
</script> 