import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from './auth'

export const useFilesStore = defineStore('files', () => {
  const files = ref([])
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  const checkAuth = () => {
    if (!authStore.user) {
      throw new Error('Vous devez être connecté pour accéder aux fichiers.')
    }
  }

  const fetchFiles = async () => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      console.log('Début de fetchFiles')
      const { data: fileObjects, error: storageError } = await supabase
        .storage
        .from('files')
        .list('', { // Ajout des options de listage
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        })

      console.log('Résultat de list:', { fileObjects, storageError })

      if (storageError) throw storageError

      if (!fileObjects || fileObjects.length === 0) {
        console.log('Aucun fichier trouvé')
        files.value = []
        return
      }

      console.log('Fichiers trouvés:', fileObjects)

      // Récupérer les URLs publiques pour chaque fichier
      const filesWithUrls = await Promise.all(fileObjects.map(async (file) => {
        console.log('Traitement du fichier:', file)
        
        const { data } = supabase
          .storage
          .from('files')
          .getPublicUrl(file.name)

        console.log('URL publique obtenue:', data)

        const fileData = {
          name: file.name,
          size: file.metadata?.size || 0,
          mimetype: file.metadata?.mimetype || 'application/octet-stream',
          created_at: file.created_at,
          last_modified: file.metadata?.lastModified,
          url: data.publicUrl
        }

        console.log('Données du fichier formatées:', fileData)
        return fileData
      }))

      // Trier les fichiers par date de création (plus récent en premier)
      files.value = filesWithUrls.sort((a, b) => 
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
      )

      console.log('Liste finale des fichiers:', files.value)
    } catch (e) {
      console.error('Erreur détaillée lors de la récupération des fichiers:', e)
      error.value = e.message || "Impossible de charger les fichiers."
    } finally {
      loading.value = false
    }
  }

  const uploadFile = async (file) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      console.log('Début de l\'upload du fichier:', file.name)

      // Générer un nom de fichier unique pour éviter les conflits
      const timestamp = Date.now()
      const uniqueFileName = `${timestamp}-${file.name}`

      console.log('Nom de fichier unique généré:', uniqueFileName)

      const { error: uploadError, data } = await supabase
        .storage
        .from('files')
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      console.log('Résultat de l\'upload:', { data, uploadError })

      if (uploadError) throw uploadError

      console.log('Fichier uploadé avec succès:', data)
      await fetchFiles()
    } catch (e) {
      console.error('Erreur détaillée lors de l\'upload:', e)
      error.value = e.message || "Impossible d'uploader le fichier."
    } finally {
      loading.value = false
    }
  }

  const deleteFile = async (fileName) => {
    try {
      loading.value = true
      error.value = null
      checkAuth()

      console.log('Tentative de suppression du fichier:', fileName)

      const { error: deleteError } = await supabase
        .storage
        .from('files')
        .remove([fileName])

      console.log('Résultat de la suppression:', { deleteError })

      if (deleteError) throw deleteError

      // Mettre à jour la liste des fichiers après la suppression
      files.value = files.value.filter(file => file.name !== fileName)
      await fetchFiles()
    } catch (e) {
      console.error('Erreur détaillée lors de la suppression:', e)
      error.value = e.message || "Impossible de supprimer le fichier."
    } finally {
      loading.value = false
    }
  }

  return {
    files,
    loading,
    error,
    fetchFiles,
    uploadFile,
    deleteFile
  }
}) 