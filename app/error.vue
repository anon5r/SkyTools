<template>
  <div class="min-h-max text-base dark:text-slate-300 bg-gray-100 dark:bg-slate-900">
    <header>
      <Navbar />
    </header>
    <main class="bg-gray-100 dark:bg-gray-900">
      <section>
        <div class="px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <h1
              class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-300 dark:text-slate-500">
              {{ error.statusCode }}
            </h1>
            <div
              class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              <div v-if="error.statusCode === 404">
                <p>
                  <code>{{ $route.path }}</code>
                </p>
                is not found.
              </div>
              <div v-else>
                {{ error.statusMessage }}
              </div>
            </div>
            <div class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              <p v-if="error.statusCode === 404">
                The page you are looking for might have been removed had its name
                changed or is temporarily unavailable.
              </p>
              <p v-else>
                {{ error.description }}
              </p>
            </div>
            <a
              href="#"
              @click.prevent="$router.back()"
              class="inline-flex text-white dark:text-slate-100 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">
              Back to Previous Page
            </a>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <Footbar />
    </footer>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})
</script>
