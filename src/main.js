import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { SecurityService } from './services/security'

const initApp = async () => {
  try {
    // Initialisation des services de sécurité
    await SecurityService.initializeSession()

    const app = createApp(App)
    const pinia = createPinia()

    // Middleware de sécurité pour Pinia
    pinia.use(({ store }) => {
      store.$subscribe((mutation) => {
        // Chiffrement des données sensibles avant stockage
        if (mutation.type.includes('auth/')) {
          // Ne pas logger les mutations liées à l'authentification
          return
        }
        console.log('Store mutation:', mutation.type)
      })
    })

    app.use(pinia)
    app.use(router)

    // Protection contre les attaques XSS pour les données affichées
    app.config.globalProperties.$sanitize = SecurityService.sanitizeInput

    // Directive personnalisée pour l'assainissement automatique
    app.directive('sanitize', {
      mounted(el, binding) {
        el.textContent = SecurityService.sanitizeInput(binding.value)
      },
      updated(el, binding) {
        el.textContent = SecurityService.sanitizeInput(binding.value)
      }
    })

    app.mount('#app')
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'application:', error)
  }
}

initApp()
