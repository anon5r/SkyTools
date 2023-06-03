<template>
    <div class="w-full max-w-xs mx-auto">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h4 class="text-2xl font-bold dark:text-white">Bluesky login</h4>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="handle">
            Your handle
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="handle"
            v-model="handle"
            type="text"
            placeholder="jack.bsky.social"
            @focusout="validateHandle"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            App Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            v-model="password"
            type="password"
            placeholder="xxxx-xxxx-xxxx-xxxx"
            @input="validatePassword"
          />
          <p class="text-red-500 text-xs italic" v-show="validateError">{{ validateError }}</p>
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="submitForm"
          >
            Login
          </button>
          <p class="text-red-500 text-xs italic" v-show="errorMessage">{{ errorMessage }}</p>
        </div>
      </form>
    </div>
</template>


<script setup lang="ts">
  import { useNuxtApp, useAppConfig, useRoute, useRouter } from 'nuxt/app'
  import { ref } from 'vue'
  // import { Session } from '@/store/session'
  import { isDev } from '../utils'
  // import { useSessionStore } from '../stores/session'
  import { useSession } from '../composables/session'
  import { useNavigation } from '../composables/navigation'


  const app = useNuxtApp()
  const config = useAppConfig()
  const route = useRoute()
  const router = useRouter()
  const session = useSession()
  const navigate = useNavigation()
  const handle = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const validateError = ref('')
  const pds = route.params.service ? `.${route.params.service}` : config.defaultSuffix

  const validateHandle =() => {
    if (handle?.value.length > 0 && !handle.value.includes('.')) {
      handle.value = handle.value + pds
    }
  }

  const validatePassword = () => {
    const appPassFormat = /^[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}$/i
    if (password.value.length > 0 && !password.value.match(appPassFormat)) {
      validateError.value = 'Do NOT enter your normal password. Use App Password'
    } else {
      validateError.value = ''
    }
  }

  const submitForm = async () => {
    if (!validateError.value) {
      try {
        await session.login({identifier: handle.value, password: password.value})
        if (navigate.getNext()) {
          navigate.clear()
          await router.push({ name: navigate.getNext() ? navigate.getNext() : 'index' })
        }
        
      } catch (err :any) {
        if (isDev()) console.error(err)
        if (err.error && err.message) {1
          errorMessage.value = err.message
        } else {
          errorMessage.value = 'Failed to log in, please check your credentials and try again.'
        }
      }
    }
  }
</script>
