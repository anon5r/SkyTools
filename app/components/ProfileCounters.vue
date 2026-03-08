<template>
  <div
    class="flex justify-around p-4 bg-white dark:bg-slate-800 rounded-md shadow-sm">
    <div class="text-center">
      <span class="block text-2xl font-bold text-gray-900 dark:text-slate-100">
        {{ followersCount }}
      </span>
      <span class="text-gray-500 dark:text-slate-400 text-sm">Followers</span>
    </div>
    <div class="text-center">
      <span class="block text-2xl font-bold text-gray-900 dark:text-slate-100">
        {{ followsCount }}
      </span>
      <span class="text-gray-500 dark:text-slate-400 text-sm">Following</span>
    </div>
    <div class="text-center">
      <span class="block text-2xl font-bold text-gray-900 dark:text-slate-100">
        {{ postsCount }}
      </span>
      <span class="text-gray-500 dark:text-slate-400 text-sm">Posts</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    followersCount: {
      type: Number,
      required: false,
      default: 0,
    },
    followsCount: {
      type: Number,
      required: false,
      default: 0,
    },
    postsCount: {
      type: Number,
      required: false,
      default: 0,
    },
  })
</script>
