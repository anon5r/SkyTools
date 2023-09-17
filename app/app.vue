<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer>
      <Footbar />
    </footer>
  </div>
</template>


<style scoped>
  div {
    @apply min-h-max text-base dark:text-slate-300 bg-gray-100 dark:bg-slate-900;
  }
</style>
