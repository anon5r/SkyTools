<template>
  <!-- Display thumbnail with external link -->
  <div class="p-0 content-center max-w-fit">
    <LazyNuxtLink
      :to="recordEmbed.external.uri"
      :title="recordEmbed.external.title"
      class="block items-center">
      <div
        class="m-4 min-w-full max-w-fit bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <figure
          class="relative p-2 max-w-full transition-all duration-300 bg-transparent cursor-pointer">
          <LazyNuxtImg
            v-if="recordEmbed.external.thumb"
            :src="`${config.cdnPrefix}/${props.pds.substring(8)}/image/${
              props.did
            }/${recordEmbed.external.thumb.ref.toString()}`"
            :alt="
              recordEmbed.external.title ??
              recordEmbed.external.uri.split('/')[2]
            "
            class="mx-auto max-h-44 md:max-h-56 max-w-full rounded-t-lg object-cover object-center" />
          <h1
            v-else-if="recordEmbed.external.title || recordEmbed.external.uri"
            class="text-md md:text-xl max-w-min font-bold tracking-tight text-gray-900 dark:text-white text-ellipsis overflow-hidden">
            {{
              recordEmbed.external.title.length > 0
                ? recordEmbed.external.title
                : recordEmbed.external.uri
            }}
          </h1>
          <figcaption class="px-4 pt-1.5 pb-0.5">
            <h5
              class="mb-1 text-md md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {{
                recordEmbed.external.title ??
                recordEmbed.external.uri.split('/')[2]
              }}
            </h5>
          </figcaption>
        </figure>
        <div
          v-if="recordEmbed.external.description"
          class="px-5 text-ellipsis overflow-clip">
          <p
            class="mb-1 min-h-min max-h-16 font-thin text-sm text-gray-700 dark:text-gray-400 overflow-ellipsis">
            {{ recordEmbed.external.description }}
          </p>
        </div>
        <div class="mx-5 pb-2 text-gray-500 dark:text-gray-500 text-xs">
          {{ recordEmbed.external.hostname }}
        </div>
      </div>
    </LazyNuxtLink>
  </div>
</template>

<script setup lang="ts">
  import { useAppConfig, isDev } from '#imports'
  import { AppBskyEmbedExternal } from '@atproto/api'
  import type { ValidationResult } from '@atproto/lexicon'

  /** @type {AppBskyEmbedExternal} props.embed */
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
      required: true,
    },
  })
  const recordEmbed = props.embed
  const config = useAppConfig()

  if (AppBskyEmbedExternal.isMain(recordEmbed)) {
    // External Link
    /** @type {ValidationResult} */
    const validRes: ValidationResult =
      AppBskyEmbedExternal.validateMain(recordEmbed)
    if (isDev()) console.log(validRes)

    if (validRes.success) {
      const url = new URL(recordEmbed.external.uri)
      recordEmbed.external.hostname = url.hostname
    }
  }
</script>

<style scoped></style>
