<template>
  <div class="flex flex-col gap-2">
    <video
      ref="video"
      :poster="thumbnail"
      :aria-label="props.embed.alt || 'Video'"
      class="max-w-xs sm:max-w-md md:max-w-xs rounded-lg object-cover object-top"
      controls
      playsinline
      preload="metadata" />
    <p v-if="failed" role="status" class="text-sm text-gray-500">
      Video unavailable.
    </p>
  </div>
</template>

<script setup lang="ts">
  import {
    AtpAgent,
    AppBskyEmbedVideo,
    AppBskyEmbedRecordWithMedia,
  } from '@atproto/api'
  import Hls from 'hls.js'
  import { ref, watch, onBeforeUnmount } from 'vue'

  const props = defineProps<{
    embed: AppBskyEmbedVideo.Main
    uri: string
    did?: string
    pds?: string
  }>()
  const video = ref<HTMLVideoElement>()
  const thumbnail = ref<string>()
  const failed = ref(false)
  const agent = new AtpAgent({ service: 'https://public.api.bsky.app' })

  watch(
    [() => props.uri, () => props.embed.video.ref.toString(), video],
    async (_, __, onCleanup) => {
      const element = video.value
      if (!element) return
      let cancelled = false
      let hls: Hls | undefined
      onCleanup(() => {
        cancelled = true
        hls?.destroy()
        element.pause()
        element.removeAttribute('src')
        element.load()
      })
      failed.value = false
      thumbnail.value = undefined
      try {
        const { data } = await agent.getPosts({ uris: [props.uri] })
        if (cancelled) return
        const embed = data.posts[0]?.embed
        const media: unknown = AppBskyEmbedRecordWithMedia.isView(embed)
          ? embed.media
          : embed
        const result = AppBskyEmbedVideo.validateView(media)
        if (
          !result.success ||
          result.value.cid !== props.embed.video.ref.toString()
        ) {
          failed.value = true
          return
        }
        thumbnail.value = result.value.thumbnail
        if (element.canPlayType('application/vnd.apple.mpegurl')) {
          element.src = result.value.playlist
        } else if (Hls.isSupported()) {
          hls = new Hls()
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              failed.value = true
              hls?.destroy()
            }
          })
          hls.loadSource(result.value.playlist)
          hls.attachMedia(element)
        } else {
          failed.value = true
        }
      } catch {
        if (!cancelled) failed.value = true
      }
    },
    { immediate: true, flush: 'post' }
  )

  const onError = () => {
    failed.value = true
  }
  watch(video, (element, oldElement) => {
    oldElement?.removeEventListener('error', onError)
    element?.addEventListener('error', onError)
  })
  onBeforeUnmount(() => video.value?.removeEventListener('error', onError))
</script>
