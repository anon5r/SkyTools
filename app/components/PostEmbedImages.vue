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
          :href="
            buildImageURL(props.did, img.image.ref.toString(), 'feed_fullsize')
          "
          target="_blank">
          <img
            :src="
              buildImageURL(
                props.did,
                img.image.ref.toString(),
                'feed_thumbnail'
              )
            "
            :alt="img.alt"
            class="max-w-xs sm:max-w-md md:max-w-xs rounded-lg object-cover object-top">
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { buildImageURL } from '~/utils/bskyutils'
  import type { AppBskyEmbedImages } from '@atproto/api'

  /** @type {AppBskyEmbedImages} props.embed */
  /** @type {string} props.did */
  const props = defineProps<{
    embed: AppBskyEmbedImages.Main
    did: string
    pds?: string
  }>()
</script>

<style scoped></style>
