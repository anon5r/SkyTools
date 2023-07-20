<template>
  <nav class="bg-white border-gray-200 dark:bg-slate-950 dark:border-gray-700">
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" class="flex items-center">
        <span
          class="self-center text-2xl text-transparent bg-clip-text bg-gradient-to-b to-blue-600 from-green-100 dark:to-orange-600 dark:from-sky-300 font-semibold whitespace-nowrap dark:text-sky">
          {{ appName }}
        </span>
      </a>
      <button
        data-collapse-toggle="navbar-dropdown"
        type="button"
        class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-dropdown"
        aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"></path>
        </svg>
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
        <ul
          class="flex flex-col font-medium p-4 md:p-0 border border-gray-100 rounded-lg bg-transparent md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:border-gray-700">
          <li>
            <NuxtLink
              to="/"
              class="block py-2 pl-3 pr-4 rounded text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-500 bg-transparent md:p-0">
              Home
            </NuxtLink>
          </li>
          <li>
            <button
              id="dropdownNavbarLink"
              data-dropdown-toggle="dropdownNavbar"
              class="flex items-center justify-between w-full py-2 pl-3 pr-4 text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-500 focus:text-blue-500 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 md:w-auto dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
              Tools
              <svg
                class="w-5 h-5 ml-1"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>

            <div
              id="dropdownNavbar"
              class="z-10 hidden font-normal bg-white divide-y divide-gray-200 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
              <ul
                class="py-2 text-sm text-gray-700 dark:text-gray-400"
                aria-labelledby="dropdownLargeButton">
                <li v-for="item in navItems.tools" :key="item.src">
                  <NuxtLink
                    :to="item.src"
                    class="flex items-center justify-between w-full px-4 py-2 flex-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    {{ item.title }}
                    <span v-if="item.requireSignin">
                      <ClientOnly>
                        <font-awesome-icon
                          :icon="['fas', 'user-lock']"
                          class="text-gray-400 dark:text-gray-400"
                          tooltip="Authorization required" />
                      </ClientOnly>
                    </span>
                  </NuxtLink>
                </li>
              </ul>
              <div v-if="isLoggedIn" class="py-1">
                <a
                  href="#"
                  @click.prevent="logout"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">
                  <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
                  Sign out from Bluesky
                </a>
              </div>
            </div>
          </li>
          <li>
            <NuxtLink
              to="/about"
              class="block py-2 pl-3 pr-4 rounded text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
              About
            </NuxtLink>
          </li>
          <li>
            <ToggleDarkmode class="block pl-3 rounded" />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { useRoute, useRouter, useAppConfig } from 'nuxt/app'
  import { ref, onMounted, defineComponent, reactive, computed } from 'vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { initFlowbite } from 'flowbite'
  import { useAuth } from '@/composables/auth'
  import { useNavigation } from '@/composables/navigation'

  defineComponent({ name: 'Navbar' })

  onMounted(async () => {
    initFlowbite()

    auth.value = await useAuth()
    isLoggedIn.value = auth.value.isLoggedIn
  })

  computed(() => {
    isLoggedIn.value = auth.value.isLoggedIn
  })

  const navItems = reactive({
    tools: [
      { src: '/profile', title: 'Profile', requireSignin: false },
      { src: '/history', title: 'Handle history', requireSignin: false },
      // { src: '/blocking', title: 'Blocking', requireSignin: false },
      { src: '/invite-code', title: 'Invite code', requireSignin: true },
    ],
  })

  const route = useRoute()
  const router = useRouter()
  const auth = ref(null)
  const navi = useNavigation()
  const config = useAppConfig()
  const appName = config.title

  const isLoggedIn = ref(false)

  const logout = () => {
    if (auth.value.isLoggedIn) {
      const nextPage = route.fullPath
      if (!navi.navigate.value)
        navi.navigate = useNavigation({ next: null, prev: null })
      navi.navigate.value.next = null

      auth.value.logout()
      isLoggedIn.value = false
      router.push(nextPage)
    }
    router.push('/')
  }
</script>
