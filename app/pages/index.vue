<template>
  <div
    class="flex justify-center min-h-screen pt-20 lg:pt-0 sm:items-start lg:items-center bg-gray-100 dark:bg-slate-900">
    <div class="text-center">
      <div
        class="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400 mb-6">
        {{ appName }}
      </div>
      <div class="text-xl text-gray-700 dark:text-slate-500">
        Toybox for Bluesky.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAppConfig } from 'nuxt/app'
  const config = useAppConfig()
  const appName = config.title
</script>

<style scoped>
  /* スタイル */
</style>
