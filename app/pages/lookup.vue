<template>
  <div
    class="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-md">
      <div class="border-2 border-gray-200 dark:border-slate-500 bg-white dark:bg-slate-800 shadow-md rounded-lg md:px-3 md:py-2 mb-4">
        <div class="block text-gray-700 dark:text-slate-200 text-lg font-semibold md:py-2 md:px-2">
          Enter a handle or DID
        </div>
        <div class="flex items-center bg-gray-100 dark:bg-slate-700 rounded-md">
          <div class="w-full p-2">
            <input
              class="bg-transparent rounded-md w-full text-gray-700 dark:text-slate-200"
              v-model="handle"
              @focusout="focusout"
              @keyup.enter="requestDID"
              placeholder="ex. example.bsky.social" />
          </div>
          <div class="p-2">
            <button
              class="bg-blue-500 dark:bg-blue-700 text-white dark:text-slate-300 rounded-md px-2 py-1"
              @click="requestDID">
              Lookup
            </button>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-100 dark:bg-slate-700 shadow-md rounded-lg px-3 py-2 border-2"
        v-if="result"
        :class="{ 'border-red-400': hasError, 'border-green-500': !hasError }">
        <div class="block text-gray-700 dark:text-slate-300 text-lg font-semibold py-2 px-2">
          <span v-if="result.startsWith('did:')">DID</span>
          <span v-else>Handle</span>
        </div>
        <div
          class="py-2 px-2"
          :class="{
            'text-red-600 dark:text-red-400': hasError,
            'text-gray-600 dark:text-slate-400': !hasError,
          }">
          {{ result }}
<template>
  <tabs v-model="activeTab" class="p-5"> <!-- class appends to content DIV for all tabs -->
    <tab name="posts" title="Posts">
      Timelines
    </tab>
    <tab name="following" title="Following">
      Following
    </tab>
    <tab name="follower" title="Follower">
      Followers
    </tab>
    <tab name="blocking" title="Blocking" :disabled="true">
      Blocking list here...
    </tab>
    <tab name="mute" title="Mute" :disabled="true">
      Muting list here...
    </tab>
  </tabs>
</template>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, Tab } from 'flowbite-vue'
import { isDev } from '~/utils'
import { useAppConfig } from 'nuxt/app'

const activeTab = ref('posts')

const route = useRoute()
const router = useRouter()
const handle = ref(route.query.handle || '')

const result = ref('')
const hasError = ref(false)

const focusout = () => {
    handle.value = this.formatIdentifier(this.handle)
}
const formatIdentifier = id => {
  if (id.length > 0 && !id.startsWith('did:')) {
    id.startsWith('@') ? id.substring(1) : id
    id.startsWith('at://') ? id.substring(5) : id
    if (!id.includes('.')) {
      id += useAppConfig().defaultSuffix // default xxx -> xxx.bsky.social
    }
  }
  return id
}


const requestDID = async () => {
  try {
    let identifier = this.formatIdentifier(this.handle)
    handle.value = identifier
    router.push({ query: { handle: identifier } })

    let requestUrl
    if (identifier.startsWith('did:'))
      requestUrl = `https://plc.directory/${identifier}`
    else
      requestUrl = `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${identifier}`

    const res = await axios.get(requestUrl)
    if (isDev()) console.log(res)

    if (res.data?.did) result.value = res.data.did
    else if (res.data?.alsoKnownAs) result.value = res.data.alsoKnownAs[0]

    hasError.value = false
  } catch (error) {
    if (isDev()) console.error(error)
    hasError.value = true
    result.value = error.message
    if (error.response.data.message)
      result.value = error.response.data.message
  }
}
</script>
