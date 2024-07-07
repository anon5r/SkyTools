<template>
  <div class="px-4 py-4 my-5 rounded-md shadow-md bg-white dark:bg-slate-800">
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <div
          class="inline-flex items-center mr-3 text-md font-bold text-gray-900 dark:text-white">
          <!-- Avatar -->
          <fwb-avatar
            rounded
            :img="avatarURL"
            :alt="props.list.name ?? 'List Avatar'"
            class="min-w-max avatar-object-cover" />
        </div>
        <div class="xl:max-w-xl lg:max-w-lg md:max-w-md max-w-64 truncate">
          <!-- DisplayName -->
          <font-awesome-icon
            v-if="props.list.purpose === 'app.bsky.graph.defs#curatelist'"
            class="mr-2"
            icon="people-group" />
          <font-awesome-icon
            v-if="props.list.purpose === 'app.bsky.graph.defs#modlist'"
            class="mr-2"
            icon="comment-slash" />
          <font-awesome-icon
            v-if="props.list?.purpose === 'app.bsky.graph.defs#referencelist'"
            class="mr-2"
            icon="thumbs-up" />
          <NuxtLink :to="`/profile/${props.handle}/list/${rkey}`" class="">
            {{ props.list.name }}
          </NuxtLink>
          <p
            class="md:text-sm text-xs font-mono text-gray-500 dark:text-slate-500">
            <!-- Handle -->
            <NuxtLink
              :to="`/profile/${props.handle}`"
              class="truncate"
              @click.prevent="clickProfile">
              by @{{ props.handle }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
    <div class="text-sm pl-14 pr-16 max-w-fit truncate">
      <!-- Description -->
      {{ props.list.description ?? '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FwbAvatar } from 'flowbite-vue'
  import { onMounted, ref, useAppConfig } from '#imports'
  import { type AppBskyGraphList } from '@atproto/api'
  import { buildBlobRefURL, parseAtUri } from '~/utils/bskyutils'
  import type { PropType } from 'vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const config = useAppConfig()

  const props = defineProps({
    uri: String,
    cid: String,
    list: Object as PropType<AppBskyGraphList.Record>,
    purpose: { type: String, required: false },
    handle: String,
    pds: { type: String, required: false },
  })

  const emits = defineEmits(['showProfile'])

  const avatarURL = ref('')

  const parsedUri = parseAtUri(props.uri?.toString() ?? '')
  const actor = parsedUri.actor
  const rkey = parsedUri.rkey

  onMounted(() => {
    if (props.list) {
      if (props.list.avatar) {
        let repoEndpoint = props.pds ?? config.defaultPDSEntrypoint

        avatarURL.value = buildBlobRefURL(
          config.cdnPrefix,
          actor,
          props.list,
          'avatar',
          repoEndpoint
        )
      }
    }
  })

  const clickProfile = () => {
    emits('showProfile', props.handle)
  }
</script>

<style scoped>
  .avatar-object-cover :deep(img) {
    @apply object-cover;
  }
</style>
