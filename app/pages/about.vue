<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
    <div class="w-full max-w-md pt-4 pb-4 text-right">
      <a class="pr-2" @click="changeLanguage('en')">English</a> /
      <a class="pl-2" @click="changeLanguage('ja')">日本語</a>
    </div>
    <div v-if="currentLanguage === 'ja'" class="w-full max-w-md">
      <!-- Japanese -->
      <h1 class="text-3xl font-semibold mb-4">このサイトについて</h1>
      <p class="mb-6">
        このサイトは、
        <NuxtLink to="https://bsky.app">Bluesky</NuxtLink>
        および
        <NuxtLink to="https://atproto.com">AT Protocol</NuxtLink>
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
        <NuxtLink
          to="https://bsky.app/profile/did%3Aplc%3Ac22jdrqhoajyj5ca7e56a3ke">
          anon5r.com
        </NuxtLink>
        までどうぞ
      </p>
    </div>

    <div v-else class="w-full max-w-md">
      <!-- English -->
      <h1 class="text-3xl font-semibold mb-4">About This Site</h1>
      <p class="mb-6">
        This site is a web application that uses the APIs of
        <NuxtLink to="https://bsky.app">Bluesky</NuxtLink>
        and
        <NuxtLink to="https://atproto.com">AT Protocol</NuxtLink>.
        It merely visualizes some of the APIs used within the service.
      </p>

      <h2 class="text-2xl font-semibold mb-4">
        About Sign-in to Bluesky and Sessions
      </h2>
      <p class="mb-6">
        Login request is sent directly to the Bluesky server and is handled entirely within the browser.
        Session will be deleted when your browser is closed, timeout, or when you will sign out.
      </p>

      <h2 class="text-2xl font-semibold mb-4">Contact</h2>
      <p>
        Please contact us at
        <NuxtLink
          to="https://bsky.app/profile/did%3Aplc%3Ac22jdrqhoajyj5ca7e56a3ke">
          anon5r.com
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';

const currentLanguage = ref('en');

function changeLanguage(lang) {
  currentLanguage.value = lang;
}
</script>
