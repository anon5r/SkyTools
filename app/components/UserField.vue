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
              props.profile?.value.displayName
                ? props.profile.value.displayName
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
    </div>
    <div class="text-sm pl-14 pr-16 max-w-fit truncate">
      <!-- Description -->
      {{ props.profile ? props.profile.value.description : '' }}
    </div>
  </div>
</template>

<script setup>
  import { FwbAvatar } from 'flowbite-vue'
  import { useAppConfig } from 'nuxt/app'
  import { defineProps, defineEmits, onMounted, ref } from 'vue'
  import { buildAvatarURL } from '@/utils/lexicons'

  const config = useAppConfig()

  const props = defineProps({
    did: String,
    profile: {
      /* AppBskyActorProfile.Record */
      type: Object,
      default: () => {
        return {
          value: {
            displayName: '',
            description: '',
            avatar: '',
            banner: null,
          },
        }
      },
    },
    handle: String,
  })

  const emits = defineEmits(['showProfile'])

  const avatarURL = ref('')

  onMounted(() => {
    if (props.profile) {
      if (props.profile.value.avatar) {
        const url = buildAvatarURL(
          config.cdnPrefix,
          props.did,
          props.profile.value
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
