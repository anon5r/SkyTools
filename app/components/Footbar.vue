<template>
  <footer class="mt-4 px-4 py-1 bg-white shadow dark:bg-gray-800">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        &copy; {{ (new Date).getFullYear() }} <NuxtLink to="/" class="hover:underline">SkyTools</NuxtLink>. All Rights Reserved.</span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a href="/about" class="mr-4 hover:underline md:mr-6 ">About</a>
        </li>
    </ul>
    </div>
  </footer>

</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
