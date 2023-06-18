<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="text-center">
      <div
        class="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400 mb-6">
        {{ appName }}
      </div>
      <div class="text-xl text-gray-700">Toybox for Bluesky.</div>
    </div>
  </div>
</template>

<script setup type="ts">
  import { useAppConfig } from 'nuxt/app';
  const config = useAppConfig()
  console.dir(config)
  const appName = config.title
</script>

<style scoped>
  /* スタイル */
</style>
