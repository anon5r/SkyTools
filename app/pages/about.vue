<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-3xl font-semibold mb-4">このサイトについて</h1>
    <p class="mb-6">
      このサイトは、
      <NuxtLink to="https://bsky.app">Bluesky</NuxtLink>
      および
      <NuxtLink to="https://atproto.com">Atprotocol</NuxtLink>
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
</template>

<script setup>
  // Vue 3 の <script setup> を使用しています。
</script>

<style scoped>
  /* Flowbite CSS を使用し、必要に応じてカスタムスタイルを適用 */
</style>
