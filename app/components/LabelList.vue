<template>
  <ul class="space-y-2">
    <li
      v-for="label in labels"
      :key="label.id"
      class="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-md shadow-sm">
      <span class="text-gray-700 dark:text-slate-200">{{ label.name }}</span>
      <button
        class="text-red-500 hover:text-red-700 focus:outline-none"
        @click="removeLabel(label.id)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
  const props = defineProps<{
    labels: { id: string; name: string }[]
  }>()

  const emit = defineEmits<{
    (e: 'remove', id: string): void
  }>()

  const removeLabel = (id: string) => {
    emit('remove', id)
  }
</script>
