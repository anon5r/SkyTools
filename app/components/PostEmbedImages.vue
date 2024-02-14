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
            class="max-w-xxs rounded-lg object-cover" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
  import { useAppConfig } from '#imports'
  import { AppBskyEmbedImages, AppBskyEmbedRecordWithMedia } from '@atproto/api'
  import type { ValidationResult } from '@atproto/lexicon'
  import { buildPostURL } from '~/utils/lexicons'
  import { isDev } from '~/utils/helpers'
  import { defineProps } from 'vue'

  /** @type {AppBskyEmbedImages|AppBskyEmbedRecordWithMedia} props.embed */
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

  const config = useAppConfig()
  if (
    AppBskyEmbedImages.isMain(props.embed) ||
    AppBskyEmbedRecordWithMedia.isMain(props.embed)
  ) {
    // Images
    /** @type {ValidationResult} */
    const validRes: ValidationResult = AppBskyEmbedImages.validateMain(
      props.embed
    )
    console.log(validRes)
    if (validRes.success) {
      for (const img of props.embed.images) {
        img.value = await buildPostURL(
          config.bskyAppURL,
          img.image.original.ref,
          props.did
        )
        // Post URL
        if (isDev())
          console.log(
            'props.embed.images postURL.value ==== ',
            props.embed,
            buildPostURL(config.app).value
          )
      }
    }
  }
</script>
