<template>
  <div
    :id="props.id"
    tabindex="-1"
    class="fixed top-0 right-0 z-40 h-full md:h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-gray-200 w-64 dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm"
    aria-label="sidebar"
    aria-labelledby="drawer-label">
    <div>
      <h5
        id="drawer-label"
        class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
        {{ props.label }}
      </h5>
      <!-- Close button for drawer sidebar -->
      <button
        v-if="props.closeButton"
        type="button"
        id="drawer-menu-close-button"
        data-drawer-hide="drawer-sidebar"
        aria-controls="drawer-sidebar"
        class="text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white">
        <svg
          class="w-3 h-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
        <span class="sr-only">Close</span>
      </button>

      <div class="py-4 overflow-y-auto">
        <slot></slot>
      </div>
    </div>

    <!-- Sidebar footer -->
    <div
      class="absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex z-20 border-r">
      <NuxtLink
        to="/about"
        class="inline-flex justify-start py-1 px-5 text-sm text-gray-600 dark:text-slate-300">
        About
      </NuxtLink>

      <!-- Dark mode toggle button -->
      <ToggleDarkmode class="inline-block justify-between px-5 rounded-sm" />
    </div>
  </div>
</template>

<script setup>

  const props = defineProps({
    id: {
      type: String,
      require: true,
    },
    label: {
      type: String,
      require: false,
      default: 'Sidebar',
    },
    closeButton: {
      type: Boolean,
      require: false,
      default: false,
    },
  })
</script>
