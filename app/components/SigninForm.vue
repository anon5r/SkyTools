<template>
  <div class="w-full max-w-xs mx-auto">
    <form
      class="bg-white dark:bg-slate-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h4 class="text-2xl font-bold pb-4">Sign-in to Bluesky</h4>
      <div class="mb-4">
        <label
          class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 pt-1"
          for="handle">
          <ClientOnly>
            <font-awesome-icon icon="fa-database" class="pr-2" />
          </ClientOnly>
          PDS
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 bg-transparent text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          id="pds"
          v-model="pds"
          type="text"
          autocomplete="PDS"
          placeholder="https://bsky.social"
          @focusout="validatePDS"
          tabindex="1" />
      </div>
      <div class="mb-4">
        <label
          class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 pt-1"
          for="handle">
          <ClientOnly>
            <font-awesome-icon :icon="['fas', 'user']" class="pr-2" />
          </ClientOnly>
          Your handle
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 bg-transparent text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          id="handle"
          v-model="handle"
          type="text"
          autocomplete="username"
          :placeholder="`ex. example${handleSuffix}`"
          @focusout="validateHandle"
          tabindex="1" />
      </div>
      <div class="mb-3">
        <label class="block text-base font-bold mb-2 pt-1" for="password">
          <ClientOnly>
            <font-awesome-icon :icon="['fas', 'key']" class="pr-2" />
          </ClientOnly>
          App Password
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 bg-transparent text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="xxxx-xxxx-xxxx-xxxx"
          @input="validatePassword"
          tabindex="2" />
        <p class="text-sm text-right">
          <a
            :href="`${config.bskyAppURL}/settings/app-passwords`"
            class="text-blue-600 dark:text-blue-400 underline"
            tabindex="4">
            Create App Password
          </a>
        </p>
        <p class="text-red-500 text-xs italic" v-show="validateError">
          {{ validateError }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <button
          class="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold whitespace-nowrap rounded outline-blue-800 dark:outline-blue-300 focus:outline-2 focus:shadow-outline"
          type="button"
          @click="submitForm"
          tabindex="3">
          Sign in
        </button>
      </div>
      <div
        class="block px-1 py-2 text-red-500 text-xs italic"
        v-show="errorMessage">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
  import { useAppConfig, ref, useRoute, useState } from '#imports'
  import { defineProps } from 'vue'
  import { isDev } from '~/utils/helpers'
  import { initLoginState, login as AuthLogin } from '~/composables/auth'
  import { useNavigation } from '~/composables/navigation'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const config = useAppConfig()
  const route = useRoute()
  const navigate = useNavigation()

  const props = defineProps({
    service: {
      type: String,
      require: false,
      default: 'bsky.social',
    },
  })
  const useLoginState = () => useState('loginState', initLoginState)
  const loginState = useLoginState()
  const handle = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const validateError = ref('')
  const isProcessing = ref(false)
  const handleSuffix = route.params.service
    ? `.${route.params.service}`
    : `.${props.service ?? config.defaultSuffix}`
  const pds = ref(
    route.params.service
      ? `https://${route.params.service}`
      : `https://${props.service ?? config.defaultSuffix}`
  )

  const validatePDS = async () => {
    pds.value = pds.value.trim()
    if (pds.value && pds.value.length > 0) {
      if (!pds.value.includes('://')) {
        pds.value = `https://${pds.value}`
      }
      if (!pds.value !== route.params.service) {
        route.params.service = pds.value.replace('https://', '')
      }
    }
  }
  const validateHandle = () => {
    if (
      handle.value &&
      handle.value.length > 0 &&
      !handle.value.includes('.')
    ) {
      handle.value = handle.value + handleSuffix
    }
  }

  const validatePassword = () => {
    const appPassFormat = /^[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}$/i
    if (password.value.length > 0 && !password.value.match(appPassFormat)) {
      validateError.value =
        'Do NOT enter your normal password. Use App Password'
    } else {
      validateError.value = ''
    }
  }

  const submitForm = async () => {
    if (!validateError.value) {
      try {
        isProcessing.value = true
        if (
          await AuthLogin({
            identifier: handle.value,
            password: password.value,
            pds: pds.value,
          })
        ) {
          if (
            navigate.getNext() !== null &&
            navigate.getNext() !== route.fullPath
          ) {
            loginState.value.isLoggedIn = true
            navigate.goNext()
          } else {
            navigate.goHome()
          }
        }
      } catch (err) {
        if (isDev()) console.error(err)

        if (err.error && err.message) {
          1
          errorMessage.value = err.message
        } else {
          errorMessage.value =
            'Failed to log in, please check your credentials and try again.'
        }
      } finally {
        isProcessing.value = false
      }
    }
  }
</script>
