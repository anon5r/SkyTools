<template>
  <div class="pt-2 m-0">
    <div v-if="props.embed.$type === 'app.bsky.embed.record'">
      <!-- Embed Record -->
      <div
        class="max-w my-2 ml-8 mr-2 text-sm overflow-ellipsis bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <div
          fallback-tag="div"
          class="flex items-center max-w mr-3 text-md text-gray-900 dark:text-white">
          <a
            v-if="post && !post.isRemoved"
            :href="postUrl ?? '#'"
            class="block max-w m-0 p-4"
            :title="props.embed.record.uri"
            @click.prevent="showPost(props.embed.record.uri)">
            <div class="flex flex-col min-w-8">
              <div
                class="flex flex-wrap mb-3 text-md text-gray-400 dark:text-gray-500">
                <!-- Avatar -->
                {{ post.profile }}
                {{ getProfile(post.profile) }}
                <fwb-avatar
                  rounded
                  size="xs"
                  :img="getProfile(post.profile).img ?? undefined"
                  :alt="post.handle"
                  class="inline-flex mr-1 min-w-max avatar-object-cover" />

                <div class="inline-flex items-center">
                  <!-- DisplayName -->
                  {{ post.profile.value.displayName }}
                  <div v-if="post?.profile?.displayName" class="ml-1 mr-2">
                    {{
                      post.profile &&
                      AppBskyActorProfile.isRecord(post.profile.value)
                        ? post.profile.displayName
                        : post.handle
                    }}
                  </div>
                  <div
                    class="text-xs font-mono truncate text-gray-500 dark:text-slate-500">
                    <!-- Handle -->
                    <span class="at-handle">{{ post.handle }}</span>
                  </div>
                </div>
              </div>
              <div class="my-3 md:my-2 whitespace-pre-line breal-all truncate">
                {{ post.record?.data?.value?.text }}
              </div>
              <div v-if="post.record?.data?.value?.embed">
                <div
                  v-if="
                    post.record.data.value.embed.$type ==
                    'app.bsky.embed.images'
                  "
                  class="flex flex-wrap">
                  <!-- Display image -->
                  <div
                    class="p-0 grid md:grid-cols-2 grid-flow-dense auto-cols-max gap-2 max-w-fit">
                    <div
                      v-for="img of post.record.data.value.embed.images"
                      :key="img.image.ref.toString()"
                      class="flex max-w-fit">
                      <LazyNuxtImg
                        :src="`${config.cdnPrefix}/${config.defaultPDS}/image/${
                          parseAtUri(post.record.data.uri).did
                        }/${img.image.ref.toString()}`"
                        :alt="img.alt"
                        class="max-w-xxs rounded-lg object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
          <div v-else-if="post && post.isRemoved" class="p-4">
            This post has been removed
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="props.embed.$type == 'app.bsky.embed.images'"
      class="flex flex-wrap">
      <!-- Display image -->
      <div
        class="p-0 grid md:grid-cols-2 grid-flow-dense auto-cols-max gap-4 max-w-fit">
        <div
          v-for="img of props.embed.images"
          :key="img.image.ref.toString()"
          class="flex">
          <a
            :href="`${config.cdnPrefix}/${config.defaultPDS}/image/${
              props.did
            }/${img.image.ref.toString()}`"
            target="_blank">
            <img
              :src="`${config.cdnPrefix}/${config.defaultPDS}/image/${
                props.did
              }/${img.image.ref.toString()}`"
              :alt="img.alt"
              class="max-w-xxs rounded-lg object-cover" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, ref, onMounted, toRaw } from 'vue'
  import { useAppConfig } from 'nuxt/app'
  import { buildPostURL, parseAtUri } from '@/utils/lexicons'
  import { ClientPost } from '@/utils/client'
  import { FwbAvatar } from 'flowbite-vue'
  import {
    AppBskyActorProfile,
    AppBskyEmbedImages,
    AppBskyEmbedRecord,
    AppBskyEmbedRecordWithMedia,
  } from '@atproto/api'
  import { isDev } from '@/utils/helpers'

  const config = useAppConfig()

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
  })

  const postURL = ref('#')
  const post = ref({
    handle: '',
    avatarURL: '',
    profile: null,
    record: null,
    isRemoved: false,
  })

  onMounted(async () => {
    if (isDev()) {
      console.log(
        '[PostEmbed.vue:EmbedRecords] ',
        AppBskyEmbedRecord.isMain(props.embed)
      )
      console.log(
        '[PostEmbed.vue:EmbedImages] ',
        AppBskyEmbedImages.isMain(props.embed)
      )
    }
    if (AppBskyEmbedRecord.isMain(props.embed)) {
      // Quoted posts
      post.value = await loadPostData(props.embed.record.uri)
      if (isDev()) console.log('post(ClientPost) ', post.value)
      // Post URL
      postURL.value = post.value.appUrl
    } else if (
      AppBskyEmbedImages.isMain(props.embed) ||
      AppBskyEmbedRecordWithMedia.isMain(props.embed)
    ) {
      // Images
      /** @type {ValidationResult} img */
      const validRes = AppBskyEmbedImages.validateMain(props.embed)
      if (validRes.success) {
        for (const img of validRes.value.images) {
          postURL.value = await buildPostURL(
            config.bskyAppURL,
            img.image.original.ref,
            props.did
          )
          // Post URL
          if (isDev())
            console.log('props.embed.images postURL.value ==== ', postURL.value)
        }
      }
      //
      // postURL.value = await buildPostURL(
      //   config.bskyAppURL,
      //   /** @props.embed.images {AppBskyEmbedImages} */
      //   props.embed.images[0].image.uri
      // )
    }
  })

  const loadPostData = async atURI => {
    if (isDev()) console.log('PostEmbed.loadPostData(atURI) ==> ', atURI)
    return await ClientPost.load(
      toRaw(config),
      atURI ?? props.embed.value.record.uri
    )
  }

  const showPost = atURI => {
    // In-app individual post view
    window.open(atURI ?? postURL.value, '_blank')
  }
</script>

<style scoped>
  .at-handle::before {
    content: '@';
  }
  .avatar-object-cover :deep(img) {
    @apply object-cover;
  }
  .max-w-xxs {
    max-width: 15rem;
  }
</style>
