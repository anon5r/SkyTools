<template>
  <div class="flex flex-wrap">
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
          <LazyNuxtImg
            :src="`${config.cdnPrefix}/${config.defaultPDS}/image/${
              props.did
            }/${img.image.ref.toString()}`"
            :alt="img.alt"
            class="max-w-xs sm:max-w-md md:max-w-xs rounded-lg object-cover object-top" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
  import { useAppConfig } from '#imports'
  import { AppBskyEmbedImages, AppBskyEmbedRecordWithMedia } from '@atproto/api'
  import { defineProps, type PropType } from 'vue'

  /** @type {AppBskyEmbedImages|AppBskyEmbedRecordWithMedia} props.embed */
  /** @type {string} props.did */
  const props = defineProps({
    embed: {
      type: Object as PropType<
        | AppBskyEmbedImages.Main
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
  const config = useAppConfig()
</script>
