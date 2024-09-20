<template>
  <div class="flex flex-wrap">
    <div v-if="props.embed.media.$type === 'app.bsky.embed.images'">
      <!-- Display image -->
      <PostEmbedImages
        :embed="props.embed.media"
        :did="props.did"
        :pds="props.pds" />
    </div>
    <div v-if="props.embed.record.$type === 'app.bsky.embed.record'">
      <!-- Display quoted record -->
      <PostEmbedRecord
        :embed="props.embed.record"
        :did="props.did"
        :pds="props.pds" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
  import { AppBskyEmbedRecordWithMedia } from '@atproto/api'
  import { type PropType } from 'vue'

  /** @type {AppBskyEmbedRecordWithMedia} props.embed */
  /** @type {string} props.did */
  const props = defineProps({
    embed: {
      type: Object as PropType<
        | AppBskyEmbedRecordWithMedia.Main
        | { $type: string; [k: string]: unknown }
        | unknown
      >,
      required: false,
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
</script>
