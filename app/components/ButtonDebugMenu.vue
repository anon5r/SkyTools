<template>
  <ClientOnly>
    <DropdownMenuButton
      :icon="props.icon"
      :id="props.id"
      :buttonStyle="props.buttonStyle">
      <!-- dropdown menu -->
      <ul
        class="py-2 text-sm text-gray-600 dark:text-slate-400"
        :aria-labelledby="`dropdown-${props.id}-button`">
        <li v-if="props.handle">
          <NuxtLink
            :to="`/history?id=${props.handle}`"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            <font-awesome-icon
              class="pr-1"
              icon="fa-solid fa-clock-rotate-left" />
            Handle history
          </NuxtLink>
        </li>
        <li v-if="props.handle && props.rkey">
          <NuxtLink
            :to="`${config.bskyAppURL}/profile/${props.handle}/post/${props.rkey}`"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            target="_blank">
            <font-awesome-icon class="pr-1" icon="fa-brands fa-bluesky" />
            Open in Bluesky
          </NuxtLink>
        </li>
        <li v-else-if="props.handle">
          <NuxtLink
            :to="`${config.bskyAppURL}/profile/${props.handle}`"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            target="_blank">
            <font-awesome-icon class="pr-1" icon="fa-brands fa-bluesky" />
            Open in Bluesky
          </NuxtLink>
        </li>
        <li v-if="props.did">
          <NuxtLink
            :to="`https://web.plc.directory/did/${props.did}`"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            target="_blank">
            <font-awesome-icon
              class="pr-1"
              icon="fa-solid fa-arrow-up-right-from-square" />
            View DID Doc
          </NuxtLink>
        </li>
        <li v-if="props.rkey">
          <NuxtLink
            :to="`${props.pds}/xrpc/com.atproto.repo.getRecord?repo=${props.did}&collection=app.bsky.feed.post&rkey=${props.rkey}`"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            target="_blank">
            <font-awesome-icon
              class="pr-1"
              icon="fa-solid fa-arrow-up-right-from-square" />
            API (Lexicon)
          </NuxtLink>
        </li>
        <li v-else>
          <NuxtLink
            :to="`${props.pds}/xrpc/com.atproto.repo.getRecord?repo=${props.did}&collection=app.bsky.actor.profile&rkey=self`"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            target="_blank">
            <font-awesome-icon
              class="pr-1"
              icon="fa-solid fa-arrow-up-right-from-square" />
            API (Lexicon)
          </NuxtLink>
        </li>
        <li v-if="props.atUri">
          <NuxtLink
            :to="`${config.bskyAppURL.replace('https://', 'https://public.api.')}/xrpc/app.bsky.feed.getPostThread?uri=${props.atUri}&maxLength=100`"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            target="_blank">
            <font-awesome-icon
              class="pr-1"
              icon="fa-solid fa-arrow-up-right-from-square" />
            API (Bluesky)
          </NuxtLink>
        </li>
        <li v-else-if="props.handle">
          <NuxtLink
            :to="`${config.bskyAppURL.replace('https://', 'https://public.api.')}/xrpc/app.bsky.actor.getProfile?actor=${props.handle}`"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            target="_blank">
            <font-awesome-icon
              class="pr-1"
              icon="fa-arrow-up-right-from-square" />
            API (Bluesky)
          </NuxtLink>
        </li>
        <li v-if="props.did">
          <CopyToClipboard
            :copy-text="props.did"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-sm w-[calc(100%)]"
            success-message="DID copied!"
            error-message="Failed to copy"
            :display-duration="3500">
            <font-awesome-icon class="pr-1" icon="fa-regular fa-clipboard" />
            Copy DID
          </CopyToClipboard>
        </li>
        <li v-if="props.atUri">
          <CopyToClipboard
            :copy-text="props.atUri"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-sm w-[calc(100%)]"
            success-message="Copied!"
            error-message="Failed to copy"
            :display-duration="3500">
            <font-awesome-icon class="pr-1" icon="fa-regular fa-clipboard" />
            Copy AT URI
          </CopyToClipboard>
        </li>
        <li v-if="easterMode && !props.atUri">
          <a
            :href="`/api/repocar?repo=${encodeURIComponent(props.did)}`"
            class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            <font-awesome-icon class="pr-1" icon="fa-solid fa-download" />
            Download CAR
          </a>
        </li>
      </ul>
      <div v-if="props.options" class="py-2">
        <div v-for="(value, key) of props.options" :key="key">
          <div
            v-if="
              !['text', 'facets', 'createdAt', '$type'].includes(key) &&
              value instanceof Array &&
              value.length > 0
            "
            class="px-4 justify-start items-baseline text-xs text-right text-gray-600 dark:text-gray-400">
            {{ key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() }}:
            {{ value.join(',') }}
          </div>
        </div>
      </div>
    </DropdownMenuButton>
  </ClientOnly>
</template>

<style scoped></style>

<script setup lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { useAppConfig } from '#imports'

  const config = useAppConfig()
  const easterMode = localStorage.getItem('_easter') === 'true'

  const props = defineProps({
    icon: {
      type: String,
      require: false,
      default: 'vertical',
    },
    id: {
      type: String,
      require: true,
    },
    buttonStyle: {
      type: String,
      require: false,
      default: 'text-gray-500 dark:text-slate-500',
    },
    handle: {
      type: String,
      require: true,
    },
    did: {
      type: String,
      require: true,
      default: '',
    },
    pds: {
      type: String,
      require: true,
    },
    atUri: {
      type: String,
      require: false,
      default: '',
    },
    rkey: {
      type: String,
      require: false,
      default: '',
    },
    cid: {
      type: String,
      require: false,
      default: '',
    },
    options: {
      type: Object,
      require: false,
    },
  })
</script>
