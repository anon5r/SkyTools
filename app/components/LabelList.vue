<template>
  <div class="flex flex-wrap gap-2 mt-2 w-full">
    <!-- Existing labels -->
    <div
      v-for="(label, index) in labels"
      :key="index"
      class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
      {{ label }}
      <button
        v-if="inEdit"
        class="ml-2 text-blue-500 hover:text-red-500 focus:outline-none"
        title="Remove"
        @click.prevent="removeLabel(index)">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Add label input (only when editing) -->
    <div v-if="inEdit" class="flex items-center gap-1">
      <input
        v-model="newLabel"
        type="text"
        list="defined-labels-list"
        placeholder="Add new label..."
        class="px-3 py-1 w-40 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        @keyup.enter.prevent="addLabel" >
      <datalist id="defined-labels-list">
        <option v-for="dl in definedLabels" :key="dl" :value="dl" />
      </datalist>

      <button
        class="p-1 px-2 text-white bg-green-500 hover:bg-green-600 rounded-md shadow-sm transition-colors text-sm font-medium"
        title="Add"
        @click.prevent="addLabel">
        Add
      </button>
    </div>

    <div
      v-if="labels.length === 0 && !inEdit"
      class="text-gray-500 dark:text-gray-400 text-sm italic py-1">
      No labels set.
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useState } from '#imports'

  const props = defineProps({
    labels: {
      type: Array as () => string[],
      required: true,
    },
    inEdit: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits<{
    'add-label': [label: string]
    'remove-label': [index: number]
  }>()

  // Access system-defined labels fetched in profile.vue
  const definedLabels = useState<string[]>('defined-labels', () => [])
  const newLabel = ref('')

  const removeLabel = (index: number) => {
    emit('remove-label', index)
  }

  const addLabel = () => {
    const val = newLabel.value.trim()
    if (val && !props.labels.includes(val)) {
      emit('add-label', val)
    }
    newLabel.value = ''
  }
</script>
