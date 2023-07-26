<template>
  <div>
    <button
      id="theme-toggle"
      @click="toggleMode"
      type="button"
      class="text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-slate-700 rounded-lg text-sm p-1">
      <span :class="{ hidden: isDarkTheme }">
        <svg
          id="theme-toggle-dark-icon"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      </span>
      <span :class="{ hidden: !isDarkTheme }">
        <svg
          id="theme-toggle-light-icon"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            fill-rule="evenodd"
            clip-rule="evenodd"></path>
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, defineComponent } from 'vue'
  import { isDev } from '@/utils/helpers'
  import type { Ref } from 'vue'

  defineComponent({ name: 'ToggleDarkmode' })

  const isDarkTheme = ref<Boolean>(false)

  const toggleCount: Ref<number> = ref<number>(0)
  const clickTimestamp: Ref<number> = ref<number>(0)

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('color-theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    isDarkTheme.value = savedTheme ? savedTheme === 'dark' : prefersDark
    if (isDarkTheme.value) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  onMounted(loadTheme)

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    if (isDarkTheme.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('color-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('color-theme', 'light')
    }
  }


  const toggleMode = (e: Event) => {
    if (Date.now() - clickTimestamp.value < 300) {
      toggleCount.value++
      if (toggleCount.value <= 5)
        toggleTheme()
      if (toggleCount.value == 15) {
        toggleCount.value = 0
        if (!sessionStorage.getItem('showBlocks') || sessionStorage.getItem('showBlocks') === 'false') {
          alert('Found the Easter egg!')
          sessionStorage.setItem('showBlocks', 'true')
        } else {
          alert('Lost an egg...')
          sessionStorage.setItem('showBlocks', 'false')
        }
      }
    } else {
      toggleCount.value = 0
      toggleTheme()
    }
    clickTimestamp.value = Date.now()
  }
</script>

<style scoped>
  .hidden {
    display: none;
  }
</style>
