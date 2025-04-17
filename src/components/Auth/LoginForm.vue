<template>
  <div class="min-h-screen flex items-center justify-center bg-primary-900">
    <div class="max-w-md w-full space-y-8 p-8 bg-primary-800 rounded-lg shadow-xl">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-primary-200">
          Fei.Hub v1.0.3
        </h2>
        <p class="mt-2 text-center text-sm text-primary-400">
          Votre espace personnel
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-primary-600 bg-primary-700 placeholder-primary-400 text-primary-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-primary-600 bg-primary-700 placeholder-primary-400 text-primary-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Mot de passe"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            :disabled="loading"
          >
            <span v-if="loading">Connexion en cours...</span>
            <span v-else>Se connecter</span>
          </button>
        </div>

        <div v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (signInError) throw signInError

    router.push('/dashboard')
  } catch (e) {
    error.value = "Erreur lors de la connexion. Vérifiez vos identifiants."
    console.error('Erreur de connexion:', e)
  } finally {
    loading.value = false
  }
}
</script> 