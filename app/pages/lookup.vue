<template>
  <div
    class="flex flex-col justify-center md:justify-center items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-2xl">

      <div class="flex flex-row justify-between items-center bg-gray-100 dark:bg-slate-700 rounded-md max-w-lg">
        <div class="w-full p-2">
          <input
            class="bg-transparent rounded-md w-full text-gray-700 dark:text-slate-200"
            v-model="handle"
            @focusout="focusout"
            @keyup.enter="requestDID"
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
        v-if="result">
        <div class="block text-gray-700 dark:text-slate-300 text-lg font-semibold py-2 px-2">
          <span v-if="result.startsWith('did:')">DID</span>
          <span v-else>Handle</span>
        </div>
        <div
          class="py-2 px-2" :class="{
            'text-red-600 dark:text-red-400': hasError,
            'text-gray-600 dark:text-slate-400': !hasError,
          }">
          {{ result }}
        </div>
      </div>
      <div class="pt-4">
        <tabs v-model="activeTab" class="p-5">
          <tab name="posts" title="Posts" id="posts">
            <div v-if="userinfo.posts.length > 0">
              <ul>
                <li v-for="record of userinfo.posts" :key="record.cid">
                  <a :href="`${config.bskyAppURL}/profile/${handle}/post/${record.uri.replace('at://').split('/')[2]}`" class="text-sm text-gray-500 dark:text-gray-300">
                    {{ DateTime.fromISO(record.value.createdAt).toString() }}
                  </a>
                  {{ record.value.text }}

                </li>
              </ul>
            </div>
            <div v-else>Timeline</div>
          </tab>
          <tab name="following" title="Following" id="following">
            Following
          </tab>
          <tab name="follower" title="Follower" id="followers">
            Followers
          </tab>
          <tab name="likes" title="Likes" id="likes">
            <div v-if="userinfo.likes.length > 0">
              <ul>
                <li v-for="record of userinfo.likes" :key="record.subject">
                  <a :href="`${config.bskyAppURL}/profile/${resolveHandle(record.subject)}/post/${record.uri.replace('at://').split('/')[2]}`" class="text-sm text-gray-500 dark:text-gray-300">
                    {{ DateTime.fromISO(record.value.createdAt).toString() }}
                  </a>
                  {{ record.value.text }}

                </li>
              </ul>
            </div>
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
import axios, { Axios, AxiosError } from 'axios'
import { DateTime } from 'luxon'
import { useAppConfig } from 'nuxt/app'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, Tab } from 'flowbite-vue'
import { isDev, formatIdentifier, resolveDID } from '~/utils'
import {
  AppBskyGraphFollow,
  AppBskyGraphGetFollowers,
  AppBskyFeedGetPosts,
  AppBskyGraphGetBlocks,
  AppBskyGraphGetMutes,
  BskyAgent,
  AppBskyGraphGetLists,
  AppBskyFeedGetActorFeeds,
 } from '@atproto/api'

const activeTab = ref('posts')

const route = useRoute()
const router = useRouter()
const config = useAppConfig()
const handle = ref(route.query.handle || '')

const result = ref('')
const hasError = ref(false)

const userinfo = ref({
  posts: [],
  following: [],
  followers: [],
  likes: [],
  blocking: [],
  mute: []
})

const focusout = () => {
    handle.value = formatIdentifier(handle.value)
}

const lookup = async () => {
  let identifier = formatIdentifier(handle.value)
  handle.value = identifier
  router.push({ query: { handle: identifier } })

  await requestDID(identifier)
  await fetchPost(identifier)
  await fetchLikes(identifier)
}


const requestDID = async (identifier) => {
  try {
    result.value = await resolveDID(identifier)
    hasError.value = false
  } catch (error) {
    if (isDev()) console.error(error)
    hasError.value = true
    result.value = error.message
    if (AxiosError.isAxiosError(error) && error.response.data.message)
      result.value = error.response.data.message
  }
}
// update user datum
const updateUserInfo = (item, value) => {
  userinfo.value[item] = value
}

// Fetch posts
const fetchPost = async (id, limit = 50) => {
  try {
    const params = new URLSearchParams
    params.append('collection', 'app.bsky.feed.post')
    params.append('repo', id)
    params.append('limit', limit)
    const response = await axios({
      url: `${config.bskyService}/xrpc/com.atproto.repo.listRecords`,
      method: 'GET',
      params: params
    })

    if (response.data) {
      console.log(response.data)
      updateUserInfo('posts', response.data.records)
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
// Fetch likes
const fetchLikes = async (id, limit = 50) => {
  try {
    const params = new URLSearchParams
    params.append('collection', 'app.bsky.feed.like')
    params.append('repo', id)
    params.append('limit', limit)
    const response = await axios({
      url: `${config.bskyService}/xrpc/com.atproto.repo.listRecords`,
      method: 'GET',
      params: params
    })

    if (response.data) {
      console.log(response.data)
      updateUserInfo('likes', response.data.records)
    } else {
      updateUserInfo('likes', [])
    }
  } catch (err) {
    if (AxiosError.isAxiosError(err)) {
      updateUserInfo('likes', [])
    }
    if (isDev()) console.error(err)
  }
}
</script>
