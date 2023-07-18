<template>
  <div class="px-4 py-4 my-5 rounded-md bg-white dark:bg-slate-800">
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <div
          class="inline-flex items-center mr-1 text-md font-bold text-gray-900 dark:text-white">
          <!-- Avatar -->
          <a :href="`${config.bskyAppURL}/profile/${props.handle}`">
            <Avatar rounded :img="avatarURL" :alt="props.handle" class="mr-3 min-w-max" />
          </a>
        </div>
        <div>
          <!-- DisplayName -->
          <a :href="`${config.bskyAppURL}/profile/${props.handle}`">
            {{ props.profile ? props.profile.value.displayName : props.handle }}
          </a>
          <p class="text-xs font-mono text-gray-500 dark:text-slate-500">
            <!-- Handle -->
            <a :href="`${config.bskyAppURL}/profile/${props.handle}`">
              @{{ props.handle }}
            </a>
          </p>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-600 dark:text-slate-400">
          <button
            type="button"
            class="inline-block font-medium text-base text-blue-600 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 rounded-lg px-3 py-1 text-center mr-1 mb-1 dark:border-blue-700 dark:text-blue-700 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            @click.prevent="clickLookup">
            Lookup
          </button>
        </p>
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
          }
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

  const clickLookup = () => {
    emits('lookup', props.handle)
  }
</script>
