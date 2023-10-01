<template>
    <div class="w-full max-w-xs mx-auto">
    <form
      class="bg-white dark:bg-slate-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h4 class="text-2xl font-bold pb-4">Sign-in with <span class="line-through">AT-Protocol</span> <span class="text-blue-600">Bluesky</span></h4>
      <!-- <div class="mb-4">
        <label
          class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 pt-1"
          for="service">
        <ClientOnly>
          <FontAwesomeIcon :icon="['fas', 'box']" class="pr-2" />
        </ClientOnly>
        PDS
        </label>
        <input
          id="handle"
          v-model="pds"
          class="shadow appearance-none border rounded w-full py-2 px-3 bg-transparent text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          autocomplete=""
          placeholder="ex. bsky.social"
          tabindex="1"
        />
      </div> -->
      <div class="mb-4">
        <label
          class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 pt-1"
          for="handle">
        <ClientOnly>
          <FontAwesomeIcon :icon="['fas', 'user']" class="pr-2" />
        </ClientOnly>
        Your handle
        </label>
        <input
          id="handle"
          v-model="handle"
          class="shadow appearance-none border rounded w-full py-2 px-3 bg-transparent text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          autocomplete="username"
          placeholder="ex. example.bsky.social"
          tabindex="2"
          @focusout="validateHandle"
        />
      </div>
      <div class="mb-3">
        <label class="block text-base font-bold mb-2 pt-1" for="password">
          <ClientOnly>
          <FontAwesomeIcon :icon="['fas', 'key']" class="pr-2" />
          </ClientOnly>
          App Password
          </label>
          <input
            id="password"
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 bg-transparent text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            autocomplete="current-password"
            placeholder="xxxx-xxxx-xxxx-xxxx"
            tabindex="3"
            @input="validatePassword" />
        <p class="text-sm text-right">
          <a
            :href="`${config.bskyAppURL}/settings/app-passwords`"
            class="text-blue-600 dark:text-blue-400 underline"
            tabindex="6">
            Create App Password
          </a>
        </p>
        <p v-show="validateError" class="text-red-500 text-xs italic">
          {{ validateError }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <button
          class=" py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold whitespace-nowrap rounded outline-blue-800 dark:outline-blue-300 focus:outline-2 focus:shadow-outline"
          type="button"
          tabindex="5"
          :disabled="isProcessing"
          @click="submitForm">
          Sign in
          <ClientOnly>
            <FontAwesomeIcon :icon="['fas', 'spinner']" spin-pulse :class="`${isProcessing ? 'inline-block' : 'hidden'}`" />
          </ClientOnly>
        </button>
      </div>
      <div
        v-show="errorMessage"
        class="block px-1 py-2 text-red-500 text-xs italic">
        {{ errorMessage }}
      </div>
      </form>
    </div>
</template>

<script setup>
  import { useAppConfig, useRoute } from 'nuxt/app'
  import { ref, defineProps } from 'vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { isDev } from '~/utils/helpers'
  import { useAuth } from '~/composables/auth'
  import { useNavigation } from '~/composables/navigation'


  const props = defineProps({
    service: {
      type: String,
      require: false,
      default: 'bsky.social',
    },
  })

  const config = useAppConfig()
  const route = useRoute()
  const navigate = useNavigation()
  const useLoginState = () => useState('loginState', () => { return { isLoggedIn: false, userHandle: '', userEmail: '', }})
  const loginState = useLoginState()
  const auth = ref(null)
  const pds = ref(props.service ?? config.defaultPDS)
  const handle = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const validateError = ref('')
  const isProcessing = ref(false)

  const useStateAuth = () => useState('auth', () => ({
    isLoggedIn: false,
    userHandle: null,
    userEmail: null,
  }))


  onMounted(async () => {
    pds.value = props.service ?? config.defaultPDS
    if (auth.value == null)
      auth.value = await useAuth()
  })


  const validateHandle =() => {
    if (handle.value && handle.value.length > 0 && !handle.value.includes('.')) {
      handle.value = `${handle.value}.${config.defaultSuffix}`
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
        isProcessing.value = true
        if (await auth.value.login({identifier: handle.value, password: password.value, pds: pds.value})) {
          if (navigate.getNext() !== null && navigate.getNext() !== route.fullPath) {
            auth.value.isLoggedIn = true
            loginState.value.isLoggedIn = true
            navigate.goNext()
          } else {
            navigate.goHome()
          }
        }
      } catch (err) {
        if (isDev()) console.error(err)

        if (err.error && err.message) {
          errorMessage.value = err.message
        } else {
          errorMessage.value = 'Failed to log in, please check your credentials and try again.'
        }
      } finally {
        isProcessing.value = false
      }
    }
  }
</script>
