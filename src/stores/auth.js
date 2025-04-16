import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  const initialize = async () => {
    // Écouter les changements d'auth
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
      loading.value = false
    })

    // Récupérer la session initiale
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user || null
    loading.value = false
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      user.value = null
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return {
    user,
    loading,
    initialize,
    signOut,
  }
}) 