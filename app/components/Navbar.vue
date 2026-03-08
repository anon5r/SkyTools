<template>
  <div>
    <nav
      class="sticky w-full top-0 left-0 border-b z-20 backdrop-blur-md border-gray-200 dark:bg-slate-950 dark:border-gray-700 opacity-90">
      <div
        class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <span
            class="self-center text-2xl text-transparent bg-clip-text bg-gradient-to-b to-sky-400 to-80% from-green-300 from-20% via-60% via-sky-600 dark:from-30% dark:via-rose-400 dark:via-50% dark:to-yellow-400 dark:from-blue-500 font-semibold whitespace-nowrap dark:text-sky">
            {{ appName }}
          </span>
        </NuxtLink>
        <!-- Side menu button by drawer -->
        <button
          id="drawer-menu-button"
          data-drawer-target="drawer-sidebar"
          data-drawer-show="drawer-sidebar"
          data-drawer-placement="right"
          aria-controls="drawer-sidebar"
          type="button"
          class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 hover:bg-gray-100"
          aria-label="Open Menu">
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Drawer menu -->
    <aside>
      <div
        id="drawer-sidebar"
        class="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800"
        tabindex="-1"
        aria-labelledby="drawer-label">
        <h5
          id="drawer-label"
          class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
          <svg
            class="w-5 h-5 mr-2"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd" />
          </svg>
          Menu
        </h5>
        <button
          type="button"
          data-drawer-hide="drawer-sidebar"
          aria-controls="drawer-sidebar"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
          <span class="sr-only">Close menu</span>
        </button>

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

        <hr
          class="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700" >
        <ClientOnly>
          <ul class="mt-1 space-y-2">
            <li v-if="isLogin() && loginState.userHandle">
              <span
                class="text-sm font-semibold text-gray-500 dark:text-gray-400">
                @
                <span class="select-all">{{ loginState.userHandle }}</span>
              </span>
            </li>

            <li v-if="isLogin()">
              <!-- Profile -->
              <NuxtLink
                to="/self/profile"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <font-awesome-icon
                  icon="fa-solid fa-user"
                  class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span class="ml-3">My profile</span>
              </NuxtLink>
            </li>
            <li v-if="isLogin()">
              <!-- Sign-out -->
              <NuxtLink
                href="#sign-out"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                @click.prevent="logout">
                <font-awesome-icon
                  icon="fa-solid fa-right-from-bracket"
                  class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span class="ml-3">Sign out</span>
              </NuxtLink>
            </li>
            <li v-if="!isLogin()">
              <!-- Sign-in -->
              <NuxtLink
                :to="`/${config.defaultPDS}/signin`"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <font-awesome-icon
                  icon="fa-solid fa-right-to-bracket"
                  class="flex-shrink-0 w-5 h-5 pr-1 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span class="ml-3">Sign in Bluesky</span>
              </NuxtLink>
            </li>
          </ul>
        </ClientOnly>
      </div>
    </aside>
  </div>
</template>

<script setup>
  import { onMounted, ref, useAppConfig, useRoute, useState } from '#imports'
  import { initDrawers } from 'flowbite'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { useNavigation } from '@/composables/navigation'
  import {
    getAgent,
    initLoginState,
    isLoggedIn as isLogin,
    logout as destroySession,
    restoreSession,
  } from '@/composables/auth'

  const config = useAppConfig()
  const route = useRoute()

  const agent = ref(getAgent())
  const useLoginState = () => useState('loginState', initLoginState)
  const loginState = useLoginState()
  const noRestore = ref(false)

  // App name
  const appName = config.title

  // Navbar linik
  const navItems = {
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
        src: '/pds',
        title: 'PDS status view',
        icon: ['fas', 'database'],
        requireSignin: false,
      },
      {
        src: '/invite-code',
        title: 'Invite code',
        icon: ['fas', 'ticket'],
        requireSignin: true,
      },
      {
        src: '/bsky/mushrooms',
        title: 'Mushrooms',
        icon: ['fas', 'mushroom'],
        requireSignin: false,
      },
    ],
  }

  const logout = () => {
    const navi = useNavigation()
    if (isLogin()) {
      const nextPage = route.fullPath
      navi.setNext(nextPage)

      destroySession()
      const loginState = useLoginState()
      loginState.value.userHandle = null
      loginState.value.userEmail = null
      loginState.value.session = null
      loginState.value = null
    }
    noRestore.value = true
    navi.goHome()
  }

  onMounted(async () => {
    initDrawers()
    if (import.meta.client) {
      if (route.path === '/oauth/callback') return

      if (agent.value === null) agent.value = await getAgent()
      await restoreSession()

      if (!noRestore.value) {
        if (!isLogin()) {
          agent.value = await getAgent()
          await restoreSession()
        }
      }
    }
  })
</script>
