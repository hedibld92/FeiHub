<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Statistiques de stockage -->
    <div class="bg-primary-800 rounded-xl p-6 shadow-soft">
      <h3 class="text-xl font-semibold text-primary-100 mb-4">Stockage</h3>
      <div class="space-y-4">
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-primary-300">Espace utilisé</span>
            <span class="text-primary-200">{{ formatFileSize(storageStats.used) }} / {{ formatFileSize(storageStats.total) }}</span>
          </div>
          <div class="h-2 bg-primary-700 rounded-full">
            <div 
              class="h-full bg-accent rounded-full transition-all duration-500"
              :style="{ width: `${(storageStats.used / storageStats.total) * 100}%` }"
            ></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-primary-300 text-sm">Fichiers</p>
            <p class="text-xl font-semibold text-primary-100">{{ storageStats.filesCount }}</p>
          </div>
          <div>
            <p class="text-primary-300 text-sm">Types</p>
            <p class="text-xl font-semibold text-primary-100">{{ storageStats.fileTypes.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Activité récente -->
    <div class="bg-primary-800 rounded-xl p-6 shadow-soft">
      <h3 class="text-xl font-semibold text-primary-100 mb-4">Activité</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-300 text-sm">Actions aujourd'hui</p>
            <p class="text-xl font-semibold text-primary-100">{{ activityStats.todayActions }}</p>
          </div>
          <div class="h-16 w-32">
            <canvas ref="activityChart"></canvas>
          </div>
        </div>
        <div class="space-y-2">
          <div v-for="(action, index) in recentActivity" :key="index" class="text-sm">
            <p class="text-primary-200">{{ action.description }}</p>
            <p class="text-primary-400">{{ formatDate(action.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Liens et Notes -->
    <div class="bg-primary-800 rounded-xl p-6 shadow-soft">
      <h3 class="text-xl font-semibold text-primary-100 mb-4">Liens & Notes</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-primary-300 text-sm">Total Liens</p>
            <p class="text-xl font-semibold text-primary-100">{{ contentStats.totalLinks }}</p>
          </div>
          <div>
            <p class="text-primary-300 text-sm">Total Notes</p>
            <p class="text-xl font-semibold text-primary-100">{{ contentStats.totalNotes }}</p>
          </div>
        </div>
        <div>
          <p class="text-primary-300 text-sm mb-2">Liens les plus visités</p>
          <div class="space-y-2">
            <div v-for="link in contentStats.topLinks" :key="link.id" class="text-sm">
              <p class="text-primary-200 truncate">{{ link.title }}</p>
              <p class="text-primary-400">{{ link.click_count }} visites</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFilesStore } from '@/stores/files'
import { useNotesStore } from '@/stores/notes'
import { useLinksStore } from '@/stores/links'
import Chart from 'chart.js/auto'

const filesStore = useFilesStore()
const notesStore = useNotesStore()
const linksStore = useLinksStore()

const { files } = storeToRefs(filesStore)
const { notes } = storeToRefs(notesStore)
const { links } = storeToRefs(linksStore)

const activityChart = ref(null)
let chart = null

// Statistiques de stockage
const storageStats = ref({
  used: 0,
  total: 1000000000, // 1GB par défaut
  filesCount: 0,
  fileTypes: []
})

// Statistiques d'activité
const activityStats = ref({
  todayActions: 0,
  weeklyActions: []
})

// Statistiques de contenu
const contentStats = ref({
  totalLinks: 0,
  totalNotes: 0,
  topLinks: []
})

// Activité récente
const recentActivity = ref([])

// Mise à jour des statistiques
const updateStats = () => {
  // Calcul des statistiques de stockage
  storageStats.value.filesCount = files.value.length
  storageStats.value.used = files.value.reduce((acc, file) => acc + file.size, 0)
  storageStats.value.fileTypes = [...new Set(files.value.map(file => file.mimetype))]

  // Calcul des statistiques de contenu
  contentStats.value.totalLinks = links.value.length
  contentStats.value.totalNotes = notes.value.length
  contentStats.value.topLinks = [...links.value]
    .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
    .slice(0, 3)

  // Mise à jour du graphique
  updateChart()
}

// Création du graphique d'activité
const createChart = () => {
  if (!activityChart.value) return

  const ctx = activityChart.value.getContext('2d')
  const data = {
    labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    datasets: [{
      label: 'Activité',
      data: activityStats.value.weeklyActions,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          display: false
        },
        x: {
          display: false
        }
      }
    }
  })
}

const updateChart = () => {
  if (chart) {
    chart.data.datasets[0].data = activityStats.value.weeklyActions
    chart.update()
  }
}

// Formatage des dates
const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Formatage de la taille des fichiers
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Surveillance des changements dans les stores
watch([files, notes, links], () => {
  updateStats()
})

onMounted(() => {
  // Génération de données d'exemple pour l'activité hebdomadaire
  activityStats.value.weeklyActions = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10))
  activityStats.value.todayActions = activityStats.value.weeklyActions[6]

  createChart()
  updateStats()
})
</script> 