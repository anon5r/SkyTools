<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-3xl">
      <ClientOnly>
        <div
          class="my-4 flex flex-row justify-between items-center bg-gray-200 dark:bg-slate-700 rounded-md max-w-lg">
          <div class="w-full p-2">
            <input
              class="bg-transparent rounded-md w-full text-gray-700 dark:text-slate-200"
              v-model="id"
              @focusout="focusout"
              @keyup.enter="lookupEvent"
              placeholder="Enter a handle or DID" />
          </div>
          <div class="p-2">
            <button
              class="bg-gray-400 dark:bg-slate-800 text-white dark:text-slate-300 rounded-md px-2 py-1"
              @click.prevent="lookupEvent">
              Lookup
            </button>
          </div>
        </div>

        <div class="text-gray-900 dark:text-slate-100">
          <div class="flex items-center">
            <div class="inline-flex items-center mr-3">
              <!-- Avatar -->
              <a
                v-if="!hasError && loadState.avatarURL"
                :href="`${config.bskyAppURL}/profile/${userinfo.details.handle}`">
                <Avatar
                  rounded
                  bordered
                  size="lg"
                  :img="loadState.avatarURL ? userinfo.avatarURL : ''"
                  :alt="loadState.details ? userinfo.details.handle : ''"
                  class="m-2 min-w-max" />
              </a>
              <div v-else-if="!loadState.avatarURL" role="status">
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
                  userinfo.profile?.value?.displayName ||
                  userinfo.details.handle ||
                  'None')
                }}
              </h2>
              <div
                class="text-sm font-semibold text-gray-500 dark:text-slate-500">
                <!-- Handle -->
                <a
                  v-if="loadState.details"
                  :href="`${config.bskyAppURL}/profile/${userinfo.details.handle}`"
                  :class="{ 'line-through': hasError }"
                  class="before:content-['@']">
                  {{ userinfo.details.handle || 'none.example' }}
                </a>
                <span v-else>loading...</span>
              </div>
              <div
                class="text-sm sm:text-xs truncate font-mono sm:font-thin text-gray-400 dark:text-slate-500">
                <!-- DID -->
                {{ loadState.details ? userinfo.details.did : 'loading...' }}
              </div>
            </div>
          </div>

          <p class="m-4 min-w-strech whitespace-pre-line">
            {{ loadState.profile ? userinfo.profile.value?.description : '' }}
          </p>
        </div>

        <div class="pt-4">
          <tabs v-model="activeTab" class="p-5">
            <tab name="posts" title="Posts" id="posts">
              <div v-if="!loadState.posts" class="flex">
                <div role="status">
                  <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
                Loading...
              </div>
              <!-- Posts -->
              <div v-else-if="userinfo.posts.length > 0">
                <div v-for="record of userinfo.posts" :key="record.cid">
                  <PostList
                    :config="config"
                    :did="userinfo.details.did"
                    :handle="userinfo.details.handle"
                    :avatar_url="userinfo.avatarURL ?? 'about:blank'"
                    :display_name="
                      userinfo.profile
                        ? userinfo.profile.value.displayName
                        : userinfo.details.handle
                    "
                    :post="toRaw(record)"></PostList>
                </div>
              </div>
              <div v-else>There are no posts.</div>
            </tab>

            <tab name="following" title="Following" id="following">
              <div v-if="!loadState.following" class="flex">
                <div role="status">
                  <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
                Loading...
              </div>
              <!-- Following -->
              <div v-else-if="userinfo.following.length > 0">
                <ul>
                  <li v-for="record of userinfo.following" :key="record.cid">
                    <UserField
                      :did="record.value.subject"
                      :handle="record.handle"
                      :profile="record.profile"
                      @lookup="lookup" />
                  </li>
                </ul>
              </div>
              <div v-else>No one follows</div>
            </tab>

            <!-- <tab name="follower" title="Follower" id="followers">
              <div v-if="!loadState.followet" class="flex">
                <div role="status">
                  <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
                Loading...
              </div>
            < !-- Followers -- >
            <div v-if="userinfo.followers.length > 0">
              <ul>
                <li v-for="record of userinfo.followers" :key="record.cid">
                  <UserField
                    :did="record.value.subject"
                    :handle="record.handle"
                    :profile="record.profile"
                    @lookup="lookup" />
                </li>
              </ul>
            </div>
            <div v-else>No followers</div>
          </tab> -->

            <tab name="like" title="Like" id="like">
              <div v-if="!loadState.like" class="flex">
                <div role="status">
                  <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
                Loading...
              </div>
              <!-- Like -->
              <div v-else-if="userinfo.like.length > 0">
                <ul>
                  <li v-for="record of userinfo.like" :key="record.cid">
                    <PostList
                      :appURL="config.bskyAppURL"
                      :did="record.did"
                      :handle="record.handle"
                      :avatar_url="record.avatarURL"
                      :display_name="
                        record.profile
                          ? record.profile.value.displayName
                          : record.handle"
                      :post="record.post"
                      @lookup="lookup"></PostList>
                  </li>
                </ul>
              </div>
              <div v-else>There are no liked posts.</div>
            </tab>

            <tab name="blocks" title="Blocks" id="blocks">
              <div v-if="!loadState.blocks" class="flex">
                <div role="status">
                  <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
                Loading...
              </div>
                <!-- Block -->
              <div v-else-if="userinfo.blocks && userinfo.blocks.length > 0">
                <ul>
                  {{ record }}
                  <li v-for="record of userinfo.blocks" :key="record.cid">
                    <UserField
                      :did="record.value.subject"
                      :handle="record.handle"
                      :profile="record.profile"
                      @lookup="lookup" />
                  </li>
                </ul>
              </div>
              <div v-else>No blocking anyone.</div>
            </tab>
            <tab name="mute" title="Mute" id="mute" :disabled="true">
              Muting list here...
            </tab>
          </tabs>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { useAppConfig } from 'nuxt/app'
  import { ref, watch, onMounted, toRaw } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Avatar, Tabs, Tab } from 'flowbite-vue'
  import { isDev } from '@/utils/helpers'
  import * as lexicons from '@/utils/lexicons'

  const activeTab = ref('posts')

  const route = useRoute()
  const router = useRouter()
  const config = useAppConfig()
  const id = ref(route.query.id || '')

  watch(
    () => route.query.id,
    newId => {
      id.value = newId || ''
    }
  )

  const hasError = ref(false)

  lexicons.setConfig(toRaw(config))

  const userinfoInitial = {
    details: {},
    profile: {},
    avatarURL: '',
    posts: [],
    following: [],
    followers: [],
    like: [],
    blocks: [],
    mute: [],
  }


  const userinfo = ref(userinfoInitial)

  const loadState = ref({
    details: true,
    profile: true,
    avatarURL: true,
    posts: true,
    following: true,
    followers: true,
    like: true,
    blocks: true,
    mute: true,
  })

  onMounted(async () => {
    if (route.query.id) {
      await lookup()
    }
  })

  const focusout = () => {
    id.value = lexicons.formatIdentifier(id.value)
  }

  const lookupEvent = async () => {
    await lookup()
  }

  const lookup = async identifier => {
    userinfo.value = userinfoInitial
    hasError.value = false
    Object.keys(loadState.value).forEach(key => {
      loadState.value[key] = false
    })

    if (!identifier) {
      identifier = lexicons.formatIdentifier(id.value)
    }
    id.value = identifier
    if (route.query.id !== identifier)
      router.push({ query: { id: identifier } })

    activeTab.value = 'posts'

    try {
      await getDetails(identifier)
      try {
        await getProfile(identifier)
      } catch (err) {
        // If the profile has never been updated,
        // it cannot be retrieved from the repository
        console.info('No profile user: ', identifier)
        // Set as dummy
        let profile = {
          value: {
            $type: 'app.bsky.actor.profile',
            avatar: null,
            banner: null,
            description: '',
            displayName: identifier,
          },
        }
        updateUserInfo('profile', profile)
        updateUserInfo('avatarURL', null)
      }

      try {
        const posts = await fetchPosts(identifier, 20)
        updateUserInfo('posts', posts)
      } catch (err) {
        if (isDev()) console.warn(err)
      }

      try {
        const follow = await fetchFollow(identifier, 20)
        updateUserInfo('following', follow)
      } catch (err) {
        if (isDev()) console.warn(err)
      }

      try {
        const like = await fetchLike(identifier, 20)
        updateUserInfo('like', like)
      } catch (err) {
          if (isDev()) console.warn(err)
      }

      try {
        const blocks = await fetchBlocks(identifier, 30)
        updateUserInfo('blocks', blocks)
      } catch (err) {
        if (isDev()) console.warn(err)
      }

      if (isDev()) console.log('UserInfo = ', toRaw(userinfo))
    } catch (err) {
      if (isDev()) console.error(err)
      hasError.value = true
      updateUserInfo('avatarURL', null)
      updateUserInfo('posts', [])
      updateUserInfo('following', [])
      updateUserInfo('followers', [])
      updateUserInfo('like', [])
      updateUserInfo('blocks', [])
      updateUserInfo('mute', [])
      updateUserInfo('profile', { value: { displayName: 'Error: Unknown' } })
      if (id.value.startsWith('did:')) {
        userinfo.value.details = {
          handle: 'unknown',
          did: id.value,
        }
      } else {
        userinfo.value.details = {
          handle: id.value,
          did: 'error:unknown:uknown',
        }
      }
      if (axios.isAxiosError(err)) {
        if (err.response.status === 400) {
          if (err.response.data.message) {
            userinfo.value.profile.description = err.response.data.message
          }
        }
      }
    }
  }

  /**
   * update user datum
   * @param {string} item
   * @param {any} value
   */
  const updateUserInfo = (item, value) => {
    if (isDev()) console.log('[updateUserInfo] ::', item, ' = ', value)
    userinfo.value[item] = value
    loadState.value[item] = true
  }

  /**
   * Get identifier details
   * @param {string} id handle or DID
   */
  const getDetails = async id => {
    const details = await lexicons.describeRepo(id)
    updateUserInfo('details', details)
  }

  const getProfile = async id => {
    const profile = await lexicons.getProfile(id)

    if (profile) {
      updateUserInfo('profile', profile)
      const avatarURL = buildAvatarURL(
        userinfo.value.details.did,
        profile.value
      )
      updateUserInfo('avatarURL', avatarURL)
    }
  }

  /**
   * Build avatar URL
   */
  const buildAvatarURL = (did, profile) => {
    return lexicons.buildAvatarURL(config.cdnPrefix, did, profile)
  }

  /**
   * Fetch posts
   * @param {string} id handle or DID
   * @param {int} limit
   */
  const fetchPosts = async (id, limit = 50) => {
    try {
      const response = await lexicons.listRecords(
        'app.bsky.feed.post',
        id,
        limit
      )

      if (response.success) {
        if (isDev()) console.log('posts = ', response.data)
        return response.data.records
      } else {
        return []
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return [err.message]
      }
      if (isDev()) console.error(err)
      throw new Error('Failed to get posts', err)
    }
  }

  /**
   * Fetch like
   * @param {string} id handle or DID
   * @param {int} limit
   */
  const fetchLike = async (id, limit = 50) => {
    try {
      const response = await lexicons.listRecords(
        'app.bsky.feed.like',
        id,
        limit
      )

      if (response.success) {
        if (isDev()) console.log('app.bsky.feed.like = ', response.data)
        const records = response.data.records.map(async record => {
          const recordUri = lexicons.parseAtUri(record.value.subject.uri)
          let post = {}, removed = false
          try {
            post = await lexicons.getPost(recordUri.did, recordUri.rkey)
          } catch (err) {
            removed = true
            if (isDev()) {
              console.error('fetchLike::post.records')
              console.error(err)
            }
          }

          let profile,
            avatar = null
          try {
            profile = await lexicons.getProfile(recordUri.did)
            avatar = buildAvatarURL(recordUri.did, profile.value)
          } catch (err) {
            console.info('Not set profile: ', recordUri.did)
          }
          const handle = await lexicons.resolveDID(recordUri.did)

          return {
            ...record,
            removed: removed,
            profile: profile,
            did: recordUri.did,
            handle: handle,
            avatarURL: avatar,
            post: post.success ? post.data : { value: {
                createdAt: '1970-01-01 09:00:00Z',
                text: 'The post may have been deleted.',
              }},
          }
        })

        const likeList = await Promise.all(records)
        if (isDev()) console.log('fetchLike = ', likeList)
        return likeList
      } else {
        return []
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return [err.message]
      }
      if (isDev()) console.error(err)
      throw new Error('Failed to get Like feed', err)
    }
  }

  /**
   * Fetch follow
   * @param {string} id handle or DID
   * @param {int} limit
   */
  const fetchFollow = async (id, limit = 50) => {
    try {
      const response = await lexicons.listRecords(
        'app.bsky.graph.follow',
        id,
        limit
      )
      if (response.success) {
        const records = response.data.records.map(async record => {
          let handle = '',
            profile = {}
          try {
            handle = await lexicons.resolveDID(record.value.subject)
            profile = await lexicons.getProfile(record.value.subject)
          } catch (err) {
            // following, but the account has been removed
            console.info('No exit record: ', record.value.subject)
            handle = record.value.subject
            profile = {
              value: {
                displayName: record.value.subject,
                description: '',
                avatar: '',
                banner: null,
              },
            }
          }
          return {
            ...record,
            handle: handle,
            profile: profile,
          }
        })
        const resolvedFollowers = await Promise.all(records)
        if (isDev()) console.log('fetchFollow = ', resolvedFollowers)
        return resolvedFollowers
      } else {
        return []
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return [err.message]
      }
      if (isDev()) console.error(err)
    }
  }


  /**
   * Fetch blocks
   * @param {string} id handle or DID
   * @param {int} limit
   */
  const fetchBlocks = async (id, limit = 50) => {
    try {
      const response = await lexicons.listRecords(
        'app.bsky.graph.block',
        id,
        limit
      )
      if (response.success) {
        //if (isDev()) console.log("fetchBlocks = ", response.data)
        const records = response.data.records.map(async record => {
          let handle = '',
          profile = {}
          try {
            handle = await lexicons.resolveDID(record.value.subject)
            profile = await lexicons.getProfile(record.value.subject)
          } catch (err) {
            // blocked, but the account has been removed
            console.info('No exit record: ', record.value.subject)
            //
            handle = record.value.subject
            profile = {
              value: {
                displayName: record.value.subject,
                description: '',
                avatar: '',
                banner: null,
              },
            }
          }
          return {
            ...record,
            handle: handle,
            profile: profile,
          }
        })
        const resolvedBlocks = await Promise.all(records)
        if (isDev()) console.log('fetchBlocks = ', resolvedBlocks)
        return resolvedBlocks
      } else {
        return []
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return [err.message]
      }
      if (isDev()) console.error(err)
    }
  }
</script>
