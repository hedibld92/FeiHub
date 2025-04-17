<template>
  <div class="min-h-screen bg-primary-950">
    <!-- Mobile Header -->
    <header class="lg:hidden bg-primary-900 border-b border-primary-800 fixed top-0 left-0 right-0 z-50">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center">
          <router-link
            v-if="$route.path !== '/dashboard'"
            to="/dashboard"
            class="mr-3 text-primary-200 hover:text-primary-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <h1 class="text-xl font-bold text-primary-100">Fei.Hub</h1>
        </div>
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="text-primary-200 hover:text-primary-100 bg-primary-800 p-2 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- Mobile Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden fixed inset-0 z-40"
    >
      <!-- Overlay sombre -->
      <div class="absolute inset-0 bg-primary-950 opacity-95"></div>
      
      <!-- Contenu du menu -->
      <div class="relative z-50 pt-20 bg-primary-900 min-h-screen">
        <nav class="p-4">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-3 text-primary-200 bg-primary-800/80 hover:bg-primary-700 hover:text-primary-100 transition-colors duration-200 rounded-lg mb-2"
            :class="{ 'bg-primary-700 text-primary-100': $route.path === item.path }"
            @click="isMobileMenuOpen = false"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-3 mt-4 text-primary-200 bg-primary-800/80 hover:bg-primary-700 hover:text-primary-100 transition-colors duration-200 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </nav>
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:fixed lg:flex lg:flex-col lg:top-0 lg:left-0 lg:h-full lg:w-64 bg-primary-900 border-r border-primary-800">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-primary-100">Fei.Hub</h1>
      </div>
      <nav class="flex-1 mt-6">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-6 py-3 text-primary-200 hover:bg-primary-800 hover:text-primary-100 transition-colors duration-200"
          :class="{ 'bg-primary-800 text-primary-100': $route.path === item.path }"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>
      <div class="p-6">
        <button
          @click="handleLogout"
          class="flex items-center w-full px-4 py-2 text-primary-200 hover:text-primary-100 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <header class="mb-8">
          <h2 class="text-2xl lg:text-3xl font-bold text-primary-100">Dashboard</h2>
          <p class="mt-2 text-primary-300">{{ getCurrentDate() }}</p>
        </header>

        <!-- Vue d'ensemble des statistiques -->
        <StatsOverview class="mb-8" />

        <!-- Quick Actions -->
        <div class="mb-8">
          <button
            @click="showNewItemModal = true"
            class="w-full lg:w-auto px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg shadow-soft transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nouveau
          </button>
        </div>

        <!-- Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <!-- Section Files -->
          <div class="bg-primary-800 rounded-xl p-4 lg:p-6 shadow-soft">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg lg:text-xl font-semibold text-primary-100">Documents Récents</h3>
              <span class="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm bg-success/20 text-success">
                actif
              </span>
            </div>
            <div v-if="filesLoading" class="py-4 text-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
            </div>
            <div v-else-if="recentFiles.length === 0" class="text-primary-400 py-4 text-center">
              Aucun fichier récent
            </div>
            <div v-else class="space-y-3">
              <div v-for="file in recentFiles" :key="file.name" class="flex items-center justify-between">
                <div class="flex items-center min-w-0">
                  <component :is="getFileIcon(file.mimetype)" class="h-5 w-5 text-primary-300 mr-2 flex-shrink-0" />
                  <span class="text-primary-200 truncate">{{ file.name }}</span>
                </div>
                <span class="text-primary-400 text-sm ml-2 flex-shrink-0">{{ formatFileSize(file.size) }}</span>
              </div>
            </div>
            <div class="mt-4 text-right">
              <router-link to="/files" class="text-accent hover:text-accent-light transition-colors duration-200">
                Voir plus
              </router-link>
            </div>
          </div>

          <!-- Section Notes -->
          <div class="bg-primary-800 rounded-xl p-4 lg:p-6 shadow-soft">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg lg:text-xl font-semibold text-primary-100">Notes Importantes</h3>
              <span class="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm bg-warning/20 text-warning">
                en cours
              </span>
            </div>
            <div v-if="notesLoading" class="py-4 text-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
            </div>
            <div v-else-if="pinnedNotes.length === 0" class="text-primary-400 py-4 text-center">
              Aucune note épinglée
            </div>
            <div v-else class="space-y-3">
              <div v-for="note in pinnedNotes" :key="note.id" class="group">
                <h4 class="text-primary-200 font-medium truncate">{{ note.title }}</h4>
                <p class="text-primary-400 text-sm line-clamp-2">{{ note.content }}</p>
              </div>
            </div>
            <div class="mt-4 text-right">
              <router-link to="/notes" class="text-accent hover:text-accent-light transition-colors duration-200">
                Voir plus
              </router-link>
            </div>
          </div>

          <!-- Section Links -->
          <div class="bg-primary-800 rounded-xl p-4 lg:p-6 shadow-soft">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg lg:text-xl font-semibold text-primary-100">Liens Favoris</h3>
              <span class="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm bg-accent/20 text-accent">
                nouveau
              </span>
            </div>
            <div v-if="linksLoading" class="py-4 text-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
            </div>
            <div v-else-if="favoriteLinks.length === 0" class="text-primary-400 py-4 text-center">
              Aucun lien favori
            </div>
            <div v-else class="space-y-3">
              <div v-for="link in favoriteLinks" :key="link.id" class="group">
                <a :href="link.url" target="_blank" class="text-primary-200 hover:text-accent transition-colors duration-200 block truncate">
                  {{ link.title }}
                </a>
                <p class="text-primary-400 text-sm truncate">{{ link.description }}</p>
              </div>
            </div>
            <div class="mt-4 text-right">
              <router-link to="/links" class="text-accent hover:text-accent-light transition-colors duration-200">
                Voir plus
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New Item Modal -->
    <div v-if="showNewItemModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-primary-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-primary-100 mb-4">Créer un nouvel élément</h3>
        <div class="space-y-4">
          <button
            @click="() => { showNewItemModal = false; $router.push('/files') }"
            class="w-full p-4 bg-primary-700 hover:bg-primary-600 rounded-lg text-left text-primary-100"
          >
            <div class="flex items-center">
              <component :is="menuItems[1].icon" class="w-5 h-5 mr-3" />
              Nouveau fichier
            </div>
          </button>
          <button
            @click="() => { showNewItemModal = false; $router.push('/notes') }"
            class="w-full p-4 bg-primary-700 hover:bg-primary-600 rounded-lg text-left text-primary-100"
          >
            <div class="flex items-center">
              <component :is="menuItems[2].icon" class="w-5 h-5 mr-3" />
              Nouvelle note
            </div>
          </button>
          <button
            @click="() => { showNewItemModal = false; $router.push('/links') }"
            class="w-full p-4 bg-primary-700 hover:bg-primary-600 rounded-lg text-left text-primary-100"
          >
            <div class="flex items-center">
              <component :is="menuItems[3].icon" class="w-5 h-5 mr-3" />
              Nouveau lien
            </div>
          </button>
        </div>
        <div class="mt-6 text-right">
          <button
            @click="showNewItemModal = false"
            class="px-4 py-2 text-primary-300 hover:text-primary-100"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFilesStore } from '@/stores/files'
import { useNotesStore } from '@/stores/notes'
import { useLinksStore } from '@/stores/links'
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
  LinkIcon,
  ViewColumnsIcon
} from '@heroicons/vue/24/outline'
import StatsOverview from '@/components/StatsOverview.vue'

const router = useRouter()
const authStore = useAuthStore()
const filesStore = useFilesStore()
const notesStore = useNotesStore()
const linksStore = useLinksStore()

const showNewItemModal = ref(false)
const isMobileMenuOpen = ref(false)

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Fichiers', path: '/files', icon: FolderIcon },
  { name: 'Notes', path: '/notes', icon: DocumentTextIcon },
  { name: 'Liens', path: '/links', icon: LinkIcon },
  { name: 'Kanban', path: '/kanban', icon: ViewColumnsIcon },
]

// Files
const recentFiles = computed(() => filesStore.files.slice(0, 3))
const filesLoading = computed(() => filesStore.loading)

// Notes
const pinnedNotes = computed(() => notesStore.getPinnedNotes().slice(0, 3))
const notesLoading = computed(() => notesStore.loading)

// Links
const favoriteLinks = computed(() => linksStore.getFavoriteLinks().slice(0, 3))
const linksLoading = computed(() => linksStore.loading)

onMounted(async () => {
  await Promise.all([
    filesStore.fetchFiles(),
    notesStore.fetchNotes(),
    linksStore.fetchLinks()
  ])
})

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/')
}

const getCurrentDate = () => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date())
}

const getFileIcon = (type) => {
  const icons = {
    'application/pdf': DocumentTextIcon,
    'image/jpeg': FolderIcon,
    'image/png': FolderIcon,
    'video/mp4': FolderIcon,
    'audio/mpeg': FolderIcon,
    'text/javascript': DocumentTextIcon,
    'text/plain': DocumentTextIcon
  }
  return icons[type] || FolderIcon
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
</script> 