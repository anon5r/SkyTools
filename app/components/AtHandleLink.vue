<template>
  <a :href="postURL" class="text-blue-700 dark:text-blue-500">
    <slot v-if="!props.withHandle || !$slots.default()">@{{ handle }}</slot>
    <template v-else>
      <slot />
      @{{ handle }}
    </template>
  </a>
</template>

<script setup>
  import { onMounted, ref } from '#imports'
  import { defineProps } from 'vue'
  import { parseAtUri, resolveDID } from '~/utils/bskyutils'
  import { ClientPost } from '@/utils/client'

  const handle = ref('')
  const postURL = ref('#')

  const props = defineProps({
    aturi: {
      type: String,
      require: true,
    },
    withHandle: {
      type: Boolean,
      require: false,
      default: false,
    },
  })

  onMounted(async () => {
    const parseUri = parseAtUri(props.aturi)
    console.log(parseUri)
    handle.value = await resolveDID(parseUri.actor)
    postURL.value = ClientPost.getPermanentLink(
      handle.value ?? parseUri.actor,
      parseUri.rkey
    )
  })
</script>
