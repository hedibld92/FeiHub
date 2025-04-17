import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from './auth'

export const useKanbanStore = defineStore('kanban', () => {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  const checkAuth = () => {
    if (!authStore.user) {
      throw new Error('Vous devez être connecté pour accéder aux tâches.')
    }
  }

  const fetchTasks = async () => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (dbError) throw dbError

      tasks.value = data || []
    } catch (e) {
      console.error('Erreur lors de la récupération des tâches:', e)
      error.value = e.message || "Impossible de charger les tâches."
    } finally {
      loading.value = false
    }
  }

  const addTask = async (taskData) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('tasks')
        .insert([{
          user_id: authStore.user.id,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.due_date,
          status: taskData.status
        }])
        .select()
        .single()

      if (dbError) throw dbError

      tasks.value.unshift(data)
    } catch (e) {
      console.error('Erreur lors de la création de la tâche:', e)
      error.value = e.message || "Impossible de créer la tâche."
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (taskId, taskData) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.due_date,
          status: taskData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single()

      if (dbError) throw dbError

      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value[index] = data
      }
    } catch (e) {
      console.error('Erreur lors de la mise à jour de la tâche:', e)
      error.value = e.message || "Impossible de mettre à jour la tâche."
    } finally {
      loading.value = false
    }
  }

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single()

      if (dbError) throw dbError

      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value[index] = data
      }
    } catch (e) {
      console.error('Erreur lors de la mise à jour du statut:', e)
      error.value = e.message || "Impossible de déplacer la tâche."
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (taskId) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { error: dbError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (dbError) throw dbError

      tasks.value = tasks.value.filter(task => task.id !== taskId)
    } catch (e) {
      console.error('Erreur lors de la suppression de la tâche:', e)
      error.value = e.message || "Impossible de supprimer la tâche."
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask
  }
}) 