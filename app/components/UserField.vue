<template>
  <div class="px-4 py-4 my-5 rounded-md shadow-md bg-white dark:bg-slate-800">
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <div
          class="inline-flex items-center mr-1 text-md font-bold text-gray-900 dark:text-white">
          <!-- Avatar -->
          <a :href="`/profile/${props.handle}`"
            @click.prevent="showProfile">
            <Avatar
              rounded
              :img="avatarURL"
              :alt="props.handle"
              class="mr-3 min-w-max" />
          </a>
        </div>
        <div>
          <!-- DisplayName -->
          <a
            :href="`/profile/${props.handle}`"
            class="truncate text-ellipsis overflow-hidden"
            @click.prevent="showProfile">
            {{ props.profile ? props.profile.value.displayName : props.handle }}
          </a>
          <p class="text-xs font-mono text-gray-500 dark:text-slate-500">
            <!-- Handle -->
            <a
              :href="`/profile/${props.handle}`"
              class="truncate text-ellipsis overflow-hidden"
              @click.prevent="showProfile">
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
  import { Avatar } from 'flowbite-vue'
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

  const emits = defineEmits({ lookup: null })

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

  const showProfile = () => {
    emits('lookup', props.handle)
  }
</script>
