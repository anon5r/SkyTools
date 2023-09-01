<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-3xl">
      <ClientOnly>
        <div class="text-gray-900 dark:text-slate-100">
          <div class="mt-2 sm:mt-5 flex items-center">
            <div class="flex-grow inline-flex max-w-full">
              <div class="items-center">
                <!-- Avatar -->
                <a
                  v-if="!hasError && loadState.profile"
                  :href="`${config.bskyAppURL}/profile/${profile.handle}`">
                  <Avatar
                    rounded
                    bordered
                    :status="online"
                    size="lg"
                    :img="profile.avatar ?? ''"
                    :alt="profile.handle ?? ''"
                    class="m-2 md:m-1 min-w-max" />
                </a>
                <div v-else-if="!loadState.profile" role="status">
                    <svg aria-hidden="true" class="inline w-16 h-16 m-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
                <div v-else>
                  <Avatar rounded bordered size="lg" class="m-2 md:m-1 min-w-max" />
                </div>
              </div>
              <div class="px-3 md:px-1 w-24 grow">
                <h2 class="text-3xl truncate text-ellipsis" :class="{ 'text-red-600': hasError }">
                  <!-- Disply name -->
                  {{
                    !loadState.profile ? 'Loading...' : (
                    profile.displayName ||
                    profile.handle ||
                    'Unknown')
                  }}
                </h2>
                <div
                  class="text-sm font-semibold text-gray-500 dark:text-slate-500">
                  <!-- Handle -->
                  <span
                    v-if="loadState.profile"
                    :class="{ 'line-through': hasError}"
                    class="select-all at-handle truncate text-ellipsis">
                    {{ profile.handle || 'unknown.example' }}
                </span>
                  <span v-else class="mt-4"><Label></Label>oading...</span>
                </div>
                <div
                  class="text-sm sm:text-xs truncate text-ellipsis font-mono sm:font-thin text-gray-400 dark:text-slate-500 select-all">
                  <!-- DID -->
                  {{ loadState.profile ? profile.did : 'loading...' }}
                </div>
              </div>

              <div v-if="!hasError" class="max-w-min min-w-fit p-2">
                <!-- Edit button -->
                <button
                  class="p-2 min-w-full text-xs bg-blue-400 dark:bg-blue-950 text-blue-200 rounded-md focus:outline select-none"
                  @click="editLabel()" :class="!loadState.update ? 'disabled' : ''">
                    <ClientOnly>
                      <span v-if="!loadState.update">
                        <div role="status" class="inline-block leading-tight">
                          <svg aria-hidden="true" class="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-400 dark:fill-blue-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                          <span class="sr-only">Processing...</span>
                        </div>
                        Wait...
                      </span>
                      <span v-else-if="!inEdit">
                        <FontAwesomeIcon :icon="['fas', 'pen-to-square']" size="sm" />
                        Edit
                      </span>
                      <span v-else-if="isEqualArray(profile.labels.map(label => { return label.val }), labels) || description != profile.description">
                        <FontAwesomeIcon :icon="['fas', 'circle-xmark']" size="sm" />
                        Close
                      </span>
                      <span v-else>
                        <FontAwesomeIcon :icon="['fas', 'floppy-disk']" size="sm" />
                        Save
                      </span>
                    </ClientOnly>
                </button>
              </div>
            </div>
          </div>

          <div class="px-2">

            <!-- Follows / Following / Posts -->
            <div v-if="loadState.profile" class="mt-4">
              <ProfileCounters
                :followers-count="profile.followersCount"
                :follows-count="profile.followsCount"
                :posts-count="profile.postsCount" />
            </div>

            <!-- Description -->
            <p class="my-4 text-sm min-w-strech whitespace-pre-line">
              <div v-if="loadState.profile && inEdit">
                <textarea
                  v-model="description"
                  rows="5"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here...">
                    {{ profile.description ?? '' }}
                </textarea>
              </div>
              <div v-else>
                {{ profile?.description ?? '' }}
              </div>
            </p>

            <!-- Label update -->
            <div
              v-if="!hasError"
              class="flex flex-row content-center">
              <!-- Labels -->
              <LabelList
                :labels="labels"
                :inEdit="inEdit" />
            </div>

            <!-- Last indexed -->
            <div v-if="profile.indexedAt" class="text-sm">
              Last indexed at
              <time class="mx-1 font-light italic" :datetime="profile.indexedAt">{{ DateTime.fromISO(profile.indexedAt).toFormat('DDD TTT') }}</time>
            </div>
          </div>


          <!-- Error alerts -->
          <div v-if="alerts.error">
            <div class="flex items-center p-4 mx-2 my-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
              <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span class="sr-only">Error</span>
              <div>
                <span class="font-semibold mr-2">Error</span> {{ alerts.message }}
              </div>
            </div>
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
  import { isDev, isEqualArray } from '@/utils/helpers'
  import { useAuth } from '@/composables/auth'
  import { getProfile as getProfileLex } from '@/utils/lexicons'
  import { useNavigation } from '@/composables/navigation'
  import { initPopovers } from 'flowbite'
  import { Avatar } from 'flowbite-vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


  const SIGNIN_URL = '/bsky.social/signin'


  const route = useRoute()
  const router = useRouter()
  const config = useAppConfig()
  const navi = useNavigation()

  const useLabels = () => useState('labels', () => [])
  const useDescription = () => useState('description', () => [])
  const labels = useLabels()
  const description = useDescription()

  const auth = useAuth()

  const hasError = ref(false)
  const inEdit = ref(false)

  const profileInitial = {
    value: {
      did: 'did:error:??????????????',
      handle: '',
      displayName: '',
      avatar: '',
      banner: '',
      description: '',
      followersCount: 0,
      followsCount: 0,
      postsCount: 0,
      indexedAt: '',
      viewer: { muted: false, blockedBy: false },
      labels: [],
    },
  }

  const profile = ref(profileInitial)

  const definedLabels = []

  // Each loading state
  const loadState = ref({
    profile: true,
    update: true,
  })

  const alerts = ref({ error: false, message: '' })
  const processing = ref(false)


  onMounted(async () => {
    initPopovers()
    const agent = auth.getAgent()
    if (!auth.isLoggedIn()) {
      try {
        await auth.restoreSession()

      } catch (err) {
        // Back to current page
        navi.setNext(route.name)
        router.push({ path: SIGNIN_URL })
        return
      }
    }
    try {

      // load profile
      await loadProfile()

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
      navi.setNext(route.name)
      router.push({ path: SIGNIN_URL })
    }
  })


  const loadProfile = async () => {
    // Clear errors
    alerts.value.error = false
    alerts.value.message = ''

    profile.value = profileInitial
    hasError.value = false
    loadState.value = { profile: false, update: false }

    try {
      const result = await auth.getProfile()
      profile.value = result
      description.value = profile.value.description ?? ''
      labels.value = profile.value.labels
        ? profile.value.labels.map(label => { return label.val })
        : []

    } catch (err) {
      if (isDev()) console.error(err)
      hasError.value = true
      profile.value = Object.assign(profileInitial, {
        did: auth.getDid() ?? 'did:error:unknown',
        displayName: auth.getHandle() ?? 'Error: Unknown',
      })
      if (err.message == 'Not Found') {
        alerts.value.error = true
        alerts.value.message = 'Profile not found.'
      } else {
        alerts.value.error = true
        alerts.value.message = 'Failed to load profile.'
      }

      throw err
    } finally {
      loadState.value.profile = true
      loadState.value.update = true
    }
  }


  const editLabel = async () => {
    try {
      if (inEdit.value
        && (!isEqualArray(profile.value.labels.map(label => { return label.val }), labels.value)
          || profile.value.description != description.value)) {
        await saveProfile()
        alerts.value.error = false
        inEdit.value = false
      } else
        inEdit.value = !inEdit.value
    } catch (err) {
      console.error(err)
      inEdit.value = true
      alerts.value.error = true
      alerts.value.message = err.message ?? 'Failed to save changes.'
    } finally {
      loadState.value.update = true
    }
  }

  const saveProfile = async () => {
    if (isDev()) {
      console.info('saveProfile')
    }
    loadState.value.update = false

    if (labels.value.length > 10) {
      throw new Error('You can only have up to 10 labels.')
    }

    if (confirm('Do you want to save changes?')) {
      const lexProf = (await getProfileLex(profile.value.did))
      const prof = lexProf.value
      if (isDev()) console.log(prof)

      if (labels.value.length > 0) {
        const invalidLabels = labels.value.filter(label => {
          return ['\\','"',"'"].includes(label)
        })
        if (invalidLabels.length > 0) {
          throw new Error(`Invalid labels: ${invalidLabels.join(', ')}`)
        }
      }

      const labelValues = labels.value.map((label) => ({
        $type: 'com.atproto.label.defs#selfLabel',
        val: label
      }))
      const update = {
        repo: profile.value.handle,
        did: profile.value.did,
        collection: 'app.bsky.actor.profile',
        record: {
          description: description.value,
          displayName: prof.displayName,
          avatar: prof.avatar,
          banner: prof.banner,
          labels: {
            $type: 'com.atproto.label.defs#selfLabels',
            values: labelValues,
          },
        },
        rkey: 'self'
      }
      if (isDev()) console.log('saveProfile()::update', update)

      const res = await auth.getAgent().api.com.atproto.repo.putRecord(update)
      if (isDev()) console.log('saveProfile()::res', res)
      // Refresh profile
      const result = await auth.getProfile()
      profile.value = result
      description.value = profile.value.description ?? ''
      labels.value = profile.value.labels
        ? profile.value.labels.map(label => { return label.val })
        : []
      // Reset edit state
      inEdit.value = false
    }
  }



</script>

<style scoped>
  .at-handle::before {
    content: '@';
  }
</style>
