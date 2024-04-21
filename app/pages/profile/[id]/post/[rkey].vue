<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-3xl">
      <div class="pt-4">
        <!-- Posts -->
        <PostView
          :did="did"
          :uri="atUri"
          :rkey="postID"
          :profile="profile"
          :pds="pds" />
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
  const handleOrDid: string = route.params.id as string
  const postID: string = route.params.rkey as string

  if (!postID) throw new Error('Missing posts')

  const collection = 'app.bsky.feed.post'
  const did: Ref<string> = ref(
    handleOrDid.startsWith('did:')
      ? handleOrDid
      : await bskyutils.resolveHandle(handleOrDid)
  )
  const atUri: Ref<string> = ref(`at://${did.value}/${collection}/${postID}`)

  const pds = await bskyutils.getPDSEndpointByDID(did.value)
  const profile = await bskyutils.loadProfile(pds, handleOrDid)
</script>
