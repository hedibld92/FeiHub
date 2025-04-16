import { securityConfig } from '../config/security'
import CryptoJS from 'crypto-js'

export class EncryptionService {
  static #key = null

  static async initialize() {
    // Génération d'une clé unique pour la session
    this.#key = CryptoJS.lib.WordArray.random(securityConfig.encryption.keyLength / 8).toString()
  }

  static encrypt(data) {
    if (!this.#key) throw new Error('Encryption service not initialized')
    
    try {
      // Chiffrement des données avec AES
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.#key, {
        mode: CryptoJS.mode.GCM,
        padding: CryptoJS.pad.Pkcs7,
        salt: CryptoJS.lib.WordArray.random(securityConfig.encryption.saltLength)
      })

      return encrypted.toString()
    } catch (error) {
      console.error('Erreur de chiffrement:', error)
      throw new Error('Échec du chiffrement')
    }
  }

  static decrypt(encryptedData) {
    if (!this.#key) throw new Error('Encryption service not initialized')
    
    try {
      // Déchiffrement des données
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.#key, {
        mode: CryptoJS.mode.GCM,
        padding: CryptoJS.pad.Pkcs7
      })

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
    } catch (error) {
      console.error('Erreur de déchiffrement:', error)
      throw new Error('Échec du déchiffrement')
    }
  }

  static clearKey() {
    // Effacement sécurisé de la clé
    this.#key = null
  }
} 