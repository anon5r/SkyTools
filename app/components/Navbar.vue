<template>
  <div>
    <nav
      class="sticky w-full top-0 left-0 border-b z-20 backdrop-blur-md border-gray-200 dark:bg-slate-950 dark:border-gray-700 opacity-90">
      <div
        class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <span
            class="self-center text-2xl text-transparent bg-clip-text bg-gradient-to-b to-blue-700 from-green-300 dark:to-orange-500 dark:from-sky-300 font-semibold whitespace-nowrap dark:text-sky">
            {{ appName }}
          </span>
        </NuxtLink>
        <!-- Side menu button by drawer -->
        <DrawerControlButton
          id="drawer-menu-button"
          target="drawer-sidebar"
          label="Open Menu"
          placement="right">
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
        </DrawerControlButton>
      </div>
    </nav>

    <!-- Drawer menu -->
    <aside>
      <DrawerSidebar id="drawer-sidebar" label="Menu" :drawer="drawer">
        <ul
          v-for="item in navItems.contents"
          :key="item.src"
          class="space-y-2 font-medium">
          <NavLink
            :href="item.src"
            :icon="item.icon"
            :require-signin="item.requireSignin">
            {{ item.title }}
          </NavLink>
        </ul>
        <!-- -------------------- -->

        <hr class="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <ClientOnly>
          <ul
            class="mt-1 space-y-2">
            <li v-if="isLoggedIn">
              <span
                class="text-sm font-semibold text-gray-500 dark:text-gray-400">
                @<span class="select-all">{{ userHandle }}</span>
              </span>
            </li>

            <li v-if="isLoggedIn">
              <!-- Sign-out -->
              <NuxtLink
                to="/self/profile"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                <font-awesome-icon
                  :icon="['fas', 'user']"
                  class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span class="ml-3">My profile</span>
              </NuxtLink>
            </li>
            <li v-if="isLoggedIn">
              <!-- Sign-out -->
              <NuxtLink
                href="#sign-out"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                @click.prevent="logout">
                <FontAwesomeIcon
                  :icon="['fas', 'right-from-bracket']"
                  class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span class="ml-3">Sign out</span>
              </NuxtLink>
            </li>
            <li v-else-if="!isLoggedIn">
              <!-- Sign-in -->
              <NuxtLink
                :to="`/${config.defaultPDS}/signin`"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <font-awesome-icon
                  :icon="['fas', 'right-to-bracket']"
                  class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span class="ml-3">Sign in Bluesky</span>
              </NuxtLink>
            </li>
            <li v-else-if="!isLoggedIn">
              <!-- Sign-in -->
              <NuxtLink
                :to="`/${config.defaultPDS}/signin`"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <font-awesome-icon
                  :icon="['fas', 'right-to-bracket']"
                  class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span class="ml-3">Sign in Bluesky</span>
            </NuxtLink>
            </li>
          </ul>
        </ClientOnly>
      </DrawerSidebar>
    </aside>
  </div>
</template>

<script setup>
  import { useAppConfig, useRoute } from 'nuxt/app'
  import { ref, reactive, onMounted, computed, watch } from 'vue'
  import { initDrawers } from 'flowbite'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { useNavigation } from '@/composables/navigation'
  import { getAgent, restoreSession, logout as destroySession, isLoggedIn as isLogin, getHandle, getEmail } from '@/composables/auth'
  // import { getDrawer, initDrawer } from '@/composables/sidebar'

  const config = useAppConfig()
  const route = useRoute()
  const isLoggedIn = ref(false)


  // const auth = useAuth()
  const agent = ref(getAgent())
  const userHandle = ref(null)
  const userEmail = ref(null)

  watch(isLoggedIn, (newValue) => {
    if (newValue) {
      // Log in
      userHandle.value = getHandle()
      userEmail.value = getEmail()
    } else {
      // Log out
      userHandle.value = null
      userEmail.value = null
    }
    isLoggedIn.value = newValue
  })

  // App name
  const appName = config.title

  // Navbar linik
  const navItems = reactive({
    contents: [
      {
        src: '/profile',
        title: 'Profile',
        icon: ['fas', 'id-card'],
        requireSignin: false,
      },
      {
        src: '/history',
        title: 'Handle history',
        icon: ['fas', 'clock-rotate-left'],
        requireSignin: false,
      },
      {
        src: '/invite-code',
        title: 'Invite code',
        icon: ['fas', 'ticket'],
        requireSignin: true,
      },
    ],
  })


  const logout = () => {

    const navi = useNavigation()
    if (isLogin()) {
      const nextPage = route.fullPath
      navi.setNext(nextPage)

      destroySession()
      userHandle.value = null
      userEmail.value = null
      isLoggedIn.value = false
    }
    navi.goHome()
  }

  onMounted(async () => {
    initDrawers()

    if (agent.value === null)
      agent.value = getAgent()
      await restoreSession()

      if (!isLogin()) {
        agent.value = getAgent()
        restoreSession()
        .then((result) => {
          if (result) {
            isLoggedIn.value = true
          }
        })
      } else
        isLoggedIn.value = true
  })

  computed(() => {
    isLoggedIn.value = isLogin()
  })
</script>
