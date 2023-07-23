<template>
  <button
    type="button"
    class="font-medium rounded-lg text-sm px-5 py-2.5 mr-2 text-gray-500 bg-transparent hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 focus:outline-none"
    :data-drawer-target="props.target"
    :data-drawer-toggle="props.target"
    data-drawer-body-scrolling="true"
    :data-drawer-placement="props.placement"
    :aria-controls="props.target"
    :aria-label="props.label">
    <span class="sr-only">{{ props.label }}</span>
    <slot></slot>
  </button>
</template>

<script setup>
  import { defineProps } from 'vue'

  const props = defineProps({
    id: {
      type: String,
      require: true,
    },
    target: {
      type: String,
      require: true,
    },
    label: {
      type: String,
      require: false,
      default: 'Open menu'
    },
    placement: {
      type: String,
      require: false,
      default: 'right',
    },
  })
</script>
