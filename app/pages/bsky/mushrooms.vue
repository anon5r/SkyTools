<script setup lang="ts">
  import bskyutils from '~/utils/bskyutils'
  import { onMounted, ref, type Ref } from 'vue'
  import { AppBskyActorProfile, ComAtprotoSyncListRepos } from '@atproto/api'

  const bskyPDS: Record<string, string[]> = {
    'us-east': [
      'amanita',
      'coral',
      'earthstar',
      'elfcup',
      'enoki',
      'helvella',
      'inkcap',
      'lionsmane',
      'lobster',
      'meadow',
      'morel',
      'oyster',
      'panthercap',
      'porcini',
      'puffball',
      'reishi',
      'scarletina',
      'shiitake',
      'shimeji',
      'splitgill',
      'truffle',
    ],
    'us-west': [
      'agaric',
      'blewit',
      'boletus',
      'bracket',
      'button',
      'chaga',
      'chanterelle',
      'conocybe',
      'cordyceps',
      'cremini',
      'dapperling',
      'ganoderma',
      'goldenear',
      'gomphus',
      'grisette',
      'hedgehog',
      'hydnum',
      'lepista',
      'magic',
      'maitake',
      'matsutake',
      'milkcap',
      'mottlegill',
      'mycena',
      'pioppino',
      'polypore',
      'rooter',
      'russula',
      'shaggymane',
      'stinkhorn',
      'suillus',
      'verpa',
      'waxcap',
      'witchesbutter',
      'woodear',
    ],
  }
  const accounts: Ref<
    Record<
      string,
      {
        did: string
        handle: string
        profile: AppBskyActorProfile.Record | null
        pds: string
      }[]
    >
  > = ref({} as Record<string, AppBskyActorProfile.Record>)

  onMounted(() => {
    for (const region in bskyPDS) {
      for (const mushroom of bskyPDS[region]) {
        loadPDSHeadAccount(mushroom, region)
      }
    }
  })
  const loadPDSHeadAccount = async (
    mushroom: string,
    region: string
  ): Promise<void> => {
    const pdsHost = `${mushroom}.${region}.host.bsky.network`
    const repos: ComAtprotoSyncListRepos.Repo[] = await bskyutils.listRepos(
      `https://${pdsHost}`,
      1
    )
    if (repos.length > 0) {
      for (const repo of repos) {
        await addAccounts(repo.did, pdsHost)
      }
    }
  }
  const addAccounts = async (did: string, pds: string) => {
    const pdsUri = `https://${pds}`
    const handle: string = await bskyutils.resolveDID(did)
    let profile: AppBskyActorProfile.Record | null = null
    try {
      profile = await bskyutils.loadProfile(pdsUri, handle)
    } catch (err) {
      console.error(err)
    }
    if (!accounts.value[pds as string]) accounts.value[pds as string] = []
    accounts.value[pds as string].push({
      did: did,
      handle: handle,
      profile: profile,
      pds: pdsUri,
    })
  }
</script>
<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-3xl">
      <h1
        class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Mushrooms
      </h1>
      <p
        class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
        Enumerate the accounts initially registered in each mushroom PDS in
        Bluesky.
      </p>

      <div class="px-3 py-3 flex flex-row justify-between items-center">
        <div v-if="accounts" class="pt-2 max-w-prose">
          <ul>
            <li v-for="(actors, pds) in accounts" :key="pds">
              <h3
                class="text-3xl font-semibold text-gray-500 dark:text-gray-400">
                {{ pds }}
              </h3>
              <UserField
                v-for="(actor, index) in actors"
                :key="index"
                :did="actor.did"
                :handle="actor.handle"
                :profile="actor.profile"
                :pds="actor.pds" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
