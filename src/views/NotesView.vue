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
              <h2 class="text-2xl lg:text-3xl font-bold text-primary-100">Notes</h2>
              <p class="mt-2 text-primary-300">Gérez vos notes et idées</p>
            </div>
          </div>
        </header>

        <!-- Actions -->
        <div class="mb-8">
          <button
            @click="showNewNoteModal = true"
            class="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg shadow-soft transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle Note
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

        <!-- Notes Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="notes.length === 0" class="col-span-full text-center py-12 text-primary-400">
            Aucune note créée
          </div>

          <div
            v-for="note in notes"
            :key="note.id"
            class="bg-primary-800 rounded-xl p-6 shadow-soft group relative"
            :class="{ 'border-2 border-warning': note.is_pinned }"
          >
            <!-- Note Header -->
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-xl font-semibold text-primary-100">{{ note.title }}</h3>
              <div class="flex space-x-2">
                <button
                  @click="togglePin(note.id)"
                  class="text-primary-300 hover:text-warning transition-colors duration-200"
                  :class="{ 'text-warning': note.is_pinned }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <button
                  @click="editNote(note)"
                  class="text-primary-300 hover:text-primary-100 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deleteNote(note.id)"
                  class="text-primary-300 hover:text-error transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Note Content -->
            <p class="text-primary-300 whitespace-pre-wrap">{{ note.content }}</p>

            <!-- Note Footer -->
            <div class="mt-4 text-sm text-primary-400">
              Modifié le {{ formatDate(note.updated_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New/Edit Note Modal -->
    <div v-if="showNewNoteModal || editingNote" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-primary-800 rounded-xl p-6 w-full max-w-lg">
        <h3 class="text-xl font-semibold text-primary-100 mb-4">
          {{ editingNote ? 'Modifier la note' : 'Nouvelle note' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-primary-200 mb-1">Titre</label>
            <input
              id="title"
              v-model="noteForm.title"
              type="text"
              required
              class="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Titre de la note"
            />
          </div>
          <div>
            <label for="content" class="block text-sm font-medium text-primary-200 mb-1">Contenu</label>
            <textarea
              id="content"
              v-model="noteForm.content"
              rows="6"
              class="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Contenu de la note"
            ></textarea>
          </div>
          <div class="flex items-center">
            <input
              id="isPinned"
              v-model="noteForm.isPinned"
              type="checkbox"
              class="h-4 w-4 text-accent focus:ring-accent border-primary-400 rounded"
            />
            <label for="isPinned" class="ml-2 block text-sm text-primary-200">
              Épingler cette note
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
              {{ editingNote ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotesStore } from '@/stores/notes'

const notesStore = useNotesStore()
const { notes, loading, error } = storeToRefs(notesStore)

const showNewNoteModal = ref(false)
const editingNote = ref(null)
const noteForm = ref({
  title: '',
  content: '',
  isPinned: false
})

onMounted(async () => {
  await notesStore.fetchNotes()
})

const closeModal = () => {
  showNewNoteModal.value = false
  editingNote.value = null
  noteForm.value = {
    title: '',
    content: '',
    isPinned: false
  }
}

const handleSubmit = async () => {
  if (editingNote.value) {
    await notesStore.updateNote(editingNote.value.id, {
      title: noteForm.value.title,
      content: noteForm.value.content,
      isPinned: noteForm.value.isPinned
    })
  } else {
    await notesStore.addNote({
      title: noteForm.value.title,
      content: noteForm.value.content,
      isPinned: noteForm.value.isPinned
    })
  }
  closeModal()
}

const editNote = (note) => {
  editingNote.value = note
  noteForm.value = {
    title: note.title,
    content: note.content,
    isPinned: note.is_pinned
  }
}

const togglePin = async (id) => {
  await notesStore.togglePin(id)
}

const deleteNote = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
    await notesStore.deleteNote(id)
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date(date))
}
</script> 