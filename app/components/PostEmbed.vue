<template>
  <div class="m-2">
    <div v-if="props.embed.$type == 'app.bsky.embed.record'">
      <!-- Embed Record -->
      <a
        :href="postURL"
        class="block max-w-fit p-6 text-sm truncate bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        {{ props.embed.record.uri }}
      </a>
    </div>
    <div
      v-if="props.embed.$type == 'app.bsky.embed.images'"
      class="flex flex-wrap">
      <!-- Display image -->
      <div
        class="grid md:grid-cols-2 grid-flow-dense auto-cols-max gap-4 max-w-fit">
        <div
          v-for="img of props.embed.images"
          :key="img.image.ref.toString()"
          class="flex">
          <a :href="`${config.cdnPrefix}/${config.defaultPDS}/image/${props.did}/${img.image.ref.toString()}`" target="_blank">
            <img
              :src="`${config.cdnPrefix}/${config.defaultPDS}/image/${props.did}/${img.image.ref.toString()}`"
              :alt="img.alt"
              class="h-auto max-w-xs rounded-lg" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, ref, onMounted } from 'vue'
  import { useAppConfig } from 'nuxt/app'
  import { buildPostURL } from '@/utils/lexicons'

  const config = useAppConfig()

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
  const postURL = ref('#')
  onMounted(async () => {
    if (props.embed.$type === 'app.bsky.embed.record')
      postURL.value = await buildPostURL(
        config.bskyAppURL,
        props.embed.record.uri
      )
  })
</script>
