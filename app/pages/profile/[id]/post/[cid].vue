<template>
  <div>
    Handle: {{ handle }}
    DID : {{ did }}
    <ClientOnly>
      <PostView
        :config="config"
        :did="did"
        :handle="handle"
        :avatar_url="avatarURL ?? 'about:blank'"
        :display_name="displayName"
        :post="toRaw(record)" />
      <template #placeholder>
        Loading...
      </template>
    </ClientOnly>
  </div>
</template>


<script setup>
import {  useAppConfig } from 'nuxt/app'
import { ref, onMounted, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isDev } from '~/utils/helpers'
import { resolveHandle, resolveDID, getProfile, buildAvatarURL, getPost } from '~/utils/lexicons'

const route = useRoute()
console.log(route.params)
const handleOrDid = ref(route.params.id)
const postID = ref(route.params.cid)
if (handleOrDid.value && !postID.value) {
  throw new Error('Missing posts')
}
if (!handleOrDid.value && !postID.value) {
  throw new Error('Missing posts')
}

console.log('handleOrDid = ', handleOrDid.value)
console.log('postID = ', postID.value)

const config = useAppConfig()

const did = ref(null)
const handle = ref(null)
const displayName = ref(null)
const avatarURL = ref(null)

const profile = ref(null)
const record = ref(null)


onMounted(async () => {

  try {
    did.value = await resolveHandle(handleOrDid.value)
  } catch (e) {}
  try {
    handle.value = await resolveDID(did.value)
    displayName.value = handle.value
  } catch (e) {}

  try {
    profile.value = await getProfile(did.value)
    avatarURL.value = buildAvatarURL(
      config.cdnPrefix, did,
      profile
    )
    displayName.value = details.displayName
  } catch (e) {}
  try {
    record.value = await getPost(did.value, postID.value)
    console.log(toRaw(record.value))
  } catch (e) {

  }

})

</script>

