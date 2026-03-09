<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900">
    <div class="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center max-w-sm w-full">
      <div v-if="error" class="text-red-500 mb-4">
        <p class="font-bold text-lg mb-2">Login Failed</p>
        <p class="text-sm dark:text-red-400">{{ error }}</p>
        <NuxtLink to="/auth/oauth/signin" class="mt-4 inline-block text-blue-500 hover:text-blue-700 underline">Retourn to Login</NuxtLink>
      </div>
      <div v-else class="text-gray-700 dark:text-gray-300">
        <svg class="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <p class="font-bold">Completing login...</p>
        <p class="text-sm mt-2 opacity-80">Please wait while we verify your session.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#imports'
import { finalizeOAuth } from '~/composables/auth'

const error = ref('')
const router = useRouter()

onMounted(async () => {
  try {
    const success = await finalizeOAuth()
    if (success) {
      // Redirect to top page on success
      await router.push('/')
    } else {
      error.value = 'Could not retrieve a session from the OAuth callback.'
    }
  } catch (err: any) {
    console.error('OAuth finalize error:', err)
    error.value = err?.message || 'Failed to authenticate with Bluesky.'
  }
})
</script>
