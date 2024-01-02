<template>
  <div>
    <span v-html="refText.unicodeText"></span>
  </div>
</template>

<script setup lang="ts">
  import type { Ref } from 'vue'
  import { defineProps, ref } from 'vue'
  import { AppBskyRichtextFacet, RichText, UnicodeString } from '@atproto/api'
  import { isDev } from '@/utils/helpers'

  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  })

  const refText: Ref<RichText> = ref(
    new RichText(
      { text: props.post.value.text.trim() },
      {
        cleanNewlines: true,
      }
    )
  )
  const facets: AppBskyRichtextFacet.Main[] = props.post?.value.facets

  if (facets) {
    console.log('refText = ', refText)
    console.log('facets = ', facets)

    // Process from last to first
    facets
      .reverse()
      ?.filter((facet: AppBskyRichtextFacet.Main, index: number) => {
        const mention = facet.features.find(feature =>
          AppBskyRichtextFacet.isMention(feature)
        )
        const linkURL = facet.features.find(feature =>
          AppBskyRichtextFacet.isLink(feature)
        )
        const hashTags = facet.features.find(feature =>
          AppBskyRichtextFacet.isTag(feature)
        )

        // Mention
        if (mention) {
          const { byteStart, byteEnd } = facet.index
          const mentionText = refText.value.unicodeText.slice(
            byteStart,
            byteEnd
          )
          if (isDev()) {
            console.log('mention = ', mention)
            console.log('mentionText = ', mentionText)
          }
          const linkedText = new UnicodeString(
            `<a class="text-blue-500" href="/profile/${mention?.did}">${mentionText}</a>`
          )
          refText.value.unicodeText = new UnicodeString(
            refText.value.unicodeText.slice(0, byteStart) +
              linkedText +
              refText.value.unicodeText.slice(byteEnd)
          )
          facet.index.byteEnd = byteStart + linkedText.utf16.length
        }
        // Link URL
        if (linkURL) {
          const { byteStart, byteEnd } = facet.index
          console.log('facet.index = ', facet.index)
          const textURL = refText.value.unicodeText.slice(byteStart, byteEnd)
          if (isDev()) {
            console.log('linkURL = ', linkURL)
            console.log('textURL = ', textURL)
          }
          const linkedText = new UnicodeString(
            `<a class="text-blue-500" href="${linkURL.uri}">${textURL}</a>`
          )
          refText.value.unicodeText = new UnicodeString(
            refText.value.unicodeText.slice(0, byteStart) +
              linkedText +
              refText.value.unicodeText.slice(byteEnd)
          )
          facet.index.byteEnd = byteStart + linkedText.utf16.length
        }
        // HashTags
        if (hashTags) {
          const { byteStart, byteEnd } = facet.index
          const textTag = refText.value.unicodeText.slice(byteStart, byteEnd)
          if (isDev()) {
            console.log('hashTags = ', hashTags)
            console.log('textTag = ', textTag)
          }
          const linkedText = new UnicodeString(
            `<a class="text-blue-500" href="https://bsky.app/search?q=%23${hashTags.tag}">${textTag}</a>`
          )
          refText.value.unicodeText = new UnicodeString(
            refText.value.unicodeText.slice(0, byteStart) +
              linkedText +
              refText.value.unicodeText.slice(byteEnd)
          )
          facet.index.byteEnd = byteStart + linkedText.utf16.length
        }
      })
  }
</script>
