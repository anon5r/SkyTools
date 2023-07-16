<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-2xl">
      <div
        class="flex flex-row justify-between items-center bg-gray-200 dark:bg-slate-700 rounded-md max-w-lg">
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
            class="bg-blue-500 dark:bg-blue-700 text-white dark:text-slate-300 rounded-md px-2 py-1"
            @click.prevent="lookupEvent">
            Lookup
          </button>
        </div>
      </div>

      <div
        class="bg-gray-100 dark:bg-slate-700 shadow-md rounded-lg px-3 py-2 border-2"
        v-if="userinfo.profile">
        <!-- Profile -->
        <div class="py-2 px-2">
          <p>
            DisplayName
            <span class="text-sm text-gray-900 dark:text-slate-100">
              {{ userinfo.profile?.value?.displayName || userinfo.details.handle }}
            </span>
          </p>
          <p>
            Handle
            <span class="text-sm text-gray-900 dark:text-slate-100">
              @{{ userinfo.details.handle || route.query.id || 'Loading...' }}
            </span>
          </p>
          <p>
            DID
            <span class="text-sm italic text-gray-300 dark:text-slate-500">
              {{ userinfo.details.did }}
            </span>
          </p>
          <p>
            {{ userinfo.profile.value?.description ?? '' }}
          </p>
        </div>
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
                  :display_name="userinfo.profile.value?.displayName ?? userinfo.details.handle"
                  :post="toRaw(record)"></PostList>
              </div>
            </div>
            <div v-else>What are they posting.</div>
          </tab>


          <tab name="following" title="Following" id="following">
            <!-- Following-->
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
            <div v-else>Follow who you want to see.</div>
          </tab>


          <tab name="follower" title="Follower" id="followers">
            Who would you like to be followed by?
          </tab>
          <tab name="like" title="Like" id="like">
            <!-- Like -->
            <div v-if="userinfo.like.length > 0">
              <ul>
                <li v-for="record of userinfo.like" :key="record.cid">
                  <PostList
                    v-if="record.profile"
                    :appURL="config.bskyAppURL"
                    :did="lexicons.parseAtUri(record.profile.uri).did"
                    :handle="lexicons.resolveDID(lexicons.parseAtUri(record.value.subject.uri).did)"
                    :avatar_url="lexicons.buildAvatarURL(config.bskyService, lexicons.parseAtUri(record.value.subject.uri).did, record.profile)"
                    :display_name="record.profile.value.displayName"
                    :post="toRaw(record)"></PostList>
                </li>
              </ul>
            </div>
            <div v-else>What would you like ?</div>
          </tab>
          <tab name="blocking" title="Blocking" id="blocking" :disabled="true">
            Blocking list here...
          </tab>
          <tab name="mute" title="Mute" id="mute" :disabled="true">
            Muting list here...
          </tab>
        </tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { DateTime } from 'luxon'
  import { useAppConfig } from 'nuxt/app'
  import { ref, onMounted, toRaw } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Avatar, Tabs, Tab } from 'flowbite-vue'
  import { isDev } from '@/utils/helpers'
  import * as lexicons from '@/utils/lexicons'
  import { AppBskyFeedPost, AppBskyActorProfile } from '@atproto/api'

  const activeTab = ref('posts')

  const route = useRoute()
  const router = useRouter()
  const config = useAppConfig()
  const id = ref(route.query?.id || '')

  watch(() => route.query.id, newId => {
    id.value = newId || ''
  })

  const result = ref('')
  // const hasError = ref(false)

  lexicons.setConfig(toRaw(config))

  const userinfo = ref({
    details: {},
    profile: {},
    avatarURL: '',
    posts: [],
    following: [],
    followers: [],
    like: [],
    blocking: [],
    mute: [],
  })

  onMounted(async () => {
    if (route.query.id) {
      await lookup()
    }
  })

  // /** Change pane */
  // const handlePane = async () => {
  //   const tabName = activeTab.value
  //   console.log("ActiveTab = ", tabName)
  //   switch (tabName) {
  //     case 'posts': {
  //       const [feeds] = await Promise.all([fetchPosts(id.value, 20)])
  //       break;
  //     }
  //     case 'following': {
  //       const [feeds] = await Promise.all(fetchFollow(id.value, 20))
  //       break;
  //     }
  //   }
  //   updateUserInfo(tabName, feeds)
  // }

  const focusout = () => {
    id.value = lexicons.formatIdentifier(id.value)
  }

  const lookupEvent = async () => {
    await lookup()
  }

  const lookup = async (identifier) => {
    if (!identifier) {
      identifier = lexicons.formatIdentifier(id.value)
    }
    id.value = identifier
    if (route.query.id !== identifier)
      router.push({ query: { id: identifier } })

    activeTab.value = 'posts'

    await getDetails(identifier)
    try {
      await getProfile(identifier)
    } catch (err) {
      // If the profile has never been updated,
      // it cannot be retrieved from the repository
      console.info('No profile user: ', identifier)
    }

    const posts = await fetchPosts(identifier, 10)
    updateUserInfo('posts', posts)

    const [follow,like] = await Promise.all([
      fetchFollow(identifier, 20),
      fetchLike(identifier, 10)
    ])
console.log('lookup::follow = ', follow)
    updateUserInfo('following', follow)
    updateUserInfo('like', like)


    if (isDev()) console.log('UserInfo = ',toRaw(userinfo))
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
      const avatarURL = buildAvatarURL(userinfo.value.details.did, profile.value)
      updateUserInfo('avatarURL', avatarURL)
    }
  }

  /**
   * Get ID details
   * @param {string} id  handle or DID
   */
  const fetchDetails = async id => {
    try {
      updateUserInfo('details', await lexicons.describeRepo(id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  /**
   * Get user profile
   * @param {string} id DID or handle
   */
  const fetchProfile = async id => {
    const record = await lexicons.getProfile(id)
    updateUserInfo('profile', record)
  }

  /**
   * Build avatar URL
   */
  const buildAvatarURL = (did, profile) => {
    return lexicons.buildAvatarURL(config.bskyService, did, profile)
  }

  /**
   * Fetch posts
   * @param {string} id handle or DID
   * @param {int} limit
   */
  const fetchPosts = async (id, limit = 50) => {
    try {
      const response = await lexicons.listRecords('app.bsky.feed.post', id, limit)

      if (response.success) {
        if (isDev()) console.log("posts = ",response.data)
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
      const response = await lexicons.listRecords('app.bsky.feed.like', id, limit)

      if (response.success) {
        if (isDev()) console.log("app.bsky.feed.like = ", response.data)
        const records = response.data.records.map(async record => {
          const post = await lexicons.getPost(lexicons.parseAtUri(record.value.subject.uri).did, lexicons.parseAtUri(record.value.subject.uri).rkey)
          const profile = await lexicons.getProfile(lexicons.parseAtUri(record.value.subject.uri).did)
          return {
            ...record,
            profile: profile,
            did: lexicons.parseAtUri(record.value.subject.uri).did,
            post: post.success ? post.data : {}
          }
        })

        const likeList = await Promise.all(records);
        if (isDev()) console.log("fetchLike = ", likeList)
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
      const response = await lexicons.listRecords('app.bsky.graph.follow', id, limit)
      if (response.success) {
        const records = response.data.records.map(async record => {
          const handle = await lexicons.resolveDID(record.value.subject)
          const profile = await lexicons.getProfile(record.value.subject)
          return {
            ...record,
            handle: handle,
            profile: profile,
          }
        })
        const resolvedFollowers = await Promise.all(records)
        if (isDev()) console.log("fetchFollow = ", resolvedFollowers)
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
