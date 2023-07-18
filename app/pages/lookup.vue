<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-2xl">
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
              v-if="!hasError"
              :href="`${config.bskyAppURL}/profile/${userinfo.details.handle}`">
              <Avatar
                rounded
                bordered
                size="lg"
                :img="userinfo.avatarURL"
                :alt="userinfo.details.handle"
                class="m-2 min-w-max" />
            </a>
            <div v-else>
              <Avatar rounded bordered size="lg" class="m-2 min-w-max" />
            </div>
          </div>
          <div>
            <h2 class="text-3xl" :class="{ 'text-red-600': hasError }">
              <!-- Disply name -->
              {{
                userinfo.profile?.value?.displayName ||
                userinfo.details.handle ||
                'None'
              }}
            </h2>
            <div
              class="text-sm font-semibold text-gray-500 dark:text-slate-500">
              <!-- Handle -->
              <a
                :href="`${config.bskyAppURL}/profile/${userinfo.details.handle}`"
                :class="{ 'line-through': hasError }"
                class="before:content-['@']">
                {{ userinfo.details.handle || 'none.example' }}
              </a>
            </div>
            <div
              class="text-sm sm:text-xs font-mono sm:font-thin text-gray-400 dark:text-slate-500">
              <!-- DID -->
              {{ userinfo.details.did }}
            </div>
          </div>
        </div>

        <p class="m-4 min-w-strech whitespace-pre-line">
          {{ userinfo.profile.value?.description ?? '' }}
        </p>
      </div>

      <div class="pt-4">
        <tabs v-model="activeTab" class="p-5">
          <tab name="posts" title="Posts" id="posts">
            <!-- Posts -->
            <div v-if="userinfo.posts.length > 0">
              <div v-for="record of userinfo.posts" :key="record.cid">
                <PostList
                  :config="config"
                  :did="userinfo.details.did"
                  :handle="userinfo.details.handle"
                  :avatar_url="userinfo.avatarURL ?? 'about:blank'"
                  :display_name="userinfo.profile
                    ? userinfo.profile.value.displayName
                    : userinfo.details.handle"
                  :post="toRaw(record)"></PostList>
              </div>
            </div>
            <div v-else>There are no posts.</div>
          </tab>

          <tab name="following" title="Following" id="following">
            <!-- Following -->
            <div v-if="userinfo.following.length > 0">
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
            <!-- Like -->
            <div v-if="userinfo.like.length > 0">
              <ul>
                <li v-for="record of userinfo.like" :key="record.cid">
                  <PostList
                    :appURL="config.bskyAppURL"
                    :did="record.did"
                    :handle="record.handle"
                    :avatar_url="record.avatarURL"
                    :display_name="record.profile
                      ? record.profile.value.displayName
                      : record.handle"
                    :post="record.post"
                    @lookup="lookup"></PostList>
                </li>
              </ul>
            </div>
            <div v-else>There are no liked posts.</div>
          </tab>
          <!--
          <tab name="blocking" title="Blocking" id="blocking" :disabled="true">
            Blocking list here...
          </tab>
          <tab name="mute" title="Mute" id="mute" :disabled="true">
            Muting list here...
          </tab> -->
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
    block: [],
    mute: [],
  }

  const userinfo = ref(userinfoInitial)

  onMounted(async () => {
    if (route.query.id) {
      await lookup()
    }
  })

  computed

  const focusout = () => {
    id.value = lexicons.formatIdentifier(id.value)
  }

  const lookupEvent = async () => {
    await lookup()
  }

  const lookup = async identifier => {
    userinfo.value = userinfoInitial
    hasError.value = false
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
          }
        }
        updateUserInfo('profile', profile)
        updateUserInfo('avatarURL', null)
      }

      try {
        const posts = await fetchPosts(identifier, 20)
        updateUserInfo('posts', posts)
      } catch (err) {
        if (isDev()) console.error(err)
      }

      try {
        const follow = await fetchFollow(identifier, 20)
        updateUserInfo('following', follow)
      } catch (err) {
        if (isDev()) console.error(err)
      }

      try {
        const like = await fetchLike(identifier, 20)
        updateUserInfo('like', like)
      } catch (err) {
        if (isDev()) console.error(err)
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
      updateUserInfo('block', [])
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
          let post
          try {
            post = await lexicons.getPost(recordUri.did, recordUri.rkey)
          } catch (err) {
            post = {
              value: {
                createdAt: '----------',
                text: 'The post may have been deleted.',
              },
            }
          }

          let profile, avatar = null
          try {
            profile = await lexicons.getProfile(recordUri.did)
            avatar = buildAvatarURL(recordUri.did, profile.value)
          } catch (err) {
            console.info('Not set profile: ', recordUri.did)
          }
          const handle = await lexicons.resolveDID(recordUri.did)

          return {
            ...record,
            profile: profile,
            did: recordUri.did,
            handle: handle,
            avatarURL: avatar,
            post: post.success ? post.data : {},
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
          let handle = '', profile = {}
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
                banner: null
              }
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
</script>
