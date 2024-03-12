<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-3xl">
      <div class="pt-4">
        <!-- Posts -->
        <PostView :did="did" :uri="atUri" :cid="postID"></PostView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useSeoMeta, ref, useRoute } from '#imports'
  import * as bskyutils from '~/utils/bskyutils'
  import type { RouteLocationNormalizedLoaded } from 'vue-router'
  import type { Ref } from 'vue'

  const route: RouteLocationNormalizedLoaded = useRoute()
  console.log('route.params = ', route.params)
  const handleOrDid: string = route.params.id as string
  const postID: string = route.params.cid as string

  if (handleOrDid && !postID) throw new Error('Missing posts')

  if (!handleOrDid && !postID) throw new Error('Missing posts')

  const did: Ref<string | undefined> = ref(undefined)
  const atUri: Ref<string | undefined> = ref(undefined)
  const collection = 'app.bsky.feed.post'

  did.value = handleOrDid.startsWith('did:')
    ? handleOrDid
    : await bskyutils.resolveHandle(handleOrDid)
  atUri.value = `at://${did.value}/${collection}/${postID}`
</script>
