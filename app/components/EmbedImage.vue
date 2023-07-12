<template>
  <div v-if="embed.$type == 'app.bsky.embed.images'">
    <img
      v-for="img of embed.images"
      :key="img.image.ref.$link"
      :src="`https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${img.image.ref.$link}`"
      :alt="img.image.ref.alt"
      class="h-auto max-w-xs" />
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'
  import { DateTime } from 'luxon'

  const embed = defineProps({
    embed: {
      type: {},
      require: false,
      default: null,
    },
    did: {
      type: String,
      required: true,
      default: null,
    },
  })
</script>
