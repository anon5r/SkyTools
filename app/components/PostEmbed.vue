<template>
  <div class="pt-2 m-0">
    <div v-if="props.embed.$type === 'app.bsky.embed.record'">
      <PostEmbedRecord :embed="props.embed" :did="props.did" :pds="props.pds" />
    </div>
    <div v-if="props.embed.$type === 'app.bsky.embed.images'">
      <PostEmbedImages :embed="props.embed" :did="props.did" :pds="props.pds" />
    </div>
    <div v-if="props.embed.$type === 'app.bsky.embed.recordWithMedia'">
      <PostEmbedRecordWithMedia
        :embed="props.embed"
        :did="props.did"
        :pds="props.pds" />
    </div>
    <div v-if="props.embed.$type === 'app.bsky.embed.external'">
      <PostEmbedExternal
        :embed="props.embed"
        :did="props.did"
        :pds="props.pds" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type PropType } from 'vue'
  import { onMounted } from '#imports'
  import {
    AppBskyEmbedExternal,
    AppBskyEmbedImages,
    AppBskyEmbedRecord,
    AppBskyEmbedRecordWithMedia,
    AppBskyEmbedVideo,
  } from '@atproto/api'
  import { isDev } from '@/utils/helpers'
  import PostEmbedRecord from '~/components/PostEmbedRecord.vue'
  import PostEmbedImages from '~/components/PostEmbedImages.vue'
  import PostEmbedVideo from '~/components/PostEmbedVideo.vue'
  import PostEmbedExternal from '~/components/PostEmbedExternal.vue'
  import PostEmbedRecordWithMedia from '~/components/PostEmbedRecordWithMedia.vue'

  /** @type {AppBskyEmbedRecord|AppBskyEmbedImages|AppBskyEmbedVideo|AppBskyEmbedRecordWithMedia|AppBskyEmbedExternal} props.embed */
  /** @type {string} props.did */
  /** @type {string} props.repo */
  const props = defineProps({
    embed: {
      type: Object as PropType<
        AppBskyEmbedImages.Main | AppBskyEmbedVideo.Main,
        | AppBskyEmbedRecord.Main
        | AppBskyEmbedRecordWithMedia.Main
        | AppBskyEmbedExternal.Main
        | { $type: string; [k: string]: unknown }
      >,
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
      required: true,
    },
  })

  onMounted(async () => {
    if (isDev()) {
      console.log(
        AppBskyEmbedRecord.isMain(props.embed) ? '✅️' : '❌️',
        '[PostEmbed.vue:EmbedRecords] '
      )
      console.log(
        AppBskyEmbedRecordWithMedia.isMain(props.embed) ? '✅️' : '❌️',
        '[PostEmbed.vue:EmbedRecordWithMedia] '
      )
      console.log(
        AppBskyEmbedImages.isMain(props.embed) ? '✅️' : '❌️',
        '[PostEmbed.vue:EmbedImages] '
      )
      console.log(
        AppBskyEmbedVideo.isMain(props.embed) ? '✅️' : '❌️',
        '[PostEmbed.vue:EmbedVideo] '
      )
      console.log(
        AppBskyEmbedExternal.isMain(props.embed) ? '✅️' : '❌️',
        '[PostEmbed.vue:EmbedExternal] '
      )
    }
  })
</script>

<style scoped>
  .avatar-object-cover :deep(img) {
    @apply object-cover;
  }
</style>
