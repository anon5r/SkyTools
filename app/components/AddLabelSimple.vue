<template>
  <form @submit.prevent="submitForm">
    <div class="mb-4">
      <label for="label" class="block text-gray-700 text-sm font-bold mb-2">
        Label
      </label>
      <input
        id="label"
        v-model="label"
        type="text"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter label" >
    </div>
    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Add Label
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps({
    initialLabel: {
      type: String,
      default: '',
    },
  })

  const label = ref(props.initialLabel)

  const emit = defineEmits(['submit'])

  const submitForm = () => {
    emit('submit', label.value)
  }
</script>
