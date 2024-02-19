<template>
  <div>
    <form @submit.prevent="fetchPDSInfo">
      <input
        v-model="input"
        placeholder="Enter user handle or PDS entry point" />
      <button type="submit">Fetch PDS Info</button>
    </form>
    <div v-if="pdsInfo">
      <h3>PDS Information</h3>
      <p>
        <strong>Available User Domains:</strong>
        <ul>
          <li v-for="domain in pdsInfo.availableUserDomains" :key="domain">
            {{ domain }}
          </li>
        </ul>
      </p>
      <p>
        <strong>Invite Code Required:</strong>
        {{ pdsInfo.inviteCodeRequired }}
      </p>
      <p>
        <strong>Phone Verification Required:</strong>
        {{ pdsInfo.phoneVerificationRequired }}
      </p>
      <p v-if="pdsInfo.links?.privacyPolicy">
        <strong>Privacy Policy:</strong>
        <a :href="pdsInfo.links.privacyPolicy" target="_blank">Link</a>
      </p>
      <p v-if="pdsInfo.links?.termsOfService">
        <strong>Terms of Service:</strong>
        <a :href="pdsInfo.links.termsOfService" target="_blank">Link</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { describeServer } from '~/utils/lexicons'
  import { ComAtprotoServerDescribeServer } from '@atproto/api'

  const route = useRoute()
  const router = useRouter()

  const input = ref<string>('')
  const pdsInfo = ref<ComAtprotoServerDescribeServer.OutputSchema | null>(null)

  // URLパラメータから初期値を設定
  watch(
    () => route.query.entry,
    newEntry => {
      if (typeof newEntry === 'string') {
        input.value = newEntry
        fetchPDSInfo()
      }
    },
    { immediate: true }
  )

  const fetchPDSInfo = async () => {
    if (!input.value) return
    // URLに入力値を反映
    await router.push({ query: { entry: input.value } })

    try {
      // PDS情報の取得ロジックを実装
      pdsInfo.value = await describeServer(input.value)
    } catch (error) {
      console.error('Failed to fetch PDS info:', error)
      pdsInfo.value = null
    }
  }
</script>

<style scoped></style>
