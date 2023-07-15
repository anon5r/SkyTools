<template>
  <div v-if="props.embed.$type == 'app.bsky.embed.images'">
    <!-- Display image -->
    <img
      v-for="img of props.embed.images"
      :key="img.image.ref.toString()"
      :src="`${config.bskyService}/xrpc/com.atproto.sync.getBlob?did=${props.did}&cid=${img.image.ref.toString()}`"
      :alt="img.alt"
      class="h-auto max-w-xs" />
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'
  import { useAppConfig } from 'nuxt/app';

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
</script>
