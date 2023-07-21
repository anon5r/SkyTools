<template>
  <div
    class="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-lg">
      <ClientOnly>
        <div
          class="bg-white dark:bg-slate-800 shadow-md rounded-lg px-3 py-3 mb-4">
          <div
            class="block text-gray-700 dark:text-gray-400 text-lg font-semibold py-3 px-2 mb-2">
            Invite code
          </div>
          <div
            v-if="inviteCodes"
            class="bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border-0">
            <div v-if="nextDate" class="text-sm pl-3">
              <font-awesome-icon
                :icon="['fas', 'cloud-sun']"
                class="pr-2"
                title="Forecast" />
              <span class="italic" title="This is forecast, Not guaranteed">
                You will get next new code at
                <span class="bold">{{ nextDate }}</span>
              </span>
            </div>
            <Accordion
              class="py-2 px-2 text-gray-600 dark:text-gray-400"
              always-open="false"
              data-accordion="open">
              <accordion-panel v-for="record in inviteCodes" :key="record.code">
                <accordion-header aria-expanded="false">
                  <font-awesome-icon
                    :icon="
                      record.uses?.length > 0
                        ? ['fas', 'check-double']
                        : record.disabled
                        ? ['fas', 'ban']
                        : ['fas', 'check']
                    "
                    :style="
                      record.uses?.length > 0
                        ? { color: 'text-gray-900' }
                        : record.disabled
                        ? { color: '#e00000' }
                        : { color: '#18b404' }
                    "
                    class="mr-2" />
                  <a
                    @click="toggleUsed"
                    :class="{ 'line-through': record.uses?.length > 0 }">
                    {{ record.code }}
                  </a>
                </accordion-header>
                <accordion-content>
                  <div v-if="record.createdAt">
                    <div>
                      Issued at
                      <time
                        class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        {{ record.createdAtLocal }}
                      </time>
                    </div>
                    <ul>
                      <li v-for="(use, index) in record.uses" :key="index">
                        <div>
                          Used by
                          <NuxtLink
                            :to="`${config.bskyAppURL}/profile/${use.alsoKnownAs}`"
                            class="inline py-0 pl-1 pr-1 text-blue-500 hover:text-blue-300 hover:dark:text-blue-700"
                            target="_blank">
                            {{ use.alsoKnownAs }}
                          </NuxtLink>
                        </div>
                        <div>
                          <span
                            class="sm italic text-gray-300 dark:text-gray-700">
                            {{ use.usedBy }}
                          </span>
                        </div>
                        <div>
                          Used at
                          <time
                            class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            {{ use.usedAtLocal }}
                          </time>
                        </div>
                      </li>
                      <li v-if="record.uses.length == 0">
                        <div>
                          <span class="text-green-500 pr-3 py-2">
                            Available!
                          </span>
                          <span v-if="record.createdBy != record.forAccount">
                            <font-awesome-icon
                              :icon="['fas', 'gift']"
                              beat
                              style="color: #ca1643"
                              class="px-2"
                              title="Gift!" />
                            <span class="text-sm">by</span>
                            <span
                              class="sm italic text-sm text-gray-400 dark:text-slate-500">
                              {{ record.createdBy }}
                            </span>
                          </span>
                        </div>

                        <CopyToClipboard
                          :copy-text="record.code"
                          class="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-400"
                          position="bottom-right"
                          success-message="Copied!"
                          error-message="Failed to copy"
                          :display-duration="3500">
                          <font-awesome-icon :icon="['far', 'clipboard']" />
                          Copy this code!
                        </CopyToClipboard>
                      </li>
                    </ul>
                  </div>
                  <div v-else>
                    <span class="text-gray-400 dark:text-slate-600 pr-3 py-2">
                      No code issued
                    </span>
                  </div>
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

<script setup lang="js">
  import { onMounted, ref } from 'vue'
  import { DateTime } from 'luxon'
  import { useAppConfig, useRoute, useRouter } from 'nuxt/app'
  import { useAuth } from '@/composables/auth'
  import { useNavigation } from '@/composables/navigation'
  import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'flowbite-vue'
  import { isDev } from '~/utils/helpers'
  import { resolveDID } from '~/utils/lexicons'



  const asyncLoad = async () => {
    const { getAgent, isLoggedIn } = await useAuth()

    if (agent.value == null)
      agent.value = getAgent()

    if (isLoggedIn) {
      inviteCodes.value = await getInviteCodes()
    } else {
      loadSigninForm()
    }
  }

  onMounted(asyncLoad)

  const config = useAppConfig()
  const route = useRoute()
  const navigate = useNavigation()
  const agent = ref(null)


  const inviteCodes = ref(null)
  const nextDate = ref(null)


  // Go sign-in page
  const loadSigninForm = async () => {
    const router = useRouter()
    const serviceURL = new URL(config.bskyService)
    // Back to current page
    navigate.setNext(route.name);
    await router.push({ path: `${serviceURL.hostname}/signin` })
  }

  /** Gets list of invite codes */
  const getInviteCodes = async () => {
    const atproto = agent.value.api.com.atproto.server;
    try {
      const response = await atproto.getAccountInviteCodes()
      let records = []
      if (isDev()) console.log(response)

      if (response.data.codes.length > 0) {
        // Sort order to descending order by createdAt field
        response.data.codes.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        console.log(response.data)
        for (const record of response.data.codes) {
          // Resolve to handle from DID
          const rewriteUses = record.uses.map(async use => ({
            ...use,
            alsoKnownAs: await resolveDID(use.usedBy, true),
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
      loadSigninForm()
    }
  }
</script>
