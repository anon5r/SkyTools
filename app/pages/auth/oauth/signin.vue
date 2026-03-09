<template>
  <div
    class="flex justify-center items-start lg:items-center pt-9 lg:pt-0 min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200">
    <div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign In with OAuth</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-6">
          <label
            for="handle"
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Bluesky Handle
          </label>
          <input
            id="handle"
            v-model="handle"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            placeholder="alice.bsky.social"
            required>
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors">
            {{ loading ? 'Connecting...' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/auth'

const handle = ref('')
const loading = ref(false)
const { login } = useAuth()

const submitForm = async () => {
  if (!handle.value) return
  loading.value = true
  try {
    // ログイン機能呼び出し: auth.ts 側で login_hint 付きで signIn が呼ばれる
    await login({ identifier: handle.value })
  } catch (error) {
    console.error('Failed to sign in via OAuth', error)
  } finally {
    loading.value = false
  }
}
</script>
