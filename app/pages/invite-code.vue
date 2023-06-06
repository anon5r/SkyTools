<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
        <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Invite code
        </div>
        <div v-if="results?.length > 0" class="bg-white shadow-md rounded-lg px-3 py-2 border-2" :class="{'border-red-600': hasError, 'border-green-500': !hasError}">
          <div class="py-2 px-2" :class="{'text-red-600 dark:text-red-400': hasError, 'text-gray-600 dark:text-gray-400': !hasError}">
            <div v-if="hasError">{{ results }}</div>
            <ul v-else class="relative border-l border-gray-200 dark:border-gray-700">
              <li v-for="record in results" :key="record.code" class="mb-4 ml-3">
                <font-awesome-icon :icon="record.icon" :style="record.iconStyle" class="absolute w-3 h-3 mt-1.5 -left-1.5" />
                <p class="mb-4 text-base font-normal">{{ record.code }}</p>
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{ record.createdAt }}</time>
                <ul>
                  <li v-for="(used, key) in record.uses">{{ used.handle }} -- {{ used.usedAtLocal }}</li>
                </ul>
            </li>
            </ul>
          </div>
        </div>
        <div v-else>
          No code issued
        </div>
      </div>
    </div>
  </div>
</template>


<script setup type="ts">
  import { onMounted, ref } from 'vue'
  import { DateTime } from 'luxon'
  import { useAppConfig, useRoute, useRouter } from 'nuxt/app'
  import { useAuth } from '@/composables/auth'
  import { useNavigation } from '@/composables/navigation'
  import { useIdentity } from '@/composables/identity'
  import { isDev } from '@/utils'

  const config = useAppConfig()
  const route = useRoute()
  const { getAgent, isLoggedIn, logout } = useAuth()
  const navigate = useNavigation()
  const hasError = ref(false)
  const results = ref([])
  const agent = ref(null)
  const identity = useIdentity()

  const getInviteCode = async () => {
    if (agent.value == null)
      agent.value = getAgent()
    
    try {
      const inviteCode = await agent.value.api.com.atproto.server.getAccountInviteCodes()
      console.log(inviteCode.data)
      
      for (let index in inviteCode.data.codes) {
        let codeData = inviteCode.data.codes[index]
        let item = {
          code: codeData.code,
          assignee: await identity.resolveDID(codeData.forAccount),
          createdAt: DateTime.fromISO(codeData.createdAt).toString(),
          used: codeData.uses.length == 0 ? [] : await _convertUsed(codeData.uses),
          icon: ['fas', 'check'],
          iconStyle: 'color: #18b404',
          _raw: codeData
        }
        if (codeData.disabled) {
          item.icon = ['fas', 'ban']
          item.iconStyle = 'color: #e00000'
        } else if (codeData.uses.length > 0) {
          item.icon = ['fas', 'check-double']
          item.iconStyle = ''
        }
        results.value.push(item)
      }
        console.log(results.value)
      
    } catch (err) {
      if (isDev()) console.error(err)
      hasError = true
        if (err.response?.data?.message)
          this.results = err.response.data.message
      if (err.response.statuCode == 403)
        loadLoginForm()
    }
  }

  const _convertUsed = async (uses) => {
    let row = []
    for (let i in uses) {
      let used = uses[i]
      used.alsoKnownAs = await identity.resolveDID(uses[i].usedBy)
      used.usedAtLocal = DateTime.fromISO(uses[i].usedAt).toString()
      row.push(used)
    }
    return row
  }

  const loadLoginForm = async () => {
    const router = useRouter()
    const serviceURL = new URL(config.bskyService)

    navigate.setNext(route.name);
    await router.push({ path: `${serviceURL.hostname}/login` })
  }
  
  onMounted(async () => {
    if (agent.value == null)
      agent.value = getAgent()
    
    console.debug(`login = ${isLoggedIn()}`)
    
    if (!isLoggedIn()) {
      loadLoginForm()
    } else {
      await getInviteCode()
    }
  })
</script>
