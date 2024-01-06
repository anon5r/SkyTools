<template>
  <div
    class="flex justify-center items-start lg:items-center pt-9 lg:pt-0 min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="mt-4 w-full max-w-md">
      <div
        class="border-2 mt-5 border-gray-200 dark:border-slate-500 bg-white dark:bg-slate-800 shadow-md rounded-lg md:px-3 md:py-2 mb-4">
        <div
          class="block text-gray-700 dark:text-slate-200 text-lg font-semibold py-1 px-2">
          Identify history
        </div>
        <div class="px-3 py-3 flex flex-row justify-between items-center">
          <div class="mr-2 relative w-full">
            <input
              v-model="handle"
              type="text"
              id="handle_did"
              class="block px-2.5 pb-2 pt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              @focusout="focusout"
              @keyup.enter="submit" />
            <label
              for="handle_did"
              class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-focus:bg-white peer-focus:dark:bg-slate-800 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Handle or DID
            </label>
          </div>
          <button
            class="px-3 py-1.5 bg-blue-400 dark:bg-blue-700 hover:bg-blue-500 hover:dark:bg-blue-600 text-white dark:text-slate-200 rounded-md"
            @click.prevent="submit">
            Submit
          </button>
        </div>
      </div>

      <div
        class="bg-white dark:bg-slate-900 shadow-md rounded-lg px-3 py-2 border-2"
        v-if="results.length > 0"
        :class="{ 'border-red-600': hasError, 'border-green-500': !hasError }">
        <div
          class="block text-gray-700 dark:text-slate-400 text-lg font-semibold py-2 px-2">
          Handle history
        </div>
        <div
          class="py-2 px-2"
          :class="{
            'text-red-600 dark:text-red-400': hasError,
            'text-gray-600 dark:text-gray-400': !hasError,
          }">
          <div v-if="hasError">{{ results }}</div>
          <ul
            v-else
            class="relative border-l border-gray-200 dark:border-gray-700">
            <li v-for="record in results" :key="record.id" class="mb-4 ml-3">
              <font-awesome-icon
                :icon="record.icon"
                :style="record.iconStyle"
                class="absolute w-3 h-3 mt-1.5 -left-1.5" />
              <time
                class="mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {{ record.createdAt }}
              </time>
              <p class="mb-1 text-base font-sans at-handle select-all">
                {{ record.handle.replace('at://', '') }}
              </p>
              <div
                class="mb-5 text-xs font-mono text-gray-300 dark:text-slate-500 select-all">
                {{ record.did }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { DateTime } from 'luxon'
  import { isDev } from '@/utils/helpers'
  import {
    formatIdentifier,
    getIdentityAuditLogs,
    resolveHandle,
  } from '@/utils/lexicons'
  import {
    useAppConfig,
    useSeoMeta,
    onMounted,
    ref,
    useRoute,
    useRouter,
  } from '#imports'
  import axios from 'axios'

  const route = useRoute()
  const router = useRouter()

  const handle = ref(route.query.id || '')
  const results = ref([])
  const hasError = ref(false)
  const config = useAppConfig()

  useSeoMeta({
    title: `Handle history | ${config.title}`,
    ogTitle: `Handle history | ${config.title}`,
    ogImage: `${config.prodURLPrefix}/images/ogp/history.png`,
    twitterCard: 'summary',
  })
  onMounted(() => {
    if (route.query.id) handle.value = route.query.id

    if (handle.value.length > 0) getHistory(handle.value)

    useSeoMeta({
      title: `Handle history | ${config.title} ${
        handle.value ?? '- ' + handle.value
      }`,
      ogTitle: `Handle history | ${config.title} - ${
        handle.value ?? '- ' + handle.value
      }`,
    })
  })

  const focusout = () => {
    handle.value = formatIdentifier(handle.value)
  }

  const submit = () => {
    router.push({ query: { id: handle.value } })
    if (handle.value.length > 0) {
      getHistory(handle.value)
    }
  }

  /** Get DID from handle */
  const getDID = async handle => {
    try {
      hasError.value = false
      handle = formatIdentifier(handle)
      router.push({ query: { id: handle } })
      return await resolveHandle(handle)
    } catch (error) {
      hasError.value = true
      if (isDev()) console.error(error)

      if (axios.isAxiosError(error) && error.response.data.message)
        results.value = error.response.data.message
      else results.value = error.message
    }
  }
  /** Get handle history from DID */
  const getHistory = async did => {
    try {
      if (!did.startsWith('did:')) did = await getDID(did)
      if (hasError.value) return

      const res = await getIdentityAuditLogs(did)

      if (res.length > 0) {
        const records = res.reverse()
        const items = []
        for (const idx in records) {
          let icon, style
          icon = ['fas', 'square-minus']
          style = { color: '#cccccc' }
          if (idx == 0) {
            icon = ['fas', 'circle-check']
            style = { color: '#18b404' }
          } else if (
            records[idx].operation.type === 'create' ||
            records[idx].operation.prev === null
          ) {
            icon = ['fas', 'flag']
            style = { color: '#ea2a63' }
          }
          items.push({
            id: records[idx].cid,
            icon: icon,
            iconStyle: style,
            createdAt: DateTime.fromISO(records[idx].createdAt).toString(),
            handle: records[idx].operation.handle
              ? records[idx].operation.handle
              : records[idx].operation.alsoKnownAs[0],
            did: records[idx].did,
            _raw: records[idx].operation,
          })
        }
        results.value = items
      }
    } catch (err) {
      if (isDev()) console.error(err)
      results.value = err.message
      if (axios.AxiosError(err)) {
        if (err.response.data.message) results.value = err.response.data.message
      }
    }
  }
</script>

<style scoped>
  .at-handle::before {
    content: '@';
  }
</style>
