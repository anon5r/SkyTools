<template>
  <div>
    <header>
      <Navbar />
    </header>
    <NuxtPage />
    <footer class="py-6 px-4">
      <Footbar />
    </footer>
  </div>
</template>

<script>
  export default {
    title: 'Skytools',
  }
</script>

<style scoped>
  /* Common styles */
  div {
    @apply min-h-max text-base dark:text-slate-300 bg-gray-100 dark:bg-slate-900;
  }
</style>
