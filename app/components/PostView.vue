<template>
  <article
    class="p-4 my-5 text-base shadow-md bg-white rounded-lg dark:bg-slate-800"
    :id="`post-${props.rkey}`">
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <div
          class="inline-flex items-center mr-1 text-md font-bold text-gray-900 dark:text-white">
          <!-- Avatar -->
          <NuxtLink :to="ClientPost.getPermanentLink(handle)">
            <fwb-avatar
              rounded
              :img="avatarURL ?? undefined"
              :alt="handle"
              class="p-1 min-w-max avatar-object-cover" />
          </NuxtLink>
        </div>
        <div class="max-w-xs truncate">
          <!-- DisplayName -->
          <div v-if="isHidden">Hidden user</div>
          <NuxtLink :to="ClientPost.getPermanentLink(handle)" v-else>
            {{ displayName ?? handle }}
          </NuxtLink>
          <div
            class="at-handle text-xs font-mono truncate text-gray-500 dark:text-slate-500">
            <!-- Handle -->
            <NuxtLink :to="ClientPost.getPermanentLink(handle)">
              {{ handle }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="text-sm text-right text-gray-600 dark:text-slate-400">
        <ClientOnly>
          <DropdownMenuButton icon="vertical" :id="`${props.rkey}`">
            <!-- dropdown menu -->
            <ul
              class="py-2 text-sm text-gray-600 dark:text-slate-400"
              :aria-labelledby="`dropdown-${props.rkey}-button`">
              <li>
                <NuxtLink
                  :to="`${config.bskyAppURL}${postURL}`"
                  class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Open in Bluesky
                  <font-awesome-icon
                    :icon="['fas', 'arrow-up-right-from-square']" />
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="`${props.pds}/xrpc/com.atproto.repo.getRecord?repo=${props.did}&collection=app.bsky.feed.post&rkey=${props.rkey}`"
                  class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Open as JSON
                  <font-awesome-icon
                    :icon="['fas', 'arrow-up-right-from-square']" />
                </NuxtLink>
              </li>
              <li>
                <CopyToClipboard
                  :copy-text="props.uri"
                  class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-sm w-[calc(100%)]"
                  success-message="Copied!"
                  error-message="Failed to copy"
                  :display-duration="3500">
                  Copy at-uri
                  <font-awesome-icon :icon="['far', 'clipboard']" />
                </CopyToClipboard>
              </li>
            </ul>
            <div class="py-2">
              <div
                v-if="record && record.langs"
                class="px-4 justify-start items-baseline text-xs text-right text-gray-600 dark:text-gray-400">
                Lang: {{ record.langs.join(',') }}
              </div>
              <div
                v-if="record && record.via"
                class="px-4 justify-start items-baseline text-xs text-right text-gray-600 dark:text-gray-400">
                Via: {{ record.via ?? 'none' }}
              </div>
            </div>
          </DropdownMenuButton>
        </ClientOnly>
        <div class="pt-1">
          <NuxtLink v-if="!isRemoved" :to="postURL">
            <!-- Created datetime -->
            <time
              v-if="record"
              :datetime="record.createdAt"
              :title="DateTime.fromISO(record.createdAt).toString()"
              class="text-sm font-light">
              <!-- Display time as relative -->
              {{
                DateTime.fromISO(record.createdAt).toRelative({
                  style: 'short',
                })
              }}
            </time>
          </NuxtLink>
          <time v-else>--</time>
        </div>
      </div>
    </div>
    <div class="pl-3 pr-4 text-gray-500 dark:text-gray-400">
      <!-- has reply ? -->
      <div v-if="!isRemoved && !isHidden">
        <AtHandleLink
          v-if="record?.text && record?.reply"
          :aturi="record?.reply.parent.uri"
          :with-handle="true"
          class="inline-block font-light text-xs text-gray-600 hover:text-gray-500 border border-gray-500 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-blue-300 rounded-lg px-3 py-1 text-center mr-1 mb-1 dark:border-slate-500 dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-500 dark:focus:ring-slate-800">
          <font-awesome-icon :icon="['fas', 'reply']" />
          Reply
        </AtHandleLink>
      </div>
      <!-- Post message -->

      <div
        v-if="record && !isHidden && !isRemoved"
        class="break-words whitespace-pre-line">
        <div class="text-sm">
          <RitchText :text="record.text" :facets="record.facets" />
        </div>
      </div>
      <div v-else-if="isHidden" class="italic">
        <!-- Hide posts for unauthorized user -->
        <font-awesome-icon :icon="['fas', 'eye-slash']" />
        You must be logged in to view posts.
      </div>
      <div v-else-if="isRemoved" class="italic">
        <!-- Post removed -->
        <font-awesome-icon :icon="['far', 'trash-can']" />
        This post may have been removed.
      </div>
      <div v-else class="italic">
        <!-- Post removed -->
        <font-awesome-icon :icon="['fas', 'spinner']" spin-pulse />
        Loading...
      </div>
      <div v-if="record && record.embed">
        <!-- Embedded (image, record...) -->
        <PostEmbed :did="did" :embed="record.embed">
          <template #fallback>
            <div class="flex justify-center">
              <font-awesome-icon :icon="['fas', 'spinner']" spin-pulse />
              Loading...
            </div>
          </template>
        </PostEmbed>
      </div>
    </div>

    <div class="flex justify-end items-end">
      <div v-if="record" class="mt-3 inline-box">
        <!-- Labels -->
        <ul
          v-if="record.labels?.values && record.labels.values.length > 0"
          class="inline-block">
          <li
            v-for="(label, index) in record.labels.values"
            :key="index"
            class="inline-block items-center px-1 py-0.5 mr-2 text-xs font-medium rounded"
            :class="
              label.val === '!warn'
                ? `text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300`
                : label.val === 'porn' || label.val === 'nsfw'
                  ? `text-pink-500 bg-pink-100 dark:bg-pink-700 dark:text-pink-300`
                  : label.val === 'spam'
                    ? `text-zinc-800 bg-zinc-100 dark:bg-zin-900 dark:text-zinc-300`
                    : `text-indigo-800 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300`
            ">
            <font-awesome-icon :icon="['fas', 'tag']" class="mr-1" size="xs" />
            {{ label.val }}
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import {
    useAppConfig,
    onMounted,
    ref,
    useAuth,
    isDev,
    ClientPost,
    toRaw,
  } from '#imports'
  import { FwbAvatar } from 'flowbite-vue'
  import { defineProps, type PropType, type Ref } from 'vue'
  import { DateTime } from 'luxon'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { AppBskyActorProfile, AppBskyFeedPost } from '@atproto/api'
  import type { AppConfig } from '@nuxt/schema'
  import { UnauthenticatedError } from '~/errors/UnauthenticatedError'
  import * as bskyutils from '~/utils/bskyutils'

  const props = defineProps({
    uri: {
      type: String,
      required: true,
    },
    did: {
      type: String,
      required: true,
    },
    cid: {
      type: String,
      required: false,
    },
    rkey: {
      type: String,
      required: true,
    },
    pds: {
      type: String,
      required: true,
    },
    postRecord: {
      type: Object as PropType<AppBskyFeedPost.Record>,
      required: false,
      default: () => ({}),
    },
    profile: {
      type: Object as PropType<AppBskyActorProfile.Record>,
      required: true,
    },
  })
  const config: AppConfig = useAppConfig()
  const auth = useAuth()

  const postURL: Ref<string> = ref('#')

  const profile: Ref<AppBskyActorProfile.Record> = ref(props.profile)
  const handle: Ref<string> = ref('Unknown')
  const displayName: Ref<string> = ref('Unknown')
  const avatarURL: Ref<string | null> = ref(null)
  const record: Ref<AppBskyFeedPost.Record> = ref(props.postRecord)
  const isRemoved: Ref<boolean> = ref(false)
  const isHidden: Ref<boolean> = ref(false)
  const pdsEndpoint: Ref<string> = ref(config.defaultPDSEntrypoint)

  onMounted(async () => {
    try {
      if (props.pds) {
        pdsEndpoint.value = props.pds
      } else {
        pdsEndpoint.value = await bskyutils.getPDSEndpointByDID(props.did)
      }
      if (props.profile) {
        profile.value = props.profile
        handle.value =
          (props.profile.handle as string) ??
          (await bskyutils.resolveDID(props.did, true)) ??
          'Unknown'
        displayName.value =
          props.profile.displayName ??
          (props.profile.handle as string) ??
          'Unknown'
      } else {
        handle.value = await bskyutils.resolveDID(props.did, true)
        const profileRecord = (await bskyutils.loadProfile(
          props.did,
          pdsEndpoint.value
        )) as AppBskyActorProfile.Record
        profile.value = profileRecord
      }

      if (props.postRecord) {
        const atUri = bskyutils.parseAtUri(props.uri)
        // console.log(toRaw(profile.value))
        avatarURL.value = bskyutils.buildBlobRefURL(
          config.cdnPrefix,
          props.did,
          profile.value,
          'avatar',
          pdsEndpoint.value
        )
        postURL.value = ClientPost.getPermanentLink(atUri.did, atUri.rkey)
      } else {
        // Initialize client
        const client = await ClientPost.load(
          config,
          props.uri,
          pdsEndpoint.value
        )

        postURL.value = ClientPost.getPermanentLink(
          client.handle ?? client.did,
          client.atUri.rkey
        )
        isHidden.value = client.isHidden
        if (auth.isLoggedIn()) {
          isHidden.value = false
          ClientPost.loadProfileBlobs(client)
          await ClientPost.loadPost(client)
        }
        handle.value = client.handle ?? 'Unknown'
        displayName.value =
          client.profile.displayName ?? client.handle ?? 'Unknown'
        avatarURL.value = client.avatarURL
        if (isDev()) {
          console.log('atUri = ', client.atUri)
          console.log('props.uri = ', props.uri)
          console.log('postURL = ', postURL.value)
        }
        record.value = client.record
        isRemoved.value = client.isRemoved
      }
    } catch (e) {
      console.error(e)
      if (e instanceof UnauthenticatedError) {
        isHidden.value = !auth.isLoggedIn()
      } else isRemoved.value = true
    }
  })
</script>

<style scoped>
  .at-handle::before {
    content: '@';
  }
  .avatar-object-cover :deep(img) {
    @apply object-cover;
  }

  .post-text a:link {
    @apply text-blue-500 dark:text-blue-400;
  }
  .post-text a:hover {
    @apply text-blue-400 dark:text-blue-500;
  }
</style>
