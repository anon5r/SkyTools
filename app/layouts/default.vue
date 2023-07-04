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
  import Navbar from '~/components/Navbar.vue'
  import Footbar from '~/components/Footbar.vue'
  export default {
    title: 'Skytools',
    components: {
      Navbar,
      Footbar,
    },
  }
</script>

<style scoped>
  /* Common styles */
  div {
    @apply min-h-max text-base dark:text-slate-300 bg-gray-100 dark:bg-slate-900;
  }
</style>
