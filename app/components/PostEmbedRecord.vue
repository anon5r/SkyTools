<template>
  <!-- Embed Record -->
  <div
    class="max-w my-2 ml-8 mr-2 text-sm overflow-ellipsis bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <ClientOnly
      fallback-tag="div"
      class="flex items-center max-w mr-3 text-md text-gray-900 dark:text-white">
      <template #placeholder>
        <a
          href="#"
          class="block m-0 p-4"
          :title="props.embed.record.uri"
          @click.prevent="">
          Loading...
          <div>{{ props.embed.record.uri }}</div>
        </a>
      </template>
      <NuxtLink
        v-if="client && !client.isRemoved"
        :to="postURL"
        class="block max-w m-0 p-4"
        :title="props.embed.record.uri">
        <div class="flex flex-col min-w-8">
          <div
            class="flex flex-wrap mb-3 text-md text-gray-400 dark:text-gray-500">
            <!-- Avatar -->
            <fwb-avatar
              rounded
              size="xs"
              :img="client.avatarURL"
              :alt="client.handle"
              class="inline-flex mr-1 min-w-max avatar-object-cover" />

            <div class="inline-flex items-center">
              <!-- DisplayName -->
              <div v-if="client?.profile?.displayName" class="ml-1 mr-2">
                {{ client.profile ? client.profile.displayName : '' }}
              </div>
              <div
                class="text-xs font-mono truncate text-gray-500 dark:text-slate-500">
                <!-- Handle -->
                <span class="at-handle">{{ client.handle }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="client?.isHidden"
            class="my-3 md:my-2 whitespace-pre-line break-all truncate">
            <span class="italic">You must be logged in to view posts.</span>
          </div>
          <div
            v-else-if="client?.record"
            class="my-3 md:my-2 whitespace-pre-line break-all truncate">
            {{ client.record.text ?? '' }}
          </div>
          <div v-if="client?.record && client.record.embed">
            <PostEmbedImages
              :embed="client.record.embed"
              :did="client.did"
              :pds="client.endpoint" />
          </div>
        </div>
      </NuxtLink>
      <div v-else-if="client && client.isRemoved" class="p-4">
        This post has been removed
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
  import { AppBskyEmbedRecord } from '@atproto/api'
  import { type Ref } from 'vue'
  import { ClientPost, isDev, ref, useAppConfig } from '#imports'
  import { FwbAvatar } from 'flowbite-vue'

  /** @type {AppBskyEmbedRecord} props.embed */
  /** @type {string} props.did */
  const props = defineProps({
    embed: {
      type: Object,
      require: false,
      default: () => ({}),
    },
    did: {
      type: String,
      required: true,
      default: null,
    },
    pds: {
      type: String,
      required: false,
      default: null,
    },
  })

  const config = useAppConfig()
  const postURL: Ref<string> = ref('#')
  const client: Ref<ClientPost | undefined> = ref(undefined)

  /**
   * Loads post-data from a given at-URI.
   *
   * @param {string} atURI - The ATURI to load the post-data from.
   * @returns {Promise<ClientPost>} - A promise that resolves to the loaded post-data as a ClientPost object.
   */
  const loadPostData = async (atURI: string): Promise<ClientPost> => {
    const postURI = atURI ?? props.embed.value.record.uri
    if (isDev()) console.log('PostEmbed.loadPostData(atURI) ==> ', postURI)
    return await ClientPost.load(config, postURI)
  }

  if (AppBskyEmbedRecord.isMain(props.embed)) {
    try {
      // Quoted posts
      /** @type Promise<ClientPost> post */
      client.value = await loadPostData(props.embed.record.uri)
    } catch (error) {
      console.error('Error loading post data: ', error)
    }
    if (client.value !== undefined) {
      // Post URL
      postURL.value = client.value.permaURL()
    }
  }
</script>
