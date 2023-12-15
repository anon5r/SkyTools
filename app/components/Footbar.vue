<template>
  <div
    class="p-4 shadow w-full mx-auto bg-gray-100 dark:bg-gray-800 md:flex md:items-center md:justify-between">
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
      &copy; {{ year }}
      <NuxtLink to="/" class="hover:underline">SkyTools</NuxtLink>
      All Rights Reserved.
    </span>
    <ul
      class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
      <li>
        <NuxtLink to="/about" class="mr-4 hover:underline md:mr-6">
          About
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
  const year = new Date().getFullYear()
</script>
