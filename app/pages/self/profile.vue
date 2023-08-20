<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-3xl">
      <ClientOnly>
        <div class="text-gray-900 dark:text-slate-100">
          <div class="flex items-center">
            <div class="inline-flex items-center mr-3">
              <!-- Avatar -->
              <a
                v-if="!hasError && loadState.profile"
                :href="`${config.bskyAppURL}/profile/${userinfo.profile.handle}`">
                <Avatar
                  rounded
                  bordered
                  :status="online"
                  size="lg"
                  :img="userinfo.profile.avatar ?? ''"
                  :alt="userinfo.profile.handle ?? ''"
                  class="m-2 min-w-max" />
              </a>
              <div v-else-if="!loadState.profile" role="status">
                  <svg aria-hidden="true" class="inline w-16 h-16 m-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
              </div>
              <div v-else>
                <Avatar rounded bordered size="lg" class="m-2 min-w-max" />
              </div>
            </div>
            <div>
              <h2 class="text-3xl" :class="{ 'text-red-600': hasError }">
                <!-- Disply name -->
                {{
                  !loadState.profile ? 'Loading...' : (
                  userinfo.profile.displayName ||
                  userinfo.profile.handle ||
                  'Unknown')
                }}
              </h2>
              <div
                class="text-sm font-semibold text-gray-500 dark:text-slate-500">
                <!-- Handle -->
                <span
                  v-if="loadState.profile"
                  :class="{ 'line-through': hasError}"
                  class="select-all at-handle">
                  {{ userinfo.profile.handle || 'unknown.example' }}
              </span>
                <span v-else class="mt-4">loading...</span>
              </div>
              <div
                class="text-sm sm:text-xs truncate font-mono sm:font-thin text-gray-400 dark:text-slate-500 select-all">
                <!-- DID -->
                {{ loadState.profile ? userinfo.profile.did : 'loading...' }}
              </div>
            </div>
          </div>

          <!-- Follows / Following / Posts -->
          <div class="m-4 flex flex-row min-w-strech">
            <div class="mr-2 font-light text-gray-600 dark:text-slate-500">
              <span class="font-semibold text-gray-900 dark:text-slate-200">{{ loadState.profile ? userinfo.profile.followersCount : '???' }}</span> followers
            </div>
            <div class="mx-2 font-light text-gray-600 dark:text-slate-500">
              <span class="font-semibold text-gray-900 dark:text-slate-200">{{ loadState.profile ? userinfo.profile.followsCount : '???' }}</span> following
            </div>
            <div class="ml-2 font-light text-gray-600 dark:text-slate-500">
              <span class="font-semibold text-gray-900 dark:text-slate-200">{{ loadState.profile ? userinfo.profile.postsCount : '???' }}</span> posts
            </div>
          </div>

          <!-- Description -->
          <p class="m-4 text-sm min-w-strech whitespace-pre-line">
            {{ loadState.profile ? userinfo.profile.description : '' }}
          </p>

          <!-- Labels -->
          <div v-if="userinfo.profile.labels && !inEdit.labels" class="m-4">
            <ul class="inline-block">
              <li
                v-for="(label, index) in userinfo.profile.labels"
                :key="index"
                class="inline-block items-center px-2 py-1 mr-2 text-xs font-medium rounded text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                  <FontAwesomeIcon :icon="['fas', 'tag']" class="mr-1" size="sm" />
                  {{ label.val }}
              </li>
            </ul>
            <button
              class="p-2 text-sm bg-blue-500 dark:bg-blue-700 text-blue-100 rounded-md focus:outline"
              @click="editLabel()">
                Edit labels
            </button>
          </div>
          <div v-else-if="inEdit.labels" class="m-4">
            <ul class="flex flex-row">
              <li
                v-for="(label, index) in editdata.labels" :key="index"
                :id="`label-dismiss-${index}`"
                class="inline-flex items-center px-2 py-1 mr-2 text-xs font-light rounded select-all"
                :class="
                definedLabels.includes(label)
                // ? 'text-pink-800 bg-pink-100 dark:bg-pink-900 dark:text-pink-300'
                // : 'text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                ? 'text-pink-800 bg-pink-100 dark:bg-pink-900 dark:text-pink-300 hover:bg-pink-300 hover:dark:bg-pink-700'
                : 'text-gray-800 bg-gray-300 hover:bg-gray-500 dark:text-gray-200 dark:bg-slate-700 hover:dark:bg-slate-500 hover:bg-opacity-50  hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300'
                ">
                {{ label }}
                <button
                  type="button"
                  class="inline-flex items-center p-0.5 ml-1 text-sm rounded-sm "
                  :class="
                    definedLabels.includes(label)
                    ? 'text-pink-500 bg-pink-100 dark:bg-pink-900 dark:text-pink-300'
                    : 'text-gray-400 bg-gray-300 hover:bg-gray-500 hover:text-gray-200 dark:hover:bg-slate-700 dark:hover:text-gray-300'"
                  :data-dismiss-target="
                    definedLabels.includes(label) ?
                    '#badge-dismiss-pink'
                    : '#badge-dismiss-dark'
                    "
                  aria-label="Remove"
                  @click="removeLabel(label)">
                  <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span class="sr-only">Remove label</span>
                </button>
              </li>
              <li>
                <!-- add new label field -->
                <button
                  data-popover-target="label-input-field"
                  data-popover-trigger="click"
                  data-popover-placement="bottom"
                  type="button"
                  class="m-2 px-1.5 bg-gray-500 hover:bg-gray-400 dark:bg-gray-600 focus:ring-1 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-200 rounded-md"
                  >
                    <FontAwesomeIcon :icon="['fas', 'plus']" size="2xs" />
                </button>
              </li>
              aaaa
              <div
                data-popover
                id="label-input-field"
                role="tooltip"
                class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                >
                <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                  <h3 class="font-semibold text-gray-900 dark:text-white">Add new label</h3>
                </div>
                <AddLabelForm />
                <div data-popper-arrow></div>
              </div>
            </ul>
            <button
              class="p-2 text-sm bg-blue-500 dark:bg-blue-700 text-blue-100 rounded-md focus:outline"
              @click="saveLabels()">
                Save
            </button>
          </div>

          <!-- Last indexed -->
          <div class="mx-4 text-sm">
            Last indexed at
            <time class="mx-1 font-light italic" :datetime="userinfo.profile.indexedAt">{{ DateTime.fromISO(userinfo.profile.indexedAt).toFormat('DDD TTT') }}</time>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
  import { useAppConfig } from 'nuxt/app'
  import { DateTime } from 'luxon'
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { isDev } from '@/utils/helpers'
  import { useAuth } from '@/composables/auth'
  import { useNavigation } from '@/composables/navigation'
  import { initPopovers } from 'flowbite'
  import { Avatar } from 'flowbite-vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


  const SIGNIN_URL = '/bsky.social/signin'


  const route = useRoute()
  const router = useRouter()
  const config = useAppConfig()
  const navi = useNavigation()

  const auth = useAuth()

  const hasError = ref(false)
  const inEdit = ref({
    labels: false
  })

  const userinfoInitial = {
    profile: {},
  }

  const userinfo = ref(userinfoInitial)

  const editdata = ref({
    displayName: '',
    description: {},
    labels:[]
  })

  const definedLabels = []

  // Each loading state
  const loadState = ref({
    profile: true,
  })




  onMounted(async () => {
    initPopovers()

    auth.getAgent()
    if (!auth.isLoggedIn()) {
      try {
        await auth.restoreSession()

        // load profile
        await loadProfile()

      } catch (err) {
        // Back to current page
        navi.setNext(route.name)
        router.push({ path: SIGNIN_URL })
        return
      }

      try {
        // load defined labels
        const res = await fetch('/labels.json', { method: 'get' })
        if (res.ok) {
          const data = await res.json()
          definedLabels.value = data.defined
          useState('defined-labels', () => {
            return definedLabels.value
          })
        }
      } catch (err) {
        console.warn(err)
      }
    } else {
        // Back to current page
        navi.setNext(route.name)
        router.push({ path: SIGNIN_URL })
        return
    }
  })


  const loadProfile = async () => {
    userinfo.value = userinfoInitial
    hasError.value = false
    loadState.value.profile = false

    try {
      const result = await auth.getProfile()
      updateUserInfo('profile', result)

    } catch (err) {
      if (isDev()) console.error(err)
      hasError.value = true
      updateUserInfo('profile', {
        did: auth.getDid() ?? 'error:unknown:unknown',
        displayName: auth.getHandle() ?? 'Error: Unknown',
        avatar: '',
      })
      throw err
    }
  }

  /**
   * update user datum
   * @param {string} item
   * @param {any} value
   */
  const updateUserInfo = (item, value) => {
    if (isDev()) console.log('[updateUserInfo]::', item, ' = ', value)
    userinfo.value[item] = value
    loadState.value[item] = true
  }

  const editLabel = () => {
    if (!inEdit.value.labels.value) {
      editdata.value.labels = userinfo.value.profile.labels
    }
    inEdit.value.labels = !inEdit.value.labels
  }


  const addLabel = () => {
    console.info(labels.value)
    newLabel = newLabel.trim()
    if (newLabel) {
      if (labels.value.includes(newLabel)) {
        labelWarning.value = true
      } else {
        labels.value.push(newLabel)
        clearInputLabel(true)
      }
    }
  }

  const removeLabel = (text) => {
    if (labels.value.findIndex((label) => label === text) !== -1) {
      labels.value.splice(labels.value.findIndex((label) => label === text), 1)
    }
  }

  const clearInputLabel = flush => {
    labelWarning.value = false
    if (flush) newLabel = ''
  }

  const saveLabels = () => {
    if (userinfo.value.profile.labels != editdata.value.labels) {
      if (confirm('Do you want to save changes?')) {
        const agent = auth.getAgent()
        agent.api.app.bsky.actor.profile.create()
      }
    }
    inEdit.value.labels = false
  }

</script>

<style scoped>
  .at-handle::before {
    content: '@';
  }
</style>
