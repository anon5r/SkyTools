<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-3xl">
      <div class="pt-4">
        <!-- Posts -->
        <div v-if="record">
          <PostView
            :config="config"
            :did="did"
            :handle="handle"
            :avatar_url="avatarURL ?? null"
            :display_name="displayName"
            :post="toRaw(record)" />
        </div>
        <div v-else>
          <article
            class="p-4 my-5 text-base shadow-md bg-white rounded-lg dark:bg-slate-800">
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center">
                <div
                  class="inline-flex items-center mr-1 text-md font-bold text-gray-900 dark:text-white">
                  <!-- Avatar -->
                  <fwb-avatar
                    rounded
                    :alt="handleOrDid"
                    class="min-w-max avatar-object-cover" />
                </div>
                <div class="max-w-xs truncate">
                  <!-- DisplayName -->
                  <NuxtLink :href="`/profile/${handleOrDid}`">
                    {{ handleOrDid || 'Loading...' }}
                  </NuxtLink>
                  <div
                    class="at-handle text-xs font-mono truncate text-gray-500 dark:text-slate-500">
                    <!-- Handle -->
                    {{ handleOrDid || '...' }}
                  </div>
                </div>
              </div>

              <div class="text-sm text-right text-gray-600 dark:text-slate-400">
                <div class="pt-1">
                  <time class="text-sm font-light">????/??/??</time>
                </div>
              </div>
            </div>
            <div class="pl-3 pr-4 text-gray-500 dark:text-gray-400">
              <div class="break-words whitespace-pre-line">
                <div class="text-sm">Loading...</div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useAppConfig, useSeoMeta } from 'nuxt/app'
  import { onMounted, ref, toRaw } from 'vue'
  import { useRoute } from 'vue-router'
  import {
    buildBlobRefURL,
    getPost,
    loadProfile,
    resolveDID,
    resolveHandle,
  } from '~/utils/lexicons'
  import { FwbAvatar } from 'flowbite-vue'
  import { showError } from '#app/composables/error'

  const route = useRoute()
  const handleOrDid = ref(route.params.id)
  const postID = ref(route.params.cid)
  if (handleOrDid.value && !postID.value) {
    throw new Error('Missing posts')
  }
  if (!handleOrDid.value && !postID.value) {
    throw new Error('Missing posts')
  }

  const config = useAppConfig()

  const did = ref(null)
  const handle = ref(null)
  const displayName = ref(handleOrDid)
  const avatarURL = ref(null)

  const profile = ref(null)
  const record = ref(null)

  onMounted(async () => {
    try {
      did.value = await resolveHandle(handleOrDid.value)
    } catch (e) {
      console.error(e)
    }
    try {
      handle.value = await resolveDID(did.value)
      displayName.value = handle.value
    } catch (e) {
      console.error(e)
    }

    useSeoMeta({
      title: `Post | ${config.title} ${
        handleOrDid.value ?? '- ' + handleOrDid.value
      }`,
      ogTitle: `Post | ${config.title} ${
        handleOrDid.value ?? '- ' + handleOrDid.value
      }`,
      ogImage: `${config.prodURLPrefix}/images/ogp/profile.png`,
      twitterCard: 'summary',
    })
    try {
      profile.value = await loadProfile(did.value, false)
      avatarURL.value = buildBlobRefURL(
        config.cdnPrefix,
        did.value,
        profile.value,
        'avatar'
      )
      displayName.value = profile.value.displayName
    } catch (e) {
      console.error(e)
    }
    try {
      const result = await getPost(did.value, postID.value)
      record.value = result.success
        ? result.data
        : {
            value: {
              value: {
                createdAt: '1970-01-01 09:00:00Z',
                text: 'The post may have been deleted.',
              },
            },
          }

      // get post for description
      let description = record.value.value.text
      // remove line breaks
      description = description.replace(/(?:\r?\n)+/g, ' ')
      // to short text for title
      let descShort = description
      if (descShort.length > 32) {
        descShort = descShort.substr(0, 32) + '...'
      }
      if (description.length > 128) {
        description = description.substr(0, 128) + '...'
      }

      useSeoMeta({
        title: `${config.title} - ${displayName.value} ${descShort}`,
        ogTitle: `${config.title} - ${displayName.value} ${descShort}`,
        description: description,
        ogDescription: description,
      })
    } catch (e) {
      console.error(e)

      throw showError({
        statusCode: 404,
        statusMessage: 'This post has been removed, or incorrect URL.',
      })
    }
  })
</script>
