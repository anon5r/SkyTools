<template>
  <div
    class="flex justify-center items-start lg:items-center pt-9 lg:pt-0 min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200">
    <div v-if="isRedirected" class="w-full max-w-md">
      <div
        class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
        role="alert">
        <svg
          aria-hidden="true"
          class="flex-shrink-0 inline w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"></path>
        </svg>
        <span class="sr-only">Info</span>
        This feature requires logged in to Bluesky.
      </div>
    </div>
    <div class="w-full max-w-md">
      <SigninForm @submit="signin" :service="pds" />
    </div>
  </div>
</template>

<script setup type="ts">
  import { useRoute } from '#imports'

  const route = useRoute()

  const pds = route.params.service
</script>
