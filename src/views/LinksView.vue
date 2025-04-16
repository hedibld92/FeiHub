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
              <h2 class="text-2xl lg:text-3xl font-bold text-primary-100">Liens</h2>
              <p class="mt-2 text-primary-300">Gérez vos liens et favoris</p>
            </div>
          </div>
        </header>

        <!-- Actions -->
        <div class="mb-8">
          <button
            @click="showNewLinkModal = true"
            class="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg shadow-soft transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nouveau Lien
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>

        <!-- Error Message -->
        <div v-else-if="error" class="mb-8 p-4 bg-error/20 text-error rounded-lg">
          {{ error }}
        </div>

        <!-- Links List -->
        <div v-else class="space-y-6">
          <!-- Favorite Links Section -->
          <div class="bg-primary-800 rounded-xl p-6 shadow-soft">
            <h3 class="text-xl font-semibold text-primary-100 mb-4">Liens Favoris</h3>
            <div v-if="favoriteLinks.length === 0" class="text-primary-400 py-4">
              Aucun lien favori
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="link in favoriteLinks"
                :key="link.id"
                class="flex items-center justify-between p-4 bg-primary-700 rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                <div class="flex-1 min-w-0 mr-4">
                  <a
                    :href="link.url"
                    target="_blank"
                    @click="incrementClickCount(link.id)"
                    class="text-primary-100 hover:text-accent font-medium block truncate"
                  >
                    {{ link.title }}
                  </a>
                  <p class="text-primary-400 text-sm truncate">{{ link.description }}</p>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-primary-400 text-sm">{{ link.click_count }} clics</span>
                  <button
                    @click="toggleFavorite(link.id)"
                    class="text-warning"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  <button
                    @click="editLink(link)"
                    class="text-primary-300 hover:text-primary-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteLink(link.id)"
                    class="text-primary-300 hover:text-error"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- All Links Section -->
          <div class="bg-primary-800 rounded-xl p-6 shadow-soft">
            <h3 class="text-xl font-semibold text-primary-100 mb-4">Tous les Liens</h3>
            <div v-if="links.length === 0" class="text-primary-400 py-4">
              Aucun lien
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="link in links"
                :key="link.id"
                class="flex items-center justify-between p-4 bg-primary-700 rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                <div class="flex-1 min-w-0 mr-4">
                  <a
                    :href="link.url"
                    target="_blank"
                    @click="incrementClickCount(link.id)"
                    class="text-primary-100 hover:text-accent font-medium block truncate"
                  >
                    {{ link.title }}
                  </a>
                  <p class="text-primary-400 text-sm truncate">{{ link.description }}</p>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-primary-400 text-sm">{{ link.click_count }} clics</span>
                  <button
                    @click="toggleFavorite(link.id)"
                    :class="link.is_favorite ? 'text-warning' : 'text-primary-300 hover:text-warning'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  <button
                    @click="editLink(link)"
                    class="text-primary-300 hover:text-primary-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteLink(link.id)"
                    class="text-primary-300 hover:text-error"
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

    <!-- New/Edit Link Modal -->
    <div v-if="showNewLinkModal || editingLink" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-primary-800 rounded-xl p-6 w-full max-w-lg">
        <h3 class="text-xl font-semibold text-primary-100 mb-4">
          {{ editingLink ? 'Modifier le lien' : 'Nouveau lien' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-primary-200 mb-1">Titre</label>
            <input
              id="title"
              v-model="linkForm.title"
              type="text"
              required
              class="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Titre du lien"
            />
          </div>
          <div>
            <label for="url" class="block text-sm font-medium text-primary-200 mb-1">URL</label>
            <input
              id="url"
              v-model="linkForm.url"
              type="url"
              required
              class="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-primary-200 mb-1">Description</label>
            <textarea
              id="description"
              v-model="linkForm.description"
              rows="3"
              class="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Description du lien"
            ></textarea>
          </div>
          <div class="flex items-center">
            <input
              id="isFavorite"
              v-model="linkForm.isFavorite"
              type="checkbox"
              class="h-4 w-4 text-accent focus:ring-accent border-primary-400 rounded"
            />
            <label for="isFavorite" class="ml-2 block text-sm text-primary-200">
              Marquer comme favori
            </label>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-primary-300 hover:text-primary-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg"
              :disabled="loading"
            >
              {{ editingLink ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLinksStore } from '@/stores/links'

const linksStore = useLinksStore()
const { links, loading, error } = storeToRefs(linksStore)

const showNewLinkModal = ref(false)
const editingLink = ref(null)
const linkForm = ref({
  title: '',
  url: '',
  description: '',
  isFavorite: false
})

const favoriteLinks = computed(() => {
  return links.value.filter(link => link.is_favorite)
})

onMounted(async () => {
  await linksStore.fetchLinks()
})

const closeModal = () => {
  showNewLinkModal.value = false
  editingLink.value = null
  linkForm.value = {
    title: '',
    url: '',
    description: '',
    isFavorite: false
  }
}

const handleSubmit = async () => {
  if (editingLink.value) {
    await linksStore.updateLink(editingLink.value.id, {
      title: linkForm.value.title,
      url: linkForm.value.url,
      description: linkForm.value.description,
      isFavorite: linkForm.value.isFavorite
    })
  } else {
    await linksStore.addLink({
      title: linkForm.value.title,
      url: linkForm.value.url,
      description: linkForm.value.description,
      isFavorite: linkForm.value.isFavorite
    })
  }
  closeModal()
}

const editLink = (link) => {
  editingLink.value = link
  linkForm.value = {
    title: link.title,
    url: link.url,
    description: link.description,
    isFavorite: link.is_favorite
  }
}

const toggleFavorite = async (id) => {
  await linksStore.toggleFavorite(id)
}

const deleteLink = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce lien ?')) {
    await linksStore.deleteLink(id)
  }
}

const incrementClickCount = async (id) => {
  await linksStore.incrementClickCount(id)
}
</script> 