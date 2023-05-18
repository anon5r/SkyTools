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

<script>
import Navbar from '~/components/Navbar.vue'
import Footbar from '~/components/Footbar.vue'

export default {
  components: {
    Navbar,
    Footbar
  }
}
</script>
