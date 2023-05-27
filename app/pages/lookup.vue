<template>
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Enter a handle or DID
          </div>
          <div class="flex items-center bg-gray-200 rounded-md">
            <div class="w-full p-2">
              <input class="bg-transparent rounded-md w-full text-gray-700" v-model="handle" @focusout="focusout" @keyup.enter="requestDID" placeholder="jack.bsky.social" />
            </div>
            <div class="p-2">
              <button class="bg-blue-500 text-white rounded-md px-2 py-1" @click="requestDID">Lookup</button>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg px-3 py-2 border-2" v-if="result" :class="{'border-red-400': hasError, 'border-green-500': !hasError}">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            <span v-if="result.startsWith('did:')">DID</span>
            <span v-else>Handle</span>
          </div>
          <div class="py-2 px-2" :class="{'text-red-600 dark:text-red-400': hasError, 'text-gray-600 dark:text-gray-400': !hasError}">
            {{ result }}
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { isDev } from '~/utils'
  import { useAppConfig, useRuntimeConfig } from 'nuxt/app'


  export default {
    layout: 'default',
    setup() {
      const route = useRoute();
      const handle = ref(route.query.handle || '');
      return { handle }
    },
    data() {
      return {
        result: '',
        hasError: false
      }
    },
    methods: {
      focusout() {
        this.handle = this.formatIdentifier(this.handle)
      },
      formatIdentifier (id) {
        if (!id.startsWith('did:')) {
          id.startsWith('@') ? id.substring(1) : id
          id.startsWith('at://') ? id.substring(5) : id
          if (!id.includes('.')) {
            id += useAppConfig().defaultSuffix // default xxx -> xxx.bsky.social
          }
        }
        return id
      },
      async requestDID() {
        try {
          let identifier = this.formatIdentifier(this.handle)
          this.handle = identifier
          this.$router.push({ query: { handle: identifier } });

          let requestUrl;
          if (identifier.startsWith('did:')) 
            requestUrl = `https://plc.directory/${identifier}`
          else
            requestUrl = `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${identifier}`

          const res = await axios.get(requestUrl)
          if (isDev()) console.log(res)

          if (res.data?.did)
            this.result = res.data.did

          else if (res.data?.alsoKnownAs)
            this.result = res.data.alsoKnownAs[0]

          this.hasError = false

        } catch (error) {
          if (isDev()) console.error(error)
          this.hasError = true
          this.result = error.message
          if (error.response.data.message)
            this.result = error.response.data.message
          
        }
      },
    },
  }
</script>
  