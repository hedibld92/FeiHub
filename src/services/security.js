import { securityConfig } from '../config/security'
import { EncryptionService } from './encryption'
import { supabase } from '../supabase'

export class SecurityService {
  static #sessionTimeout = null
  static #originalEval = window.eval

  static async initializeSession() {
    // Initialisation du service de chiffrement
    await EncryptionService.initialize()
    
    // Configuration des headers de sécurité
    this.setSecurityHeaders()
    
    // Mise en place du renouvellement automatique de session
    this.setupSessionRenewal()
    
    // Protection contre les attaques XSS et injections
    this.setupXSSProtection()
  }

  static setSecurityHeaders() {
    // Application des headers de sécurité
    Object.entries(securityConfig.headers).forEach(([key, value]) => {
      if (typeof window !== 'undefined') {
        document.head.appendChild(
          Object.assign(document.createElement('meta'), {
            httpEquiv: key,
            content: value
          })
        )
      }
    })
  }

  static setupSessionRenewal() {
    // Renouvellement automatique de la session avant expiration
    const renewSession = () => {
      try {
        const session = localStorage.getItem('supabase.auth.token')
        if (session) {
          const sessionData = JSON.parse(session)
          const expiresAt = new Date(sessionData.expires_at).getTime()
          const now = Date.now()
          
          if (expiresAt - now <= securityConfig.session.renewThreshold * 1000) {
            this.renewSession()
          }
        }
      } catch (error) {
        console.error('Erreur lors du renouvellement de session:', error)
      }
    }

    // Vérification périodique
    setInterval(renewSession, 60000) // Chaque minute
  }

  static setupXSSProtection() {
    if (typeof window !== 'undefined') {
      // En développement, on laisse eval fonctionner normalement
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('Mode développement: eval() est autorisé')
        return
      }
      
      // En production, on désactive eval de manière sécurisée
      try {
        window.eval = () => {
          throw new Error('eval() is disabled for security reasons')
        }
      } catch (error) {
        console.warn('Impossible de désactiver eval:', error)
      }
      
      // Protection des données sensibles dans le localStorage
      try {
        const originalLocalStorage = window.localStorage
        Object.defineProperty(window, 'localStorage', {
          get: () => {
            return {
              getItem: (key) => {
                const value = originalLocalStorage.getItem(key)
                if (!value) return null
                
                try {
                  // On ne déchiffre que les données qui ne sont pas des tokens d'authentification
                  if (key.includes('auth.token')) {
                    return value
                  }
                  return EncryptionService.decrypt(value)
                } catch {
                  return value
                }
              },
              setItem: (key, value) => {
                try {
                  // On ne chiffre pas les tokens d'authentification
                  if (key.includes('auth.token')) {
                    originalLocalStorage.setItem(key, value)
                    return
                  }
                  originalLocalStorage.setItem(key, EncryptionService.encrypt(value))
                } catch (error) {
                  console.error('Erreur lors du chiffrement:', error)
                  originalLocalStorage.setItem(key, value)
                }
              },
              removeItem: originalLocalStorage.removeItem.bind(originalLocalStorage),
              clear: originalLocalStorage.clear.bind(originalLocalStorage),
              length: originalLocalStorage.length,
              key: originalLocalStorage.key.bind(originalLocalStorage)
            }
          }
        })
      } catch (error) {
        console.warn('Impossible de sécuriser localStorage:', error)
      }

      // Protection contre les injections XSS dans innerHTML
      try {
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')
        Object.defineProperty(Element.prototype, 'innerHTML', {
          set(value) {
            if (typeof value === 'string') {
              value = SecurityService.sanitizeInput(value)
            }
            originalInnerHTML.set.call(this, value)
          },
          get: originalInnerHTML.get
        })
      } catch (error) {
        console.warn('Impossible de sécuriser innerHTML:', error)
      }
    }
  }

  static async renewSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) throw error
      
      this.resetSessionTimeout()
      return session
    } catch (error) {
      console.error('Erreur lors du renouvellement de la session:', error)
      this.terminateSession()
    }
  }

  static resetSessionTimeout() {
    if (this.#sessionTimeout) {
      clearTimeout(this.#sessionTimeout)
    }
    
    this.#sessionTimeout = setTimeout(() => {
      this.terminateSession()
    }, securityConfig.session.maxAge * 1000)
  }

  static async terminateSession() {
    try {
      EncryptionService.clearKey()
      localStorage.clear()
      sessionStorage.clear()
      
      document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })
      
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Erreur lors de la terminaison de la session:', error)
    }
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }
} 