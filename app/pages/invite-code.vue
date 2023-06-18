<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
    <div class="w-full max-w-md">
      <ClientOnly>
        <div class="bg-white shadow-md rounded-lg px-3 py-3 mb-4">
          <div class="block text-gray-700 text-lg font-semibold py-3 px-2 mb-2">
            Invite code
          </div>
          <div v-if="inviteCodes" class="bg-white rounded-lg px-3 py-2 border-0">

              <div v-if="nextDate" class="text-sm italic">You will get next new code at <span class="bold">{{ nextDate }}</span></div>
              <Accordion class="py-2 px-2 text-gray-600 dark:text-gray-400" always-open="false" data-accordion="open">
                <accordion-panel v-for="record in inviteCodes" :key="record.code">
                  <accordion-header aria-expanded="false">
                    <font-awesome-icon 
                      :icon="record.uses?.length > 0 
                        ? ['fas', 'check-double'] 
                        : (record.disabled 
                          ? ['fas', 'ban']
                          : ['fas', 'check'])" 
                        :style="record.uses?.length > 0 
                          ? {'color': 'text-gray-900'} 
                          : (record.disabled 
                            ? {'color': '#e00000'}
                            : {'color': '#18b404'})" 
                      class="mr-2"/>
                    <a @click="toggleUsed" :class="{ 'line-through': (record.uses?.length > 0) }">{{ record.code }}</a>
                  </accordion-header>
                  <accordion-content>
                    <div>
                      Issued at <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{ record.createdAtLocal }}</time>
                    </div>
                    <ul>
                      <li v-for="(use, index) in record.uses" :key="index">
                        <div>
                          <NuxtLink :to="`https://bsky.app/profile/${use.alsoKnownAs}`" class="block py-0 pl-1 pr-1 text-blue-500 hover:textg-blue-300 hover:dark:text-blue-700">{{ use.alsoKnownAs }}</NuxtLink>
                        </div>
                        <div>
                          Used at <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{ use.usedAtLocal }}</time>
                        </div>
                      </li>
                      <li v-if="record.uses.length == 0">
                        <div class="text-green-500">Available!</div>
                      </li>
                    </ul>
                  </accordion-content>
                </accordion-panel>
              </Accordion>
          </div>
          <div v-else>
            <font-awesome-icon :icon="['fas', 'spinner']" spin-pulse />
            Loading...
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>


<script setup type="ts">
  import { onMounted, ref, reactive, toRefs } from 'vue'
  import { DateTime } from 'luxon'
  import { useAppConfig, useRoute, useRouter } from 'nuxt/app'
  import { useAuth } from '@/composables/auth'
  import { useNavigation } from '@/composables/navigation'
  import { useIdentity } from '@/composables/identity'
  import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'flowbite-vue'
  import { isDev } from '../utils'


  const asyncLoad = async () => {

    const { getAgent, isLoggedIn } = await useAuth()

    if (agent.value == null)
      agent.value = await getAgent()
    
    if (isLoggedIn()) {
      console.dir(inviteCodes)
      inviteCodes.value = await getInviteCodes()
      if (isDev()) {
        console.dir(inviteCodes)
        console.log()
      }
    } else {
      loadLoginForm()
    }
  }

  onMounted(await asyncLoad)

  const config = useAppConfig()
  const route = useRoute()
  const navigate = useNavigation()
  const agent = ref(null)
  const identity = useIdentity()
  const inviteCodes = ref(null)
  const nextDate = ref(null)


  // Go login page
  const loadLoginForm = async () => {
    const router = useRouter()
    const serviceURL = new URL(config.bskyService)
    // Back to current page
    navigate.setNext(route.name);
    await router.push({ path: `${serviceURL.hostname}/login` })
  }
  
  /** Gets list of invite codes */
  const getInviteCodes = async () => {
    const atproto = agent.value.api.com.atproto.server;
    try {
      const response = await atproto.getAccountInviteCodes()
      let records = []
      console.log(response)
      if (response.data?.codes?.length > 0) {
        for (const record of response.data.codes.reverse()) {
          // Resolve to handle from DID
          const rewriteUses = record.uses.map(async use => ({
            ...use, 
            alsoKnownAs: await identity.resolveDID(use.usedBy, true),
            usedAtLocal: DateTime.fromISO(use.usedAt).toFormat('DDD TTT'),
          }));
          const resolvedUses = await Promise.all(rewriteUses);
          // invite code
          const row = {
            ...record, 
            showDetail: false,
            createdAtLocal: DateTime.fromISO(record.createdAt).toFormat('DDD TTT'),
            uses: resolvedUses
          };
          records.push(row);
        }
        // will be get next new code date..
        nextDate.value = DateTime.fromISO(records[0].createdAt).plus(config.inviteCodeFreq).toFormat('DDD')
      } else {
        records = [{
          code: 'No code available',
          available: 0,
          showDetail: false,
          disabled: true,
          localCreatedAt: '',
          uses: []
        }]
      }

      if (records == null)
        throw new Error('Failed to get response')

      return records
    } catch (error) {
      console.error(error)
      loadLoginForm()
    }
  }

  const toggleDetail = async (record) => {
    const index = inviteCodes.indexOf(record)
    inviteCodes[index] = {
      ...record,
      showDetail: !record.showDetail,
    }
}
</script>

