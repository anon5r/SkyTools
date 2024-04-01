<template>
  <div
    class="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4 mx-4">
    <div class="w-full max-w-lg">
      <ClientOnly>
        <div
          class="bg-white dark:bg-slate-800 shadow-md rounded-lg px-3 py-3 mb-4">
          <div
            class="block text-gray-700 dark:text-gray-400 text-lg font-semibold py-2 px-2">
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
            <fwb-accordion
              class="py-2 px-2 text-gray-600 dark:text-gray-400"
              always-open="false"
              data-accordion="open">
              <fwb-accordion-panel
                v-for="record in inviteCodes"
                :key="record.code">
                <fwb-accordion-header aria-expanded="false">
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
                </fwb-accordion-header>
                <fwb-accordion-content>
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
                            :to="`/profile/${use.alsoKnownAs}`"
                            class="inline py-0 pl-1 pr-1 text-blue-500 hover:text-blue-300 hover:dark:text-blue-700"
                            target="_blank">
                            {{ use.alsoKnownAs }}
                          </NuxtLink>
                        </div>
                        <div>
                          <span
                            class="text-sm italic text-gray-300 dark:text-gray-700"
                            select-all>
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

                        <CopyToClipboard
                          :copy-text="record.code"
                          class="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-400 text-sm"
                          position="bottom-right"
                          success-message="Copied!"
                          error-message="Failed to copy"
                          :display-duration="3500">
                          <font-awesome-icon :icon="['far', 'clipboard']" />
                          Copy this code!
                        </CopyToClipboard>
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
                            <span class="text-sm mx-1">by</span>
                            <span
                              class="mx-1 italic text-sm text-gray-400 dark:text-slate-500">
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
                </fwb-accordion-content>
              </fwb-accordion-panel>
            </fwb-accordion>
          </div>
          <div v-else>
            <font-awesome-icon :icon="['fas', 'spinner']" spin-pulse />
            Loading...
          </div>
        </div>

        <!-- Modal dialog -->
        <fwb-modal v-if="blocked" persistent>
          <template #header>
            <div class="flex items-center text-lg">
              <ClientOnly>
                <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
              </ClientOnly>
              We temporarily closed this feature
            </div>
          </template>
          <template #body>
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The API to get invitation codes was available to anyone without
              the user’s permission.
            </p>
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              However, we only allow logins using the App Password for our
              service.
            </p>
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              In the future, this functionality will be available with the
              user’s consent.
            </p>
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The feature will be closed for the time being. Thank you.
            </p>
          </template>
          <template #footer>
            <div class="flex justify-between">
              <button
                @click="navigate.goHome"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Go back
              </button>
            </div>
          </template>
        </fwb-modal>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="js">
  import { DateTime } from 'luxon'
  import {
    useAppConfig,
    useRoute,
    useRouter,
    useSeoMeta,
    onMounted,
    ref,
  } from '#imports'
  import { getAgent, isLoggedIn, restoreSession } from '~/composables/auth'
  import { useNavigation } from '~/composables/navigation'
  import {
    FwbAccordion,
    FwbAccordionContent,
    FwbAccordionHeader,
    FwbAccordionPanel,
    FwbModal,
  } from 'flowbite-vue'
  import { isDev } from '~/utils/helpers'
  import { resolveDID } from '~/utils/bskyutils'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const config = useAppConfig()
  const route = useRoute()
  const navigate = useNavigation()

  const inviteCodes = ref(null)
  const nextDate = ref(null)

  const blocked = ref(false)

  const asyncLoad = async () => {
    await restoreSession()
    if (isLoggedIn()) {
      inviteCodes.value = await getInviteCodes()
    } else {
      loadSigninForm()
    }
  }
  useSeoMeta({
    title: `Invite code | ${config.title}`,
    ogTitle: `Invite code | ${config.title}`,
    ogImage: `${config.prodURLPrefix}/images/ogp/invitecode.png`,
    twitterCard: 'summary',
  })

  onMounted(async () => {
    // let useAuth = import('@/composables/auth').then(async (module) => {
    //     auth.value = module.useAuth()
    //     await asyncLoad()
    //   })

    await asyncLoad()
  })

  // Go sign-in page
  const loadSigninForm = async () => {
    const router = useRouter()
    const serviceURL = new URL(config.defaultPDSEntrypoint)
    // Back to current page
    navigate.setNext(route.name)
    await router.push({ path: `${serviceURL.hostname}/signin` })
  }

  /** Gets list of invite codes */
  const getInviteCodes = async () => {
    const atproto = (await getAgent()).api.com.atproto.server
    try {
      const response = await atproto.getAccountInviteCodes()
      let records = []
      if (isDev()) console.log(response)

      if (response.success && response.data.codes.length > 0) {
        // Sort order to descending order by createdAt field
        response.data.codes.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt)
        })

        for (const record of response.data.codes) {
          // Resolve to handle from DID
          const rewriteUses = record.uses.map(async use => ({
            ...use,
            alsoKnownAs: await resolveDID(use.usedBy, true),
            usedAtLocal: DateTime.fromISO(use.usedAt).toFormat('DDD TTT'),
          }))
          const resolvedUses = await Promise.all(rewriteUses)
          // invite code
          const row = {
            ...record,
            showDetail: false,
            createdAtLocal: DateTime.fromISO(record.createdAt).toFormat(
              'DDD TTT'
            ),
            uses: resolvedUses,
          }
          records.push(row)
        }
        // will be get next new code date..
        nextDate.value = DateTime.fromISO(records[0].createdAt)
          .plus(config.inviteCodeFreq)
          .toFormat('DDD')
      } else {
        records = [
          {
            code: 'No code available',
            available: 0,
            showDetail: false,
            disabled: true,
            localCreatedAt: '',
            uses: [],
          },
        ]
      }

      if (records == null) throw new Error('Failed to get response')

      return records
    } catch (error) {
      if (isDev()) console.error(error)
      if (error?.status === 400) {
        // Display blocked message
        blocked.value = true
      } else {
        loadSigninForm()
      }
    }
  }
</script>
