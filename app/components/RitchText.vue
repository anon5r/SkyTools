<template>
  <div class="prose dark:prose-invert max-w-none break-words" v-html="htmlContent" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { AppBskyRichtextFacet } from '@atproto/api'
  import { RichText } from '@atproto/api'

  const props = defineProps<{
    text: string
    facets?: AppBskyRichtextFacet.Main[]
  }>()

  const escapeHTML = (str: string) => str.replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag as string] || tag)
  )

  const htmlContent = computed(() => {
    const rt = new RichText({
      text: props.text,
      facets: props.facets as AppBskyRichtextFacet.Main[],
    })
    
    let html = ''
    for (const segment of rt.segments()) {
      if (segment.isLink() && segment.link) {
        html += `<a href="${escapeHTML(segment.link.uri)}" class="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 underline" target="_blank" rel="noopener noreferrer">${escapeHTML(segment.text)}</a>`
      } else if (segment.isMention() && segment.mention) {
        html += `<a href="/profile/${escapeHTML(segment.mention.did)}" class="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 underline">${escapeHTML(segment.text)}</a>`
      } else if (segment.isTag() && segment.tag) {
        html += `<a href="/hashtag/${encodeURIComponent(segment.tag.tag)}" class="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 underline">${escapeHTML(segment.text)}</a>`
      } else {
        html += escapeHTML(segment.text)
      }
    }
    return html.replace(/\n/g, '<br />')
  })
</script>
