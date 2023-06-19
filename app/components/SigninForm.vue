<template>
    <div class="w-full max-w-xs mx-auto">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h4 class="text-2xl font-bold dark:text-white">Sign-in to Bluesky</h4>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="handle">
            <font-awesome-icon :icon="['fas', 'user']" />
            Your handle
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="handle"
            v-model="handle"
            type="text"
            autocomplete="username"
            placeholder="ex. example.bsky.social"
            @focusout="validateHandle"
          />
        </div>
        <div class="mb-3">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            <font-awesome-icon :icon="['fas', 'key']" />
            App Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="xxxx-xxxx-xxxx-xxxx"
            @input="validatePassword"
          />
          <p class="text-red-500 text-xs italic" v-show="validateError">{{ validateError }}</p>
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold whitespace-nowrap py-4 px-8 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="submitForm">
            Sign in
          </button>
        </div>
        <div class="block px-1 py-2 text-red-500 text-xs italic" v-show="errorMessage">{{ errorMessage }}</div>
      </form>
    </div>
</template>


<script setup lang="ts">
  import { useAppConfig, useRoute, useRouter, onBeforeRouteLeave } from 'nuxt/app'
  import { ref, onMounted } from 'vue'
  import { isNavigationFailure, NavigationFailureType } from 'vue-router'
  import { isDev } from '../utils'
  import { useAuth } from '../composables/auth'
  import { useNavigation } from '../composables/navigation'

  onMounted(async () => {
    if (auth.value == null)
      auth.value = await useAuth()
  })


  const config = useAppConfig()
  const route = useRoute()
  const router = useRouter()
  const auth = ref(null)
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
        if (await auth.value.login({identifier: handle.value, password: password.value})) {
          if (navigate.getNext()) {
            auth.value.isLoggedIn = true
            router.push({ name: navigate.getNext() ?? 'index' })
          }
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