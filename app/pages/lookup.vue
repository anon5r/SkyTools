<template>
  <div
    class="flex flex-col justify-center md:justify-center items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-2xl">
      <div
        class="flex flex-row justify-between items-center bg-gray-200 dark:bg-slate-700 rounded-md max-w-lg">
        <div class="w-full p-2">
          <input
            class="bg-transparent rounded-md w-full text-gray-700 dark:text-slate-200"
            v-model="handle"
            @focusout="focusout"
            @keyup.enter="lookup"
            placeholder="Enter a handle or DID" />
        </div>
        <div class="p-2">
          <button
            class="bg-blue-500 dark:bg-blue-700 text-white dark:text-slate-300 rounded-md px-2 py-1"
            @click="lookup">
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
              {{ userinfo.profile.displayName }}
            </span>
          </p>
          <p>
            Handle
            <span class="text-sm text-gray-900 dark:text-slate-100">
              @{{ userinfo.details.handle }}
            </span>
          </p>
          <p>
            DID
            <span class="text-sm italic text-gray-300 dark:text-slate-500">
              {{ userinfo.details.did }}
            </span>
          </p>
          <p>
            {{ userinfo.profile.description }}
          </p>
        </div>
      </div>
      <div class="pt-4">
        <tabs v-model="activeTab" class="p-5">
          <tab name="posts" title="Posts" id="posts">
            <!-- Posts -->
            <div v-if="userinfo.posts.length > 0">
              <ul>
                <li v-for="record of userinfo.posts" :key="record.cid">
                  <Avatar
                    rounded
                    :img="`https://cdn.bsky.social/imgproxy/${userinfo.profile.avatar.ref.$link}`" />
                  <a
                    :href="`${config.bskyAppURL}/profile/${handle}/post/${
                      record.uri.replace('at://').split('/')[2]
                    }`"
                    class="text-sm text-gray-500 dark:text-gray-300">
                    {{ DateTime.fromISO(record.value.createdAt).toString() }}
                  </a>
                  {{ record.value.text }}
                  <div v-if="record.value.embed">
                    <div
                      v-if="
                        record.value.embed.$type == 'app.bsky.embed.images'
                      ">
                      <img
                        v-for="img of record.value.embed.images"
                        :key="img.image.ref.$link"
                        :src="`https://cdn.bsky.social/imgproxy/${img.image.ref.$link}`"
                        :alt="img.image.ref.alt"
                        class="h-auto max-w-xs" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else>What are they posting.</div>
          </tab>
          <tab name="following" title="Following" id="following">
            Follow who you want to see.
          </tab>
          <tab name="follower" title="Follower" id="followers">
            Who would you like to be followed by?
          </tab>
          <tab name="like" title="Like" id="like">
            <!-- Like -->
            <div v-if="userinfo.like.length > 0">
              <ul>
                <li v-for="record of userinfo.like" :key="record.cid">
                  <a
                    :href="`${config.bskyAppURL}/profile/${parseAtUri(record.value.subject.uri).did}/post/${parseAtUri(record.value.subject.uri).key}`"
                    class="text-sm text-gray-500 dark:text-gray-300">
                    {{ DateTime.fromISO(record.value.createdAt).toString() }}
                  </a>
                  {{ record.value.subject.cid }}
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
  import axios, { AxiosError } from 'axios'
  import { DateTime } from 'luxon'
  import { useAppConfig } from 'nuxt/app'
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Avatar, Tabs, Tab } from 'flowbite-vue'
  import { isDev, formatIdentifier, resolveDID } from '~/utils'

  const activeTab = ref('posts')

  const route = useRoute()
  const router = useRouter()
  const config = useAppConfig()
  const handle = ref(route.query.handle || '')

  const result = ref('')
  // const hasError = ref(false)

  const userinfo = ref({
    details: {},
    profile: {},
    posts: [],
    following: [],
    followers: [],
    like: [],
    blocking: [],
    mute: [],
  })

  onMounted(() => {
    if (route.query.handle) {
      lookup()
    }
  })

  const focusout = () => {
    handle.value = formatIdentifier(handle.value)
  }

  const lookup = async () => {
    let identifier = formatIdentifier(handle.value)
    handle.value = identifier
    router.push({ query: { handle: identifier } })

    await getDetails(identifier)
    await fetchProfile(identifier)
    await fetchPosts(identifier)
    await fetchLike(identifier)
    console.log(userinfo.value)
  }

  const requestDID = async identifier => {
    try {
      result.value = await resolveDID(identifier)
    } catch (error) {
      if (isDev()) console.error(error)

      result.value = error.message
      if (AxiosError.isAxiosError(error) && error.response.data.message)
        result.value = error.response.data.message
    }
  }
  /**
   * update user datum
   * @param {string} item
   * @param {any} value
   */
  const updateUserInfo = (item, value) => {
    userinfo.value[item] = value
  }

  /**
   * Parsing at-proto-uri
   * @param {string} uri at://did:plc:xxxxxxxxxxxxx/app.bsky.feed.post/abbcde12345
   */
  const parseAtUri = uri => {
    const m = uri.match(
      /^at:\/\/(?<did>did:\w+:(?<identifier>[a-z0-9]+))\/(?<collection>[\w.-]+)\/(?<key>[a-z0-9]+)$/
    )
    if (m && m.groups) return m.groups

    throw new Error('Invalid URI format')
  }
  /**
   * Parsing DID
   * @param {string} did did:plc:xxxxxxxxxxxxxx, did:web:xxxxxxxxxxxxxx
   */
  const parseDID = did => {
    const m = did.match(/^did:(?<method>\w+):(?<identifier>[a-z0-9]+)$/)
    if (m && m.groups) return m.groups

    throw new Error('Invalid URI format')
  }

  /**
   * Get identifier details
   * @param {string} id handle or DID
   */
  const getDetails = async id => {
    try {
      const params = new URLSearchParams()
      params.append('repo', id)
      const response = await axios({
        url: `${config.bskyService}/xrpc/com.atproto.repo.describeRepo`,
        method: 'GET',
        params: params,
      })

      if (response.data) {
        console.log(response.data)

        updateUserInfo('details', response.data)
        return response.data
      }
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
    const record = await getRecord('app.bsky.actor.profile', id, 'self')
    updateUserInfo('profile', record.value)
  }

  /**
   * Fetch posts
   * @param {string} id handle or DID
   * @param {int} limit
   */
  const fetchPosts = async (id, limit = 50) => {
    try {
      const response = await listRecords('app.bsky.feed.post', id, limit)

      if (isDev()) console.log(response)
      if (response) {
        updateUserInfo('posts', response.records)
      } else {
        updateUserInfo('posts', [])
      }
    } catch (err) {
      if (AxiosError.isAxiosError(err)) {
        updateUserInfo('posts', [])
      }
      if (isDev()) console.error(err)
    }
  }

  /**
   * Fetch posts
   * @param string collection
   * @param string repo
   * @param string recordKey
   * @return object
   */
  const getRecord = async (collection, repo, recordKey) => {
    try {
      const params = new URLSearchParams()
      params.append('collection', collection)
      params.append('repo', repo)
      params.append('rkey', recordKey)
      const response = await axios({
        url: `${config.bskyService}/xrpc/com.atproto.repo.getRecord`,
        method: 'GET',
        params: params,
      })

      if (response.data) {
        console.log(response.data)
        return response.data
      }
      return {}
    } catch (err) {
      if (isDev()) console.error(err)
      throw new Error(err.message, err)
    }
  }

  /**
   * Get records as list
   * @param {string} collection
   * @param {string} identifier
   * @param {int} limit
   */
  const listRecords = async (collection, identifier, limit = 50) => {
    try {
      const params = new URLSearchParams()
      params.append('collection', collection)
      params.append('repo', identifier)
      params.append('limit', limit)
      const response = await axios({
        url: `${config.bskyService}/xrpc/com.atproto.repo.listRecords`,
        method: 'GET',
        params: params,
      })

      if (response.data) return response.data
    } catch (err) {
      if (isDev()) console.error(err)
      throw new Error(err.message, err)
    }
  }

  /**
   * Get individual post
   * @param {*} identity
   * @param {*} recordKey
   */
  const getPost = async (identity, recordKey) => {
    try {
      return await getRecord('app.bsky.feed.post', identity, recordKey)
    } catch (err) {
      if (isDev()) console.error(err)
      return err.message
    }
  }
  /**
   * Fetch like
   * @param {string} id handle or DID
   * @param {int} limit
   */
  const fetchLike = async (id, limit = 50) => {
    try {
      const response = await listRecords('app.bsky.feed.like', id, limit)

      if (response) {
        console.log(response)
        updateUserInfo('like', response.records)
      } else {
        updateUserInfo('like', [])
      }
    } catch (err) {
      if (AxiosError.isAxiosError(err)) {
        updateUserInfo('like', [])
      }
      if (isDev()) console.error(err)
    }
  }
</script>
