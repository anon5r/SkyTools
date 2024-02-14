<template>
  <!-- Display thumbnail with external link -->
  <div
    class="p-0 grid md:grid-cols-2 grid-flow-dense content-center auto-cols-max gap-2 max-w-fit">
    <LazyNuxtLink
      :to="props.embed.external.uri"
      :title="props.embed.external.title"
      class="block items-center">
      <div
        class="m-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <figure
          class="relative max-w-sm transition-all duration-300 cursor-pointer">
          <LazyNuxtImg
            :src="`${config.cdnPrefix}/${config.defaultPDS}/image/${
              props.did
            }/${props.embed.external.thumb.ref.toString()}`"
            :alt="props.embed.external.title"
            class="w-96 h-56 max-w-full rounded-t-lg object-cover object-top" />
          <figcaption class="absolute px-4 py-2.5">
            <h5
              class="mb-2 text-l font-bold tracking-tight text-gray-900 dark:text-white">
              {{ props.embed.external.title }}
            </h5>
          </figcaption>
        </figure>
        <div class="mt-10 p-5 text-ellipsis overflow-clip">
          <div class="my-1.5 text-gray-500 dark:text-gray-500 text-xs">
            {{ props.embed.external.uri }}
          </div>
          <p
            class="mb-1.5 h-32 font-thin text-sm text-gray-700 dark:text-gray-400 overflow-ellipsis">
            {{ props.embed.external.description }}
          </p>
        </div>
      </div>
    </LazyNuxtLink>
  </div>
</template>

<script setup lang="ts">
  import { useAppConfig } from '#imports'
  import { AppBskyEmbedExternal } from '@atproto/api'
  import type { ValidationResult } from '@atproto/lexicon'

  /** @type {AppBskyEmbedExternal} props.embed */
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

  if (AppBskyEmbedExternal.isMain(props.embed)) {
    // External Link
    /** @type {ValidationResult} */
    const validRes: ValidationResult = AppBskyEmbedExternal.validateMain(
      props.embed
    )
    console.log(validRes)
    if (validRes.success) {
      console.log(validRes.value.external)
    }
  }
</script>

<style scoped></style>
