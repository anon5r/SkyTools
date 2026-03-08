<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900">
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4 dark:text-white">Authenticating...</h2>
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useAuth } from '~/composables/auth'
  import { useNavigation } from '~/composables/navigation'

  const { finalizeOAuth } = useAuth()
  const navigate = useNavigation()

  onMounted(async () => {
    try {
      await finalizeOAuth()
      if (navigate.getNext()) {
        navigate.goNext()
      } else {
        navigate.goHome()
      }
    } catch (error) {
      console.error('OAuth callback error:', error)
      // Redirect to login with error
      navigate.goHome() // Or specifically to a login page if available
    }
  })
</script>
