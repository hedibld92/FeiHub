import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useFilesStore } from './files'
import { useLinksStore } from './links'
import { useNotesStore } from './notes'

export const useStatsStore = defineStore('stats', () => {
  const storageStats = ref({
    totalSpace: 5 * 1024 * 1024 * 1024, // 5GB par défaut
    usedSpace: 0,
    fileCount: 0
  })

  const activityStats = ref({
    weeklyActivity: Array(7).fill(0),
    recentActions: []
  })

  const contentStats = ref({
    totalLinks: 0,
    totalNotes: 0,
    topLinks: [],
    favoriteNotes: []
  })

  const loading = ref(false)
  const error = ref(null)

  // Calcul du pourcentage d'espace utilisé
  const spaceUsagePercentage = computed(() => {
    return Math.min((storageStats.value.usedSpace / storageStats.value.totalSpace) * 100, 100)
  })

  // Mise à jour des statistiques de stockage
  async function updateStorageStats() {
    try {
      const filesStore = useFilesStore()
      const files = filesStore.files || []
      
      let totalSize = 0
      if (Array.isArray(files)) {
        files.forEach(file => {
          if (file && typeof file.size === 'number') {
            totalSize += file.size
          }
        })
      }

      storageStats.value = {
        ...storageStats.value,
        usedSpace: totalSize,
        fileCount: files.length
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour des statistiques de stockage:", err)
      error.value = "Erreur lors de la mise à jour des statistiques de stockage"
    }
  }

  // Mise à jour des statistiques d'activité
  async function updateActivityStats() {
    try {
      const now = new Date()
      const today = now.getDay()
      const weeklyActivity = Array(7).fill(0)
      
      // Simuler une activité croissante pour la semaine
      for (let i = 0; i < 7; i++) {
        weeklyActivity[i] = Math.floor(Math.random() * 20) + (i === today ? 10 : 0)
      }
      
      const recentActions = []
      const filesStore = useFilesStore()
      const notesStore = useNotesStore()
      const linksStore = useLinksStore()

      if (filesStore.files?.length > 0) {
        recentActions.push({
          id: 'file-' + Date.now(),
          type: 'file',
          description: `${filesStore.files[0].name} ajouté`,
          timestamp: new Date()
        })
      }

      if (notesStore.notes?.length > 0) {
        recentActions.push({
          id: 'note-' + Date.now(),
          type: 'note',
          description: `Note "${notesStore.notes[0].title}" créée`,
          timestamp: new Date(Date.now() - 3600000)
        })
      }

      if (linksStore.links?.length > 0) {
        recentActions.push({
          id: 'link-' + Date.now(),
          type: 'link',
          description: `Lien "${linksStore.links[0].title}" ajouté`,
          timestamp: new Date(Date.now() - 7200000)
        })
      }

      activityStats.value = {
        weeklyActivity,
        recentActions
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour des statistiques d'activité:", err)
      error.value = "Erreur lors de la mise à jour des statistiques d'activité"
    }
  }

  // Mise à jour des statistiques de contenu
  async function updateContentStats() {
    try {
      const linksStore = useLinksStore()
      const notesStore = useNotesStore()

      const links = linksStore.links || []
      const notes = notesStore.notes || []

      // Tri des liens par nombre de clics
      const sortedLinks = [...links]
        .filter(link => link && typeof link.click_count === 'number')
        .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))

      // Filtrer les notes épinglées
      const pinnedNotes = notes
        .filter(note => note && note.is_pinned)
        .slice(0, 5)

      contentStats.value = {
        totalLinks: links.length,
        totalNotes: notes.length,
        topLinks: sortedLinks.slice(0, 5),
        favoriteNotes: pinnedNotes
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour des statistiques de contenu:", err)
      error.value = "Erreur lors de la mise à jour des statistiques de contenu"
    }
  }

  // Mise à jour de toutes les statistiques
  async function updateAllStats() {
    loading.value = true
    error.value = null

    try {
      await Promise.all([
        updateStorageStats(),
        updateActivityStats(),
        updateContentStats()
      ])
    } catch (err) {
      error.value = "Erreur lors de la mise à jour des statistiques"
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    storageStats,
    activityStats,
    contentStats,
    loading,
    error,
    spaceUsagePercentage,
    updateStorageStats,
    updateActivityStats,
    updateContentStats,
    updateAllStats
  }
}) 