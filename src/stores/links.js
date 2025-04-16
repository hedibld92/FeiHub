import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from './auth'

export const useLinksStore = defineStore('links', () => {
  const links = ref([])
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  const checkAuth = () => {
    if (!authStore.user) {
      throw new Error('Vous devez être connecté pour accéder aux liens.')
    }
  }

  const fetchLinks = async () => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false })

      if (dbError) throw dbError

      links.value = data || []
    } catch (e) {
      console.error('Erreur lors de la récupération des liens:', e)
      error.value = e.message || "Impossible de charger les liens."
    } finally {
      loading.value = false
    }
  }

  const addLink = async ({ title, url, description = '', isFavorite = false }) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('links')
        .insert([{
          user_id: authStore.user.id,
          title,
          url,
          description,
          is_favorite: isFavorite,
          click_count: 0
        }])
        .select()
        .single()

      if (dbError) throw dbError

      links.value.unshift(data)
    } catch (e) {
      console.error('Erreur lors de la création du lien:', e)
      error.value = e.message || "Impossible de créer le lien."
    } finally {
      loading.value = false
    }
  }

  const updateLink = async (id, { title, url, description, isFavorite }) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { data, error: dbError } = await supabase
        .from('links')
        .update({
          title,
          url,
          description,
          is_favorite: isFavorite,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (dbError) throw dbError

      const index = links.value.findIndex(link => link.id === id)
      if (index !== -1) {
        links.value[index] = data
      }
    } catch (e) {
      console.error('Erreur lors de la mise à jour du lien:', e)
      error.value = e.message || "Impossible de mettre à jour le lien."
    } finally {
      loading.value = false
    }
  }

  const deleteLink = async (id) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      const { error: dbError } = await supabase
        .from('links')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      links.value = links.value.filter(link => link.id !== id)
    } catch (e) {
      console.error('Erreur lors de la suppression du lien:', e)
      error.value = e.message || "Impossible de supprimer le lien."
    } finally {
      loading.value = false
    }
  }

  const incrementClickCount = async (id) => {
    try {
      const link = links.value.find(l => l.id === id)
      if (!link) return

      const { error: dbError } = await supabase
        .from('links')
        .update({
          click_count: (link.click_count || 0) + 1,
          last_clicked_at: new Date().toISOString()
        })
        .eq('id', id)

      if (dbError) throw dbError

      // Mettre à jour localement
      link.click_count = (link.click_count || 0) + 1
      link.last_clicked_at = new Date().toISOString()
    } catch (e) {
      console.error('Erreur lors de la mise à jour du compteur:', e)
    }
  }

  const toggleFavorite = async (id) => {
    const link = links.value.find(l => l.id === id)
    if (link) {
      await updateLink(id, {
        ...link,
        isFavorite: !link.is_favorite
      })
    }
  }

  const getFavoriteLinks = () => {
    return links.value.filter(link => link.is_favorite)
  }

  const getRecentLinks = (limit = 5) => {
    return links.value.slice(0, limit)
  }

  const getMostClickedLinks = (limit = 5) => {
    return [...links.value]
      .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
      .slice(0, limit)
  }

  return {
    links,
    loading,
    error,
    fetchLinks,
    addLink,
    updateLink,
    deleteLink,
    incrementClickCount,
    toggleFavorite,
    getFavoriteLinks,
    getRecentLinks,
    getMostClickedLinks
  }
}) 