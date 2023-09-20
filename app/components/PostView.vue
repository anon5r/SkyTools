<template>
  <article
    class="p-4 my-5 text-base shadow-md bg-white rounded-lg dark:bg-slate-800">
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <div
          class="inline-flex items-center mr-1 text-md font-bold text-gray-900 dark:text-white">
          <!-- Avatar -->
          <NuxtLink :to="getPermaLink(props.handle)" @click.prevent="clickProfile">
            <Avatar
              rounded
              :img="props.avatar_url"
              :alt="props.handle"
              class="min-w-max avatar-object-cover" />
          </NuxtLink>
        </div>
        <div class="max-w-xs truncate">
          <!-- DisplayName -->
          <NuxtLink :href="getPermaLink(props.handle)" @click.prevent="clickProfile">
            {{ props.display_name }}
          </NuxtLink>
          <div
            class="at-handle text-xs font-mono truncate text-gray-500 dark:text-slate-500">
            <!-- Handle -->
            <NuxtLink :href="getPermaLink(props.handle)" @click.prevent="clickProfile">
              {{ props.handle }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="text-sm text-right text-gray-600 dark:text-slate-400">
        <div class="pt-1">
          <NuxtLink v-if="!props.removed" :to="postURL">
            <!-- Created datetime -->
            <time
              v-if="!props.removed"
              pubdate
              :datetime="props.post.value.createdAt"
              :title="DateTime.fromISO(props.post.value.createdAt).toString()"
              class="text-sm font-light">
              <!-- Display time as relative -->
              {{
                DateTime.fromISO(props.post.value.createdAt).toRelative({
                  style: 'short',
                })
              }}
            </time>
          </NuxtLink>
          <time v-else>--------</time>
        </div>
      </div>
    </div>
    <div class="pl-3 pr-4 text-gray-500 dark:text-gray-400">
      <!-- has reply ? -->
      <div v-if="!props.removed">
        <AtHandleLink
          v-if="props.post.value.reply"
          :aturi="props.post.value.reply.parent.uri"
          class="inline-block font-light text-xs text-gray-600 hover:text-white border border-gray-700 hover:bg-gray-800 focus:ring-2 focus:outline-none focus:ring-blue-300 rounded-lg px-3 py-1 text-center mr-1 mb-1 dark:border-slate-500 dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-500 dark:focus:ring-slate-800">
          <FontAwesomeIcon :icon="['fas', 'reply']" />
          Reply
        </AtHandleLink>
      </div>
      <!-- Post message -->
      <div v-if="!props.removed" class="break-words whitespace-pre-line">
        <div class="text-sm">

          <!-- <RitchText :post="props.post" /> -->
          {{ props.post.value.text }}
        </div>
      </div>
      <div v-else class="italic">This post may have been removed.</div>
      <div v-if="!props.removed && props.post.value.embed">
        <KeepAlive>
          <Suspense>
            <!-- Embeded (image, record...) -->
            <PostEmbed :did="did" :embed="props.post.value.embed" />
            <template #fallback>
              <div class="flex justify-center">
                <div class="w-8 h-8 border border-gray-300 rounded-full animate-spin"></div>
              </div>
            </template>
          </Suspense>
        </KeepAlive>
      </div>
    </div>

    <div class="flex justify-end items-end">
      <div v-if="!props.removed" class="mt-3 inline-box">
        <!-- Labels -->
        <ul v-if="props.post.value.labels?.values" class="inline-block">
          <li
            v-if="props.post.value.labels?.values.length > 0"
            v-for="(label, index) in props.post.value.labels?.values"
            :key="index"
            class="inline-block items-center px-1 py-0.5 mr-2 text-xs font-medium rounded"
            :class="
            label.val === '!warn'
            ? `text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300`
            : label.val === 'porn' || label.val === 'nsfw'
            ? `text-pink-500 bg-pink-100 dark:bg-pink-700 dark:text-pink-300`
            : label.val === 'spam'
            ? `text-zinc-800 bg-zinc-100 dark:bg-zin-900 dark:text-zinc-300`
            : `text-indigo-800 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300`
            ">
              <FontAwesomeIcon :icon="['fas', 'tag']" class="mr-1" size="xs" />{{ label.val }}
          </li>
        </ul>
      </div>
      <div
        v-if="!props.removed && props.post.value.langs"
        class="justify-start items-baseline text-xs text-right text-gray-400 dark:text-gray-700">
        Lang: {{ props.post.value.langs.join(',') }}
      </div>
    </div>
  </article>
</template>

<script setup>
  import { Avatar } from 'flowbite-vue'
  import { defineProps, defineEmits, onMounted, ref } from 'vue'
  import { DateTime } from 'luxon'
  import { useAppConfig } from 'nuxt/app'
  import * as lexicons from '@/utils/lexicons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const config = useAppConfig()

  const props = defineProps({
    did: {
      type: String,
      required: true,
      default: 'did:unknown:unknown',
    },
    handle: {
      type: String,
      required: true,
      default: 'sample.example.test',
    },
    display_name: {
      type: String,
      required: true,
      default: 'Nobody',
    },
    avatar_url: {
      type: String,
      required: false,
      default: undefined,
    },
    post: {
      // type: ComAtprotoRepoGetRecord.OutputSchema,
      type: Object,
      default: () => ({}),
    },
    removed: Boolean,
  })

  const emits = defineEmits(['showProfile'])

  const postURL = ref('#')

  onMounted(async () => {
    // postURL.value = await lexicons.buildPostURL(
    //   config.bskyAppURL,
    //   props.post.uri,
    //   props.handle
    // )
    const atUri = lexicons.parseAtUri(props.post.uri)
    postURL.value = getPermaLink(props.handle ?? atUri.did, atUri.rkey)
  })

  /**
   * @return void
   */
  const clickProfile = () => {
    emits('showProfile', props.handle)
  }

  /**
   *
   * @param {string} handleOrDid
   * @param {string} postID
   * @return {string} path or URL
   */
  const getPermaLink = (handleOrDid, postID) => {
    if (postID)
      return `${config.bskyAppURL}/profile/${handleOrDid}/post/${postID}`
    return `/profile/${handleOrDid}`
  }

</script>

<style scoped>
  .at-handle::before {
    content: '@';
  }
  .avatar-object-cover :deep(img) {
    @apply object-cover;
  }

  .post-text a:link {
    @apply text-blue-500 dark:text-blue-400;
  }
  .post-text a:hover {
    @apply text-blue-400 dark:text-blue-500;
  }
</style>
