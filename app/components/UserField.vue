<template>
  <div class="px-4 py-4 my-5 rounded-md shadow-md bg-white dark:bg-slate-800">
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <div
          class="inline-flex items-center mr-3 text-md font-bold text-gray-900 dark:text-white">
          <!-- Avatar -->
          <a :href="`/profile/${props.handle}`" @click.prevent="clickProfile">
            <fwb-avatar
              rounded
              :img="avatarURL"
              :alt="props.handle"
              class="min-w-max avatar-object-cover" />
          </a>
        </div>
        <div class="max-w-xs truncate">
          <!-- DisplayName -->
          <a
            :href="`/profile/${props.handle}`"
            class=""
            @click.prevent="clickProfile">
            {{
              props.profile?.displayName
                ? props.profile.displayName
                : props.handle
            }}
          </a>
          <p class="text-xs font-mono text-gray-500 dark:text-slate-500">
            <!-- Handle -->
            <a
              :href="`/profile/${props.handle}`"
              class="truncate"
              @click.prevent="clickProfile">
              @{{ props.handle }}
            </a>
          </p>
        </div>
      </div>

      <ClientOnly>
        <DropdownMenuButton icon="vertical" :id="`${props.did}`">
          <!-- dropdown menu -->
          <ul
            class="py-2 text-sm text-gray-600 dark:text-slate-400"
            :aria-labelledby="`dropdown-${props.did}-button`">
            <li>
              <NuxtLink
                :to="`/history?id=${props.handle}`"
                class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                Handle history
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="`${config.bskyAppURL}/profile/${props.handle}`"
                class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                target="_blank">
                Open in Bluesky
                <font-awesome-icon
                  :icon="['fas', 'arrow-up-right-from-square']" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="`https://web.plc.directory/did/${props.did}`"
                class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                target="_blank">
                View DID
                <font-awesome-icon
                  :icon="['fas', 'arrow-up-right-from-square']" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="`${props.pds}/xrpc/com.atproto.repo.getRecord?repo=${props.did}&collection=app.bsky.actor.profile&rkey=self`"
                class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                target="_blank">
                API (AT Protocol)
                <font-awesome-icon
                  :icon="['fas', 'arrow-up-right-from-square']" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="`${config.bskyAppURL.replace('https://', 'https://public.api.')}/xrpc/app.bsky.actor.getProfile?actor=${props.did}`"
                class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                target="_blank">
                API (Bluesky)
                <font-awesome-icon
                  :icon="['fas', 'arrow-up-right-from-square']" />
              </NuxtLink>
            </li>
            <li>
              <CopyToClipboard
                :copy-text="props.did"
                class="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-sm w-[calc(100%)]"
                success-message="Copied!"
                error-message="Failed to copy"
                :display-duration="3500">
                Copy DID
                <font-awesome-icon :icon="['far', 'clipboard']" />
              </CopyToClipboard>
            </li>
          </ul>
        </DropdownMenuButton>
      </ClientOnly>
    </div>
    <div class="text-sm pl-14 pr-16 max-w-fit truncate">
      <!-- Description -->
      {{ props.profile ? props.profile.description : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FwbAvatar } from 'flowbite-vue'
  import { useAppConfig, onMounted, ref } from '#imports'
  import type { AppBskyActorProfile } from '@atproto/api'
  import { buildBlobRefURL } from '~/utils/bskyutils'
  import type { PropType } from 'vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const config = useAppConfig()

  const props = defineProps({
    did: { type: String, required: true },
    profile: {
      /* AppBskyActorProfile.Record */
      type: Object as PropType<AppBskyActorProfile.Record>,
      default: () => {
        return {
          displayName: 'Unknown',
          description: '',
          avatar: null,
          banner: null,
          labels: {},
        }
      },
    },
    handle: String,
    pds: { type: String, required: false },
  })

  const emits = defineEmits(['showProfile'])

  const avatarURL = ref('')

  onMounted(() => {
    if (props.profile) {
      if (props.profile.avatar) {
        let repoEndpoint = props.pds ?? config.defaultPDSEntrypoint

        const url = buildBlobRefURL(
          config.cdnPrefix,
          props.did,
          props.profile,
          'avatar',
          repoEndpoint
        )
        avatarURL.value = url
      }
    }
  })

  const clickProfile = () => {
    emits('showProfile', props.handle)
  }
</script>

<style scoped>
  .avatar-object-cover :deep(img) {
    @apply object-cover;
  }
</style>
