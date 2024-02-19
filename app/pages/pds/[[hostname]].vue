<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <form @submit.prevent="fetchPDSInfo" class="mb-6">
      <div class="flex gap-2">
        <input
          v-model="pdsHostname"
          placeholder="e.g. https://bsky.social"
          title='Enter PDS entry point URL (e.g. "https://bsky.social")'
          type="url"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
        <button
          type="submit"
          class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
          Fetch PDS Info
        </button>
      </div>
    </form>
    <div
      v-if="pdsInfo"
      class="bg-white dark:bg-slate-800 shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3
          class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-400">
          PDS Information
        </h3>
      </div>
      <div
        class="text-gray-800 dark:text-slate-100 border-t border-gray-200 dark:border-gray-700">
        <dl>
          <div
            class="bg-gray-50 dark:bg-slate-600 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500 dark:text-slate-300">
              <font-awesome-icon
                :icon="['fal', 'id-card']"
                class="text-lg mr-1" />
              Available handle domains
            </dt>
            <dd
              class="mt-1 text-sm text-gray-900 dark:text-slate-300 sm:mt-0 sm:col-span-2">
              <ul class="list-none">
                <li
                  v-for="domain in pdsInfo.availableUserDomains"
                  :key="domain">
                  <code class="mr-1">
                    {{ domain }}
                  </code>
                </li>
              </ul>
            </dd>
          </div>
          <div
            class="bg-white dark:bg-slate-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
            class="bg-gray-50 dark:bg-slate-600 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
            class="bg-white dark:bg-slate-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
                  class="mr-1 text-xl mr-1 text-blue-800 dark:text-blue-400" />
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
                  class="text-xl mr-1 text-blue-800 dark:text-blue-400" />
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
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { describeServer } from '~/utils/lexicons'
  import { ComAtprotoServerDescribeServer } from '@atproto/api'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const route = useRoute()
  const router = useRouter()

  const pdsInfo = ref<ComAtprotoServerDescribeServer.OutputSchema | null>(null)

  const pdsHostname = ref<string | null>(null)

  // URLパラメータから初期値を設定
  watch(
    () => route.params.hostname as string | undefined,
    value => {
      if (typeof value === 'string' && value.length > 0) {
        pdsHostname.value = `https://${value}`
      }
    },
    { immediate: true }
  )

  const fetchPDSInfo = async () => {
    if (!pdsHostname.value) return

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
    console.log(pdsURL)
    const url = new URL(pdsURL)
    const domainPart = url.hostname

    await router.push(`/pds/${domainPart}`).catch(err => console.error(err))
    try {
      pdsInfo.value = await describeServer(url.protocol + '//' + url.hostname)
    } catch (error) {
      console.error('Failed to fetch PDS info:', error)
      pdsInfo.value = null
    }
  }
</script>
