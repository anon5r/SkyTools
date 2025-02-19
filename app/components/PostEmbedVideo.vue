<template>
  <div class="flex flex-wrap">
    <!-- Display image -->
    <div
      class="p-0 grid md:grid-cols-1 grid-flow-dense auto-cols-max gap-1 max-w-fit">
      <div
        v-if="props.embed.video"
        :key="props.embed.video.ref.toString()"
        class="flex">
        <a
          :href="`${config.cdnPrefix}/${config.defaultPDS}/video/${
            props.did
          }/${props.embed.video.ref.toString()}`"
          target="_blank">
          <video
            class="max-w-xs sm:max-w-md md:max-w-xs rounded-lg object-cover object-top"
            controls
            preload="metadata">
            <source
              :src="`${config.cdnPrefix}/${config.defaultPDS}/video/${
                props.did
              }/${props.embed.video.ref.toString()}`"
              :type="props.embed.video.mimeType" />
            Your browser does not support the video tag.
          </video>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
  import { useAppConfig } from '#imports'
  import { AppBskyEmbedVideo } from '@atproto/api'
  import { defineProps, type PropType } from 'vue'

  /** @type {AppBskyEmbedVideo} props.embed */
  /** @type {string} props.did */
  const props = defineProps({
    embed: {
      type: Object as PropType<
        | AppBskyEmbedVideo.Main
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
  const config = useAppConfig()
</script>
