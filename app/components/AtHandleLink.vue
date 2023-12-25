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
  import { defineProps, ref, onMounted } from 'vue'
  import { useAppConfig } from 'nuxt/app'
  import { parseAtUri, resolveDID, buildPostURL } from '@/utils/lexicons'

  const config = useAppConfig()
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
    handle.value = await resolveDID(parseUri.did)
    postURL.value = await buildPostURL(config.bskyAppURL, props.aturi)
  })
</script>
