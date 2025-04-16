<template>
  <div class="min-h-screen bg-primary-950">
    <div class="p-4 lg:p-8 pt-20 lg:pt-8">
      <div class="max-w-7xl mx-auto">
        <header class="mb-8">
          <div class="flex items-center mb-4">
            <router-link
              to="/dashboard"
              class="mr-4 text-primary-200 hover:text-primary-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </router-link>
            <div>
              <h2 class="text-2xl lg:text-3xl font-bold text-primary-100">Fichiers</h2>
              <p class="mt-2 text-primary-300">Gérez vos fichiers et documents</p>
            </div>
          </div>
        </header>

        <!-- Upload Zone -->
        <div class="mb-8">
          <div
            class="border-2 border-dashed border-primary-700 rounded-xl p-4 lg:p-8 text-center hover:border-accent transition-colors duration-200"
            @dragover.prevent
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              multiple
              @change="handleFileSelect"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 lg:h-12 w-8 lg:w-12 mx-auto mb-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="text-primary-200 mb-2">Glissez-déposez vos fichiers ici</p>
            <p class="text-primary-400 text-sm">ou cliquez pour sélectionner</p>
          </div>
        </div>

        <!-- Debug Info -->
        <div class="mb-4 p-4 bg-primary-800 rounded-lg text-primary-200">
          <p>État du store:</p>
          <p>Loading: {{ loading }}</p>
          <p>Nombre de fichiers: {{ files.length }}</p>
          <p v-if="error">Erreur: {{ error }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-8 p-4 bg-error/20 text-error rounded-lg">
          {{ error }}
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>

        <!-- File List -->
        <div v-else class="bg-primary-900 rounded-xl shadow-soft">
          <div class="p-4 lg:p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg lg:text-xl font-semibold text-primary-100">Vos Fichiers</h3>
            </div>

            <div v-if="!files || files.length === 0" class="text-center py-12 text-primary-400">
              Aucun fichier uploadé
            </div>

            <div v-else class="space-y-4">
              <div v-for="file in files" :key="file.name" class="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-primary-800 rounded-lg hover:bg-primary-700 transition-colors duration-200">
                <div class="flex items-center mb-3 lg:mb-0">
                  <div class="p-2 bg-primary-600 rounded-lg mr-4">
                    <component :is="getFileIcon(file.mimetype)" class="h-6 w-6 text-primary-200" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-primary-100 font-medium truncate">{{ file.name }}</h4>
                    <p class="text-primary-400 text-sm">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <div class="flex justify-end space-x-3">
                  <button 
                    @click="handleDownload(file.url)"
                    class="text-primary-300 hover:text-primary-100 p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button 
                    @click="handleDelete(file.name)"
                    class="text-primary-300 hover:text-error p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFilesStore } from '@/stores/files'
import {
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const fileInput = ref(null)
const filesStore = useFilesStore()

// Utiliser storeToRefs pour conserver la réactivité
const { files, loading, error } = storeToRefs(filesStore)

console.log('Composant FilesView initialisé')

onMounted(async () => {
  console.log('FilesView monté, chargement des fichiers...')
  await filesStore.fetchFiles()
})

const triggerFileInput = () => {
  console.log('Déclenchement de la sélection de fichier')
  fileInput.value.click()
}

const handleFileSelect = async (event) => {
  console.log('Fichiers sélectionnés:', event.target.files)
  const selectedFiles = Array.from(event.target.files)
  for (const file of selectedFiles) {
    await filesStore.uploadFile(file)
  }
}

const handleDrop = async (event) => {
  console.log('Fichiers déposés:', event.dataTransfer.files)
  const droppedFiles = Array.from(event.dataTransfer.files)
  for (const file of droppedFiles) {
    await filesStore.uploadFile(file)
  }
}

const handleDelete = async (fileName) => {
  console.log('Tentative de suppression:', fileName)
  if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
    await filesStore.deleteFile(fileName)
  }
}

const handleDownload = (fileUrl) => {
  console.log('Téléchargement:', fileUrl)
  // Créer un élément <a> temporaire pour déclencher le téléchargement
  const link = document.createElement('a')
  link.href = fileUrl
  link.setAttribute('download', '') // Force le téléchargement
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getFileIcon = (type) => {
  const icons = {
    'application/pdf': DocumentIcon,
    'image/jpeg': PhotoIcon,
    'image/png': PhotoIcon,
    'video/mp4': FilmIcon,
    'audio/mpeg': MusicalNoteIcon,
    'text/javascript': CodeBracketIcon,
    'text/plain': DocumentTextIcon
  }
  return icons[type] || DocumentTextIcon
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
</script> 