<template>
  <div>
    <div v-if="props.embed.$type == 'app.bsky.embed.record'">
      <!-- Embed Record -->
      <a
        :href="postURL"
        class="block max-w-fit p-6 text-sm truncate bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        {{ props.embed.record.uri }}
      </a>
    </div>
    <div v-if="props.embed.$type == 'app.bsky.embed.images'">
      <!-- Display image -->
      <img
        v-for="img of props.embed.images"
        :key="img.image.ref.toString()"
        :src="`${config.cdnPrefix}/image/${props.did}/${img.image.ref.toString()}`"
        :alt="img.alt"
        class="h-auto max-w-xs" />
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
