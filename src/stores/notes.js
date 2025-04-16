import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from './auth'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  const checkAuth = () => {
    if (!authStore.user) {
      throw new Error('Vous devez être connecté pour accéder aux notes.')
    }
  }

  const fetchNotes = async () => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (dbError) throw dbError

      notes.value = data || []
    } catch (e) {
      console.error('Erreur lors de la récupération des notes:', e)
      error.value = e.message || "Impossible de charger les notes."
    } finally {
      loading.value = false
    }
  }

  const addNote = async ({ title, content, isPinned = false }) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('notes')
        .insert([{
          user_id: authStore.user.id,
          title,
          content,
          is_pinned: isPinned
        }])
        .select()
        .single()

      if (dbError) throw dbError

      notes.value.unshift(data)
    } catch (e) {
      console.error('Erreur lors de la création de la note:', e)
      error.value = e.message || "Impossible de créer la note."
    } finally {
      loading.value = false
    }
  }

  const updateNote = async (id, { title, content, isPinned }) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('notes')
        .update({
          title,
          content,
          is_pinned: isPinned,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (dbError) throw dbError

      const index = notes.value.findIndex(note => note.id === id)
      if (index !== -1) {
        notes.value[index] = data
      }
    } catch (e) {
      console.error('Erreur lors de la mise à jour de la note:', e)
      error.value = e.message || "Impossible de mettre à jour la note."
    } finally {
      loading.value = false
    }
  }

  const deleteNote = async (id) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { error: dbError } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      notes.value = notes.value.filter(note => note.id !== id)
    } catch (e) {
      console.error('Erreur lors de la suppression de la note:', e)
      error.value = e.message || "Impossible de supprimer la note."
    } finally {
      loading.value = false
    }
  }

  const togglePin = async (id) => {
    const note = notes.value.find(n => n.id === id)
    if (note) {
      await updateNote(id, {
        ...note,
        isPinned: !note.is_pinned
      })
    }
  }

  const getPinnedNotes = () => {
    return notes.value.filter(note => note.is_pinned)
  }

  const getRecentNotes = (limit = 5) => {
    return notes.value.slice(0, limit)
  }

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    getPinnedNotes,
    getRecentNotes
  }
}) 