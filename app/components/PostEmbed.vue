<template>
  <div class="pt-2 m-0">
    <div v-if="props.embed.$type === 'app.bsky.embed.record'">
      <PostEmbedRecord :embed="props.embed" :did="props.did" />
    </div>
    <div
      v-if="
        props.embed.$type === 'app.bsky.embed.images' ||
        props.embed.$type === 'app.bsky.embed.recordWithMedia'
      ">
      <PostEmbedImages :embed="props.embed" :did="props.did" />
    </div>
    <div v-if="props.embed.$type === 'app.bsky.embed.external'">
      <PostEmbedExternal :embed="props.embed" :did="props.did" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue'
  import { onMounted } from '#imports'
  import {
    AppBskyEmbedImages,
    AppBskyEmbedRecord,
    AppBskyEmbedRecordWithMedia,
    AppBskyEmbedExternal,
  } from '@atproto/api'
  import { isDev } from '@/utils/helpers'
  import PostEmbedRecord from '~/components/PostEmbedRecord.vue'
  import PostEmbedImages from '~/components/PostEmbedImages.vue'
  import PostEmbedExternal from '~/components/PostEmbedExternal.vue'

  /** @type {AppBskyEmbedRecord|AppBskyEmbedImages|AppBskyEmbedRecordWithMedia|AppBskyEmbedExternal} props.embed */
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
        AppBskyEmbedExternal.isMain(props.embed) ? '✅️' : '❌️',
        '[PostEmbed.vue:EmbedExternal] '
      )
    }
  })
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
