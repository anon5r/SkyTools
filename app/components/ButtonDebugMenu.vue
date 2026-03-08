<template>
  <button
    class="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg"
    @click="toggleMenu">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  </button>
  <div
    v-if="isOpen"
    class="fixed bottom-16 right-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-4 w-64">
    <h3 class="text-lg font-bold mb-2">Debug Menu</h3>
    <div class="space-y-2">
      <button
        class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
        @click="clearLocalStorage">
        Clear Local Storage
      </button>
      <button
        class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
        @click="reloadPage">
        Reload Page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const isOpen = ref(false)

  const toggleMenu = () => {
    isOpen.value = !isOpen.value
  }

  const clearLocalStorage = () => {
    localStorage.clear()
    alert('Local storage cleared.')
    toggleMenu()
  }

  const reloadPage = () => {
    window.location.reload()
  }
</script>
