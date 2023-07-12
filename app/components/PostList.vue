<template>
    <article class="p-6 mb-6 text-base bg-white rounded-lg dark:bg-slate-800">
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center">
          <p class="inline-flex items-center mr-3 text-md font-bold text-gray-900 dark:text-white">
            <!-- Avatar -->
            <Avatar
              rounded
              :img="props.avatar_url"
              :alt="props.handle"
              class="mr-3" />
            <!-- DisplayName -->
            {{ props.display_name }}
          </p>
          <p class="px-4 text-xs font-mono text-gray-500 dark:text-slate-500">@{{ props.handle }}</p>
          <p class="text-sm text-gray-600 dark:text-slate-400">
            <a :href="`${config.bskyAppURL}/profile/${props.handle}/post/${post.cid}`">
              <time pubdate :datetime="post.value.createdAt"
                  :title="post.value.createdAt"
                  class="text-sm font-light">{{DateTime.fromISO(post.value.createdAt).toString()}}</time>
            </a>
          </p>
        </div>
        <button :id="`dropdownActionButton-${post.cid}`" :data-dropdown-toggle="`dropdownAction-${post.cid}`"
            class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-gray-600"
            type="button">
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
                </path>
            </svg>
            <span class="sr-only">Action</span>
        </button>
        <!-- Dropdown menu -->
        <div :id="`dropdownAction-${post.cid}`"
            class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownMenuIconHorizontalButton">
                <li>
                    <a href="#"
                        class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mute</a>
                </li>
                <li>
                    <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                </li>
            </ul>
        </div>
      </div>
      <div class="text-gray-500 dark:text-gray-400">
        <!-- has reply ? -->
        <p v-if="post.value.reply">
          {{ getReplyLink(post.value.reply) }}
        </p>
        <!-- Post message -->
        {{ post.value.text }}
        <div v-if="post.value.embed">
          <!-- Attached images -->
          <EmbedImage :did="did" :embed="post.value.embed" />
        </div>
      </div>
    </article>
</template>

<script setup>
  import { Avatar, Tabs, Tab } from 'flowbite-vue'
  import { defineProps } from 'vue'
  import { DateTime } from 'luxon'
  import { ComAtprotoRepoGetRecord } from '@atproto/api'
  import { useAppConfig } from 'nuxt/app'

  const config = useAppConfig()

  const props = defineProps({
    did: {
      type: String,
      required: true,
      default: 'did:unknown:unknown'
    },
    handle: {
      type: String,
      required: true,
      default: 'sample.example.test'
    },
    display_name: {
      type: String,
      required: true,
      default: 'Nobody'
    },
    avatar_url: {
      type: String,
      required: false,
      default: undefined
    },
    post: {
      // type: ComAtprotoRepoGetRecord.OutputSchema,
      type: Object,
      default: () => ({})
    },
  })

  const getReplyLink = async (reply) => {
    const identity = lexicons.formatIdentifier(reply.uri)
    lexicons.getPost({
      identity:
      cid: reply.cid
    })
  }

</script>
