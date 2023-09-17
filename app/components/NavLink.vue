<template>
  <li>
    <NuxtLink
      :to="props.href"
      class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
      <span v-if="props.icon">
        <ClientOnly>
          <FontAwesomeIcon
            :icon="props.icon"
            class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
        </ClientOnly>
      </span>
      <div v-else class="flex-shrink w-6 h-5"></div>
      <span class="ml-3"><slot /></span>
      <span v-if="requireSignin">
        <ClientOnly>
          <FontAwesomeIcon
            :icon="['fas', 'user-lock']"
            class="pl-4 text-gray-400 dark:text-gray-400"
            tooltip="Authorization required" />
        </ClientOnly>
      </span>
    </NuxtLink>
  </li>
</template>

<script setup>
  import { defineProps } from 'vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const props = defineProps({
    href: {
      type: String,
      require: true,
    },
    icon: Array,
    requireSignin: {
      type: Boolean,
      require: false,
      default: false,
    },
  })
</script>
