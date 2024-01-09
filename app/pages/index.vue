<template>
  <div
    class="flex flex-col justify-center max-w-screen-xl min-h-screen pt-10 lg:pt-0 sm:items-start md:items-center bg-gray-100 dark:bg-slate-900">
    <div class="mx-auto pb-10 text-center">
      <div
        class="text-8xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400 mb-6">
        {{ appName }}
      </div>
      <div class="text-xl text-gray-700 dark:text-slate-500">
        Toybox for Bluesky
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4 md:gap-8 mx-10 max-w-2xl">
      <NuxtLink to="/profile" class="feature-card">
        <h2 class="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">
          View Profile
        </h2>
        <p class="text-md font-normal text-gray-500 dark:text-gray-400 mb-4">
          You can view posts, followings, and other information of users with
          specified IDs. No login is required becauseas only AT Protocol is
          used.
        </p>
      </NuxtLink>
      <NuxtLink to="/invite-code" class="feature-card">
        <h2
          class="text-gray-900 dark:text-white text-3xl font-extrabold mb-2 line-through">
          Invite code
        </h2>
        <span href="#" class="label-maintain">
          <ClientOnly>
            <font-awesome-icon
              :icon="['fas', 'triangle-exclamation']"
              class="mr-1 text-xs" />
          </ClientOnly>
          Temporary closed
        </span>
        <span href="#" class="label-auth-required">
          <ClientOnly>
            <font-awesome-icon :icon="['fas', 'lock']" class="mr-1 text-xs" />
          </ClientOnly>
          Authentication required
        </span>
        <p
          class="text-md font-normal text-gray-300 dark:text-gray-500 mb-4 line-through">
          View history of invite code grants, usage (and whom used). To use this
          feature, you must be logged into Bluesky using AppPassword.
        </p>
      </NuxtLink>
      <NuxtLink to="/history" class="feature-card">
        <h2 class="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">
          Identity history
        </h2>
        <p class="text-md font-normal text-gray-500 dark:text-gray-400 mb-4">
          You can view handle history of identity creation, update, and
          deletion. This feature will be merge Profile page in the future.
        </p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAppConfig, useSeoMeta } from '#imports'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const config = useAppConfig()
  const appName = config.title
  useSeoMeta({
    title: config.title,
    ogTitle: config.title,
    ogImage: `${config.cdnPrefix}/images/ogp/default.png`,
  })
</script>

<style scoped>
  .feature-card {
    @apply bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6;
  }
  .label-auth-required {
    @apply bg-green-100 text-green-500 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 mb-2;
  }
  .label-maintain {
    @apply bg-yellow-300 text-gray-900 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-yellow-400 dark:text-gray-700 mb-2;
  }
</style>
