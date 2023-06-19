<template>
  <div>
    <header>
      <Navbar />
    </header>
    <NuxtPage />
    <footer class="bg-gray-800 text-white py-6 px-4">
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
</style>
