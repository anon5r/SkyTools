<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-3xl">
      <div class="px-3 py-3 flex flex-row justify-between items-center">
        <div class="mr-4 relative w-full">
          <input
            v-model="pdsHostname"
            type="text"
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="Enter PDS entry point (e.g. https://bsky.social)"
            @keyup.enter="getPDSInfo" />
        </div>
        <button
          class="px-5 py-3 min-w-fit bg-blue-400 dark:bg-blue-700 hover:bg-blue-500 hover:dark:bg-blue-600 text-white dark:text-slate-200 rounded-md"
          @click.prevent="getPDSInfo">
          View PDS
        </button>
      </div>
    </div>
    <div class="w-full max-w-3xl">
      <div
        v-if="success && pdsInfo"
        class="bg-white dark:bg-slate-900 dark:border-slate-400 border-2 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3
            class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-400">
            PDS status viewer
          </h3>
        </div>
        <div
          class="text-gray-800 dark:text-slate-100 border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div
              class="bg-gray-50 dark:bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-slate-300">
                <font-awesome-icon
                  :icon="['fal', 'dungeon']"
                  class="text-lg mr-1" />
                Entrypoint
              </dt>
              <dd
                class="mt-1 text-sm text-gray-900 dark:text-slate-300 sm:mt-0 sm:col-span-2">
                <span class="select-all">{{ pdsHostname }}</span>
              </dd>
            </div>
          </dl>
        </div>
        <div
          class="text-gray-800 dark:text-slate-100 border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div
              class="bg-gray-50 dark:bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-slate-300">
                <font-awesome-icon
                  :icon="['fal', 'id-card']"
                  class="text-lg mr-1" />
                Available handle domains
              </dt>
              <dd
                class="mt-1 text-sm text-gray-700 dark:text-slate-300 sm:mt-0 sm:col-span-2">
                <ul class="list-none">
                  <li
                    v-for="domain in pdsInfo.availableUserDomains"
                    :key="domain">
                    <code class="mr-1 select-all">
                      {{ domain }}
                    </code>
                  </li>
                </ul>
              </dd>
            </div>
            <div
              class="bg-white dark:bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-slate-300">
                <font-awesome-icon
                  :icon="['far', 'ticket-perforated']"
                  class="text-lg mr-2" />
                Invite Code Required
              </dt>
              <dd class="mt-1 text-sm text-gray-500 sm:mt-0 sm:col-span-2">
                <span
                  v-if="pdsInfo.inviteCodeRequired"
                  class="text-green-600 dark:text-green-600">
                  <font-awesome-icon
                    :icon="['fas', 'shield-check']"
                    class="mr-1" />
                  Yes
                </span>
                <span v-else class="text-blue-400 dark:text-blue-400">
                  <font-awesome-icon
                    :icon="['fas', 'shield-slash']"
                    class="mr-1" />
                  No
                </span>
              </dd>
            </div>
            <div
              class="bg-gray-50 dark:bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-slate-300">
                <font-awesome-icon
                  :icon="['fal', 'comment-sms']"
                  class="text-xl mr-2" />
                Phone Verification Required
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  v-if="pdsInfo.phoneVerificationRequired"
                  class="text-green-600 dark:text-green-600">
                  <font-awesome-icon
                    :icon="['fas', 'shield-check']"
                    class="mr-1" />
                  Yes
                </span>
                <span v-else class="text-blue-400 dark:text-blue-700">
                  <font-awesome-icon
                    :icon="['fas', 'shield-slash']"
                    class="mr-1" />
                  No
                </span>
              </dd>
            </div>
            <div
              v-if="pdsInfo.links"
              class="bg-white dark:bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-slate-300">
                <font-awesome-icon
                  :icon="['fas', 'file-contract']"
                  class="mr-2 text-xl" />
                Document links
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div v-if="pdsInfo.links?.privacyPolicy" class="mr-1 my-1">
                  <font-awesome-icon
                    :icon="['far', 'file-shield']"
                    class="mr-1 text-md mr-1 text-blue-800 dark:text-blue-400" />
                  <a
                    :href="pdsInfo.links.privacyPolicy"
                    target="_blank"
                    class="my-1 text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-200 underline">
                    Privacy Policy
                    <font-awesome-icon
                      :icon="['fas', 'external-link-alt']"
                      class="ml-1 text-xs" />
                  </a>
                </div>
                <div v-if="pdsInfo.links?.termsOfService">
                  <font-awesome-icon
                    :icon="['fal', 'file-check']"
                    class="mr-1 text-md text-blue-800 dark:text-blue-400" />
                  <a
                    :href="pdsInfo.links.termsOfService"
                    target="_blank"
                    class="my-1 text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-200 underline">
                    Terms of Service
                    <font-awesome-icon
                      :icon="['fas', 'external-link-alt']"
                      class="ml-1 text-xs" />
                  </a>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div
        v-else-if="!success"
        class="bg-white dark:bg-slate-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3
            class="text-lg leading-6 font-medium text-red-700 dark:text-red-900">
            Failed to load PDS
          </h3>
        </div>
        <div
          class="mx-5 text-gray-800 dark:text-slate-100 border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div class="px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-slate-300">
                <font-awesome-icon
                  :icon="['fal', 'exclamation-triangle']"
                  class="text-lg mr-1" />
                Error This PDS entry point is not available or failed to load.
              </dt>
              <dt>
                <div class="mx-1 p-2 bg-gray-200 dark:bg-gray-800">
                  <font-awesome-icon
                    :icon="['fas', 'circle-xmark']"
                    class="ml-1 mr-2 text-red-700" />
                  <code class="select-all text-sm">
                    {{ pdsHostname }}
                  </code>
                </div>
              </dt>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onBeforeMount } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { describeServer } from '~/utils/lexicons'
  import { ComAtprotoServerDescribeServer } from '@atproto/api'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { isDev } from '#imports'

  const route = useRoute()
  const router = useRouter()

  const pdsInfo = ref<ComAtprotoServerDescribeServer.OutputSchema | null>(null)
  const success = ref(true)

  const pdsHostname = ref<string | null>(
    (route.params.hostname as string) || null
  )

  const getPDSInfo = async () => {
    if (!pdsHostname.value) return
    pdsHostname.value = pdsHostname.value.trim()
    let pdsURL = pdsHostname.value.trim()

    if (
      pdsHostname.value.length > 0 &&
      !(
        pdsHostname.value.startsWith('https://') ||
        pdsHostname.value.startsWith('http://')
      )
    ) {
      pdsURL = `https://${pdsURL}`
    }

    try {
      if (isDev()) console.log('pdsURL = ', pdsURL)
      const url = new URL(pdsURL)
      const domainPart = url.hostname
      if (domainPart !== route.params.hostname) {
        await router.push(`/pds/${domainPart}`).catch(err => console.error(err))
      }

      pdsInfo.value = await describeServer(url.protocol + '//' + url.hostname)
      success.value = true
      if (isDev()) console.log(pdsInfo.value)
    } catch (error) {
      console.error('❌ Failed to fetch PDS')
      console.error(error)

      pdsInfo.value = null
      success.value = false
    }
  }

  watch(
    () => route.params.hostname as string | undefined,
    newValue => {
      const regex = new RegExp('^https?://' + pdsHostname.value)
      if (
        typeof newValue === 'string' &&
        newValue.length > 0 &&
        !regex.test(newValue)
      ) {
        pdsHostname.value = `https://${newValue}`
      }
    },
    { immediate: true }
  )

  onBeforeMount(async () => {
    if (pdsHostname.value) await getPDSInfo()
  })
</script>
