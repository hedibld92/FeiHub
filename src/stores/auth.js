import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const initialize = async () => {
    try {
      // Récupérer la session initiale
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      
      user.value = session?.user || null

      // Écouter les changements d'auth
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event)
        user.value = session?.user || null
        loading.value = false
      })
    } catch (e) {
      console.error('Erreur lors de l\'initialisation:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email, password) => {
    try {
      loading.value = true
      error.value = null

      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      user.value = session?.user || null
      return { success: true }
    } catch (e) {
      console.error('Erreur lors de la connexion:', e)
      error.value = "Erreur lors de la connexion. Vérifiez vos identifiants."
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      user.value = null
    } catch (e) {
      console.error('Erreur lors de la déconnexion:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    initialize,
    signIn,
    signOut,
  }
}) 