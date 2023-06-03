<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
        <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Invite code
        </div>
        <div v-if="results > 0" class="bg-white shadow-md rounded-lg px-3 py-2 border-2" :class="{'border-red-600': hasError, 'border-green-500': !hasError}">
          <div class="py-2 px-2" :class="{'text-red-600 dark:text-red-400': hasError, 'text-gray-600 dark:text-gray-400': !hasError}">
            <div v-if="hasError">{{ results }}</div>
            <ul v-else class="relative border-l border-gray-200 dark:border-gray-700">
              <li v-for="record in results" :key="record.id" class="mb-4 ml-3">
                <font-awesome-icon :icon="record.icon" :style="record.iconStyle" class="absolute w-3 h-3 mt-1.5 -left-1.5" />
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{ record.createdAt }}</time>
                <p class="mb-4 text-base font-normal">{{ record.handle }}</p>
            </li>
            </ul>
          </div>
          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div>
        <div v-else>
          No code issued
        </div>
      </div>
    </div>
  </div>
</template>


<script setup type="ts">1
  import { computed } from 'vue'
  import { useAppConfig, useRoute, useRouter } from 'nuxt/app';
  import { useSession } from '@/composables/session'
  import { useNavigation } from '@/composables/navigation'
  import { isDev } from '@/utils';

  const config = useAppConfig()
  const route = useRoute()
  const session = useSession()
  const navigate = useNavigation()
  const hasError = ref(false)
  const results = ref([])
  const agent = ref(null)

  const isAuthenticated = computed(() => {
    console.debug(session.session)
    console.debug("session.session.value = ${session.session.value}")
    return session.session.value !== null
  })

  async function getInviteCode() {
      agent.value = session.getAgent()
      session.restore()
      console.debug('agent = ')
      console.debug(agent.value)
      try {
        const inviteCode = await agent.value.api.com.atproto.server.getAccountInviteCodes()

        console.debug(inviteCode)
      } catch (e) {

        if (isDev()) console.error(e)
        loadLoginForm()
      }
  }

  const loadLoginForm = async () => {
    const router = useRouter()
    const serviceURL = new URL(config.bskyService)

    navigate.setNext(route.name);
    await router.push({ path: `${serviceURL.hostname}/login` })
  }
  
  onMounted(async () => {
    agent.value = session.getAgent()
    console.log(agent.value)
    if (agent.value)
      agent.restore()
    console.debug(`isAuthenticated = ${isAuthenticated.value}`)
    if (!isAuthenticated.value) {
      loadLoginForm()
    } else {
      await getInviteCode()
    }
  })
</script>
