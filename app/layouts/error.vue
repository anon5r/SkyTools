<template>
  <div>
    <section class="bg-gray-100 dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
          <h1
            class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-300 dark:text-slate-500">
            {{ error.statusCode }}
          </h1>
          <p
            v-if="error.statusCode >= 400 && error.statusCode < 500"
            class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            <code>{{ $route.path }}</code>
          </p>
          <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            {{ error.message }}
          </p>
          <a
            href="#"
            @click.prevent="$router.back()"
            class="inline-flex text-white dark:text-slate-100 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    props: { error: { type: Object, default: null } },
  }
</script>
