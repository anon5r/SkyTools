<template>
  <div class="prose dark:prose-invert max-w-none" v-html="htmlContent" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { AppBskyRichtextFacet } from '@atproto/api'
  import { RichText } from '@atproto/api'

  const props = defineProps<{
    text: string
    facets?: AppBskyRichtextFacet.Main[]
  }>()

  const htmlContent = computed(() => {
    const rt = new RichText({
      text: props.text,
      facets: props.facets as AppBskyRichtextFacet.Main[],
    })
    // Basic rendering logic, replace with actual RichText rendering if needed
    return rt.text
  })
</script>
