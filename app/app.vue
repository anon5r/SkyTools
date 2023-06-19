<template>
  <div>
    <header>
      <Navbar />
    </header>
    <NuxtPage />
    <footer>
      <Footbar />
    </footer>
  </div>
</template>

<script setup type="ts">
  import { onMounted } from 'vue';
  import Navbar from '~/components/Navbar.vue'
  import Footbar from '~/components/Footbar.vue'
  import { initFlowbite } from 'flowbite'

  onMounted(() => {
    initFlowbite()
  })
</script>
