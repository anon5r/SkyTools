<template>
  <div>
    <header>
      <Navbar />
    </header>

    <NuxtPage /> <!-- ページコンポーネントを表示 -->
    <footer>
      <Footbar />
    </footer>
  </div>
</template>

<script type="ts">
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
