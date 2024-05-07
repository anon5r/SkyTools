<template>
  <div>
    <button
      :id="`dropdown-${props.id}-button`"
      :data-dropdown-toggle="`dropdown-${props.id}-context`"
      :data-dropdown-placement="props.placement ?? 'bottom-end'"
      class="button-default"
      :class="`${props.buttonStyle ?? 'button-bg-default'}`"
      type="button">
      <span class="sr-only">Open context menu</span>
      <svg
        v-if="props.icon === 'vertical'"
        class="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 4 15">
        <path
          d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
      <svg
        v-else-if="props.icon === 'horizon'"
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 3">
        <path
          d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
      </svg>
    </button>
    <!-- Dropdown menu -->
    <div
      :id="`dropdown-${props.id}-context`"
      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from '#imports'
  import { initDropdowns } from 'flowbite'
  const props = defineProps({
    icon: {
      type: String,
      require: false,
      default: 'vertical',
    },
    id: {
      type: String,
      require: false,
      default: 'none',
    },
    placement: {
      type: String,
      require: false,
      default: 'bottom',
    },
    buttonStyle: {
      type: String,
      require: false,
      default: 'bg-default',
    },
  })
  onMounted(() => {
    initDropdowns()
  })
</script>

<style scoped>
  .button-default {
    @apply inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 rounded-lg focus:ring-1 focus:outline-none dark:text-white focus:ring-gray-50 dark:focus:ring-gray-600;
  }
  .button-bg-default {
    @apply bg-white hover:bg-gray-100 dark:bg-gray-800  dark:hover:bg-gray-700;
  }
  .button-bg-transparent {
    @apply bg-transparent;
  }
</style>
