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

<script type="ts">
import { computed } from 'vue'
// import { useSessionStore } from '@/stores/session'
import { useSession } from '@/composables/session'

import Navbar from '~/components/Navbar.vue'
import Footbar from '~/components/Footbar.vue'

export default {
  title: 'SkyTools',
  components: {
    Navbar,
    Footbar
  }
}
</script>
