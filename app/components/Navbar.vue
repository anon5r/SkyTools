<template>
  <div>
  <ClientOnly>
    <nav
      class="sticky w-full top-0 left-0 border-b z-20 backdrop-blur-md border-gray-200 dark:bg-slate-950 dark:border-gray-700 opacity-90">
      <div
        class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- Logo -->
        <a href="/" class="flex items-center">
          <span
            class="self-center text-2xl text-transparent bg-clip-text bg-gradient-to-b to-blue-600 from-green-100 dark:to-orange-600 dark:from-sky-300 font-semibold whitespace-nowrap dark:text-sky">
            {{ appName }}
          </span>
        </a>

        <!-- Side menu button by drawer -->
        <DrawerControlButton
          id="drawer-menu-button"
          target="drawer-sidebar"
          label="Open Menu"
          placement="right"
          @click="toggleMenu">
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
      <DrawerSidebar
        id="drawer-sidebar"
        label="Sidebar"
        :drawer="drawer"
        >
        <ul
          v-for="item in navItems.contents"
          :key="item.src"
          class="space-y-2 font-medium">
          <NavLink
            :href="item.src"
            :icon="item.icon"
            :require-signin="item.requireSignin"
            @click="clickLink">
            {{ item.title }}
          </NavLink>
        </ul>
        <!-- -------------------- -->
        <ul class="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <li>
            <!-- Sign-in -->
            <a
              :href="`/${config.defaultPDS}/signin`"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              @click="clickLink">
              <font-awesome-icon
                :icon="['fas', 'right-to-bracket']"
                class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
              <span class="ml-3">Sign in Bluesky</span>
            </a>
          </li>
          <li>
            <!-- Sign-out -->
            <a
              href="#sign-out"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              @click="clickLink">
              <font-awesome-icon
                :icon="['fas', 'right-from-bracket']"
                class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
              <span class="ml-3">Sign out</span>
            </a>
          </li>
        </ul>
      </DrawerSidebar>
    </aside>
  </ClientOnly>
  </div>
</template>

<script setup>
  import { useAppConfig, useRoute, useRouter } from 'nuxt/app'
  import { onMounted } from 'vue'
  import { initFlowbite, Drawer } from 'flowbite'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { useNavigation } from '@/composables/navigation'

  const config = useAppConfig()
  const auth = ref(null)
  const navi = useNavigation()
  const isLoggedIn = ref(false)

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
        icon: ['fas', 'handshake'],
        requireSignin: true,
      },
    ],
  })

  /** Drawer */
  let drawer = null

  const clickLink = () => {
    if (!drawer) initDrawer()
    if (drawer.isVisible()) drawer.hide()
  }

  const initDrawer = () => {
    const $taragetDrawer = document.getElementById('drawer-sidebar')
    if ($taragetDrawer !== null) {
      const drawerOptions = {
        placement: 'right',
        bodyScrolling: true,
        onToggle: (e) => {
          console.log('toggle(e) = ', e)
        },
      }
      drawer = new Drawer($taragetDrawer, drawerOptions)
    }
  }

  const toggleMenu = () => {
    drawer.toggle()
  }

  onMounted(() => {
    initFlowbite()

    nextTick(() => {
      if (!drawer)
        initDrawer()
    })
  })
</script>
