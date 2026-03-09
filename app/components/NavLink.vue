<template>
  <NuxtLink
    :to="to"
    class="block px-4 py-2 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
  defineProps({
    to: {
      type: String,
      required: true,
    },
  })
</script>
