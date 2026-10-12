<template>
  <div class="flex flex-wrap">
    <div v-if="AppBskyEmbedImages.isMain(props.embed.media)">
      <!-- Display image -->
      <PostEmbedImages
        :embed="props.embed.media"
        :did="props.did"
        :pds="props.pds" />
    </div>
    <PostEmbedVideo
      v-if="AppBskyEmbedVideo.isMain(props.embed.media)"
      :embed="props.embed.media"
      :uri="props.uri" />
    <div v-if="props.embed.record.$type === 'app.bsky.embed.record'">
      <!-- Display quoted record -->
      <PostEmbedRecord
        :embed="props.embed.record"
        :did="props.did"
        :pds="props.pds" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    AppBskyEmbedImages,
    AppBskyEmbedVideo,
    type AppBskyEmbedRecordWithMedia,
  } from '@atproto/api'

  /** @type {AppBskyEmbedRecordWithMedia} props.embed */
  /** @type {string} props.did */
  const props = defineProps<{
    embed: AppBskyEmbedRecordWithMedia.Main
    did: string
    pds?: string
    uri: string
  }>()
</script>

<style scoped></style>
