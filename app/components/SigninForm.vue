<template>
  <form @submit.prevent="submitForm">
    <div class="mb-4">
      <label
        for="identifier"
        class="block text-gray-700 text-sm font-bold mb-2">
        Identifier
      </label>
      <input
        id="identifier"
        v-model="identifier"
        type="text"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter identifier" >
    </div>
    <div class="mb-6">
      <label for="password" class="block text-gray-700 text-sm font-bold mb-2">
        Password
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter password" >
    </div>
    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Sign In
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const identifier = ref('')
  const password = ref('')

  const emit = defineEmits(['submit'])

  const submitForm = () => {
    emit('submit', { identifier: identifier.value, password: password.value })
  }
</script>
