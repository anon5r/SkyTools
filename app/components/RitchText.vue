<template>
  <div>
    <span v-html="formattedText"></span>
  </div>
</template>

<script setup lang="ts">
  import { ref, type Ref } from '#imports'
  import { defineProps } from 'vue'
  import { AppBskyRichtextFacet, RichText, UnicodeString } from '@atproto/api'
  import { isDev } from '@/utils/helpers'

  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    facets: {
      type: Array<AppBskyRichtextFacet.Main>,
      required: false,
    },
  })
  const refText: Ref<RichText> = ref(
    new RichText(
      { text: props.text ?? '', facets: props.facets },
      {
        cleanNewlines: true,
      }
    )
  )

  const escapeHTML = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  // Generate links and escaped text
  const generateFormattedText = (
    text: UnicodeString,
    facets: AppBskyRichtextFacet.Main[] | undefined
  ) => {
    if (!facets) {
      // there are no facets, the whole string is escaped and displayed.
      return escapeHTML(text.toString())
    }

    let formattedText = ''
    let lastIndex = 0

    facets.forEach(facet => {
      const { byteStart, byteEnd } = facet.index
      const linkFeature = facet.features.find(
        feature =>
          feature.$type === 'app.bsky.richtext.facet#link' ||
          feature.$type === 'app.bsky.richtext.facet#mention' ||
          feature.$type === 'app.bsky.richtext.facet#tag'
      )

      if (linkFeature) {
        // Create link from byteStart until byteEnd
        const plainTextBeforeLink = text.slice(lastIndex, byteStart)
        const linkText = text.slice(byteStart, byteEnd)
        const escapedBeforeLink = escapeHTML(plainTextBeforeLink)
        if (isDev()) {
          if (linkFeature.uri) console.log('linkURL = ', linkFeature.uri)
          if (linkFeature.did) console.log('linkDID = ', linkFeature.did)
          if (linkFeature.tag) console.log('linkTag = ', linkFeature.tag)
          console.log('linkText = ', linkText)
        }
        console.log(linkFeature)
        formattedText += escapedBeforeLink
        if (linkFeature.uri)
          formattedText += `<a href='${linkFeature.uri}' class='text-blue-500'>${escapeHTML(linkText)}</a>`
        if (linkFeature.did)
          formattedText += `<a href='/profile/${linkFeature.did}' class='text-blue-500'>${escapeHTML(linkText)}</a>`
        if (linkFeature.tag)
          formattedText += `<a href='//bsky.app/search?q=${encodeURIComponent('#' + linkFeature.tag)}' class='text-blue-500' target='_blank'>${escapeHTML(linkText)}</a>`

        lastIndex = byteEnd
      }
    })

    // Add escaped text after the last link
    formattedText += escapeHTML(text.slice(lastIndex))

    return formattedText
  }

  // Generates text to display
  const formattedText = ref(
    generateFormattedText(refText.value.unicodeText, props.facets)
  )
</script>
