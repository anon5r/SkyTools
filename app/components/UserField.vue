<template>
  <div class="px-4 py-4 my-5 rounded-md shadow-md bg-white dark:bg-slate-800">
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <div
          class="inline-flex items-center mr-3 text-md font-bold text-gray-900 dark:text-white">
          <!-- Avatar -->
          <NuxtLink
            :to="`/profile/${props.handle}`"
            @click.prevent="clickProfile">
            <fwb-avatar
              rounded
              :img="avatarURL"
              :alt="props.handle"
              class="min-w-max avatar-object-cover" />
          </NuxtLink>
        </div>
        <div class="xl:max-w-xl lg:max-w-lg md:max-w-md max-w-64 truncate">
          <!-- DisplayName -->
          <NuxtLink
            :to="`/profile/${props.handle}`"
            class=""
            @click.prevent="clickProfile">
            {{
              props.profile?.displayName
                ? props.profile.displayName
                : props.handle
            }}
          </NuxtLink>
          <p
            class="md:text-sm text-xs font-mono text-gray-500 dark:text-slate-500">
            <!-- Handle -->
            <NuxtLink
              :to="`/profile/${props.handle}`"
              class="truncate"
              @click.prevent="clickProfile">
              @{{ props.handle }}
            </NuxtLink>
          </p>
        </div>
      </div>

      <ButtonDebugMenu
        :id="props.did"
        :did="props.did"
        :handle="props.handle"
        :pds="props.pds" />
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
