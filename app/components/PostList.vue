<template>
  <article class="p-6 mb-6 text-base bg-white rounded-lg dark:bg-slate-800">
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <p
          class="inline-flex items-center mr-3 text-md font-bold text-gray-900 dark:text-white">
          <!-- Avatar -->
          <Avatar
            rounded
            :img="props.avatar_url"
            :alt="props.handle"
            class="mr-3" />
          <!-- DisplayName -->
          {{ props.display_name }}
        </p>
        <p class="px-4 text-xs font-mono text-gray-500 dark:text-slate-500">
          @{{ props.handle }}
        </p>
        <p class="text-sm text-gray-600 dark:text-slate-400">
          <a
            :href="lexicons.buildPostURL(props.handle, props.post.uri)">
            <time
              pubdate
              :datetime="props.post.value.createdAt"
              :title="props.post.value.createdAt"
              class="text-sm font-light">
              {{ DateTime.fromISO(props.post.value.createdAt).toString() }}
            </time>
          </a>
        </p>
      </div>
      <button
        :id="`dropdownActionButton-${props.post.cid}`"
        :data-dropdown-toggle="`dropdownAction-${props.post.cid}`"
        class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-gray-600"
        type="button">
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
        </svg>
        <span class="sr-only">Action</span>
      </button>
      <!-- Dropdown menu -->
      <div
        :id="`dropdownAction-${props.post.cid}`"
        class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
        <ul
          class="py-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownMenuIconHorizontalButton">
          <li>
            <a
              href="#"
              class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              Mute
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              Report
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="text-gray-500 dark:text-gray-400">
      <!-- has reply ? -->
      <div>
        <AtHandleLink
          v-if="props.post.value.reply"
          :aturi="props.post.value.reply.parent.uri"
          class="inline-block font-light text-xs text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 rounded-lg px-3 py-1 text-center mr-1 mb-1 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
          In Reply
        </AtHandleLink>
      </div>
      <!-- Post message -->
      {{ props.post.value.text }}
      <div v-if="props.post.value.embed">
        <!-- Attached images -->
        <EmbedImage :did="did" :embed="props.post.value.embed" />
      </div>
      <div v-if="props.post.value.langs" class="text-xs text-right text-gray-400 dark:text-gray-700">Lang: {{ props.post.value.langs.join(',') }}</div>
    </div>
  </article>
</template>

<script setup>
  import { Avatar, Tabs, Tab } from 'flowbite-vue'
  import { defineProps, onMounted, ref } from 'vue'
  import { DateTime } from 'luxon'
  import { useAppConfig } from 'nuxt/app'
  import * as lexicons from '@/utils/lexicons'

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
  })

  // const replyTo = ref('@...')

  onMounted(async () => {
    // if (props.post.value.reply)
    // await getReplyLink(props.post.value.reply)
  })

  const getReplyLink = async reply => {
    const aturi = lexicons.parseAtUri(reply.parent.uri)
    const [record, handle] = await Promise.all([
      lexicons.getPost(
        aturi.did,
        aturi.rkey
      ),
      lexicons.resolveDID(aturi.did),
    ])

    replyTo.value = `<a href="${lexicons.buildPostURL(config.bskyAppURL,reply.uri,handle)}">@${handle}</a>`
  }
</script>
