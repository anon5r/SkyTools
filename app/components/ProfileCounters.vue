<template>
  <div class="flex flex-row min-w-strech">
    <div
      v-if="followersCount !== undefined"
      class="mr-2 font-light text-gray-600 dark:text-slate-500">
      <span class="font-semibold text-gray-900 dark:text-slate-200">
        {{ followersCount }}
      </span>
      followers
    </div>
    <div class="mx-2 font-light text-gray-600 dark:text-slate-500">
      <span class="font-semibold text-gray-900 dark:text-slate-200">
        {{ followsCount }}
      </span>
      following
    </div>
    <div class="ml-2 font-light text-gray-600 dark:text-slate-500">
      <span class="font-semibold text-gray-900 dark:text-slate-200">
        {{ postsCount }}
      </span>
      posts
    </div>
    <div
      v-if="likeCount !== undefined"
      class="ml-2 font-light text-gray-600 dark:text-slate-500">
      <span class="font-semibold text-gray-900 dark:text-slate-200">
        {{ likeCount }}
      </span>
      like
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'

  const props = defineProps({
    followersCount: {
      type: Number,
      required: false,
      default: undefined,
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
    likeCount: {
      type: Number,
      required: false,
      default: undefined,
    },
  })
</script>
