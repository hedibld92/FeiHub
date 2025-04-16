<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Statistiques de stockage -->
    <div class="bg-primary-800 rounded-xl p-6 shadow-soft">
      <h3 class="text-xl font-semibold text-primary-100 mb-4">Stockage</h3>
      <div class="space-y-4">
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-primary-300">Espace utilisé</span>
            <span class="text-primary-200">{{ formatBytes(stats.storageStats.usedSpace) }} / {{ formatBytes(stats.storageStats.totalSpace) }}</span>
          </div>
          <div class="h-2 bg-primary-700 rounded-full">
            <div 
              class="h-full bg-accent rounded-full transition-all duration-500"
              :style="{ width: `${stats.spaceUsagePercentage}%` }"
            ></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-primary-300 text-sm">Fichiers</p>
            <p class="text-xl font-semibold text-primary-100">{{ stats.storageStats.fileCount }}</p>
          </div>
          <div>
            <p class="text-primary-300 text-sm">Activité</p>
            <p class="text-xl font-semibold text-primary-100">{{ stats.activityStats.weeklyActivity[6] }}</p>
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
            <p class="text-xl font-semibold text-primary-100">{{ stats.activityStats.weeklyActivity[6] }}</p>
          </div>
          <div class="h-16 w-32">
            <canvas ref="activityChart"></canvas>
          </div>
        </div>
        <div class="space-y-2">
          <div v-for="action in stats.activityStats.recentActions" :key="action.id" class="text-sm">
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
            <p class="text-xl font-semibold text-primary-100">{{ stats.contentStats.totalLinks }}</p>
          </div>
          <div>
            <p class="text-primary-300 text-sm">Total Notes</p>
            <p class="text-xl font-semibold text-primary-100">{{ stats.contentStats.totalNotes }}</p>
          </div>
        </div>
        <div>
          <p class="text-primary-300 text-sm mb-2">Liens les plus visités</p>
          <div class="space-y-2">
            <div v-for="link in stats.contentStats.topLinks" :key="link.id" class="text-sm">
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
import { useStatsStore } from '@/stores/stats'
import Chart from 'chart.js/auto'

const stats = useStatsStore()
const activityChart = ref(null)
let chartInstance = null

// Formater les octets en format lisible
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Formater la date
const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Initialiser le graphique d'activité
const initActivityChart = () => {
  if (!activityChart.value) return

  const ctx = activityChart.value.getContext('2d')
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      datasets: [{
        label: 'Activité',
        data: stats.activityStats.weeklyActivity,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
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
          display: false,
          beginAtZero: true
        },
        x: {
          display: false
        }
      }
    }
  })
}

// Mettre à jour le graphique quand les données changent
watch(() => stats.activityStats.weeklyActivity, initActivityChart, { deep: true })

onMounted(async () => {
  await stats.updateAllStats()
  initActivityChart()
})
</script> 