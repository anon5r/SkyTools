<template>
  <div
    class="flex flex-col px-4 justify-center items-center h-screen md:min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200">
    <div class="w-full max-w-md md:pt-4 pb-4 text-right">
      <a class="pr-2" href="#en" @click.prevent="changeLanguage('en')">
        English
      </a>
      |
      <a class="pl-2" href="#ja" @click.prevent="changeLanguage('ja')">
        日本語
      </a>
    </div>
    <div v-if="currentLanguage === 'ja'" class="w-full max-w-md">
      <!-- Japanese -->
      <h1 class="text-3xl font-semibold mb-4">このサイトについて</h1>
      <p class="mb-6">
        このサイトは、
        <NuxtLink :to="config.bskyAppURL" target="_blank">Bluesky</NuxtLink>
        および
        <NuxtLink to="https://atproto.com" target="_blank">
          AT Protocol
        </NuxtLink>
        のAPIを利用したウェブアプリケーションです。
        サービス内で使用されているAPIの一部を可視化しているだけです。
      </p>

      <h2 class="text-2xl font-semibold mb-4">
        Blueskyへのログインとセッションについて
      </h2>
      <p class="mb-6">
        ログイン情報は直接Blueskyサーバーに送信され、ブラウザ内のみで完結します。
        セッション情報はブラウザが閉じられるか、タイムアウト、またはサインアウトすると消去されます。
      </p>

      <h2 class="text-2xl font-semibold mb-4">問い合わせ先</h2>
      <p>
        <NuxtLink :to="adminURL" target="_blank">@{{ adminHandle }}</NuxtLink>
      </p>
    </div>

    <div v-else class="w-full max-w-md">
      <!-- English -->
      <h1 class="text-3xl font-semibold mb-4">About This Site</h1>
      <p class="mb-6">
        This site is a web application that uses the APIs of
        <NuxtLink :to="config.bskyAppURL" target="_blank">Bluesky</NuxtLink>
        and
        <NuxtLink to="https://atproto.com" target="_blank">
          AT Protocol
        </NuxtLink>
        . It merely visualizes some of the APIs used within the service.
      </p>

      <h2 class="text-2xl font-semibold mb-4">
        About Sign-in to Bluesky and Sessions
      </h2>
      <p class="mb-6">
        Sign-in request is sent directly to the Bluesky server and is handled
        entirely within the browser. Session will be deleted when your browser
        is closed, timeout, or when you will sign out.
      </p>

      <h2 class="text-2xl font-semibold mb-4">Contact</h2>
      <p>
        Please contact to
        <NuxtLink :to="adminURL" target="_blank">@{{ adminHandle }}</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
  import { useAppConfig, useSeoMeta, onMounted, ref } from '#imports'
  import { resolveDID } from '~/utils/lexicons'

  const config = useAppConfig()
  const currentLanguage = ref('en')
  const adminHandle = ref('admin')
  const adminURL = ref(
    config.adminDID
      ? `${config.bskyAppURL}/profile/${config.adminDID}`
      : 'admin'
  )

  function changeLanguage(lang) {
    currentLanguage.value = lang
  }

  onMounted(async () => {
    useSeoMeta({
      title: `About | ${config.title}`,
      ogTitle: `About | ${config.title}`,
      ogImage: `${config.prodURLPrefix}/images/ogp/default.png`,
      twitterCard: 'summary',
    })
    const handle = await resolveDID(config.adminDID, true)
    if (handle) {
      adminHandle.value = handle
      adminURL.value = `${config.bskyAppURL}/profile/${handle}`
    }
  })
</script>

<style scoped>
  a {
    @apply text-blue-500;
    cursor: hand;
  }

  a:hover {
    @apply text-blue-300;
  }
</style>
