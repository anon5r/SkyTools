<template>
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Enter current handle or DID
          </div>
          <div class="flex items-center bg-gray-200 rounded-md">
            <div class="w-full p-2">
              <input class="bg-transparent rounded-md w-full text-gray-700" v-model="inputText" placeholder="jack.bsky.social or did:plc:xxxxxxxxxxx" />
            </div>
            <div class="p-2">
              <button class="bg-blue-500 text-white rounded-md px-2 py-1" @click="getHistory">Submit</button>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg px-3 py-2 border-2" v-if="results.length > 0" :class="{'border-red-600': hasError, 'border-green-500': !hasError}">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Handle history
          </div>
          <div class="py-2 px-2" :class="{'text-red-600 dark:text-red-400': hasError, 'text-gray-600 dark:text-gray-400': !hasError}">
            <div v-if="hasError">{{ results }}</div>
            <ul v-else>
              <li v-for="(record, index) in results" :key="index">
                <font-awesome-icon :icon="['fas', 'circle-check']" style="color: #18b404;" v-if="index===0" />
                <font-awesome-icon :icon="['fas', 'flag']" style="color: #ea2a63;" v-else-if="record.type==='create'" />
                <font-awesome-icon :icon="['far', 'square-minus']" style="color: #cccccc;" v-else />
                {{ 'handle' in record ? record.handle : record.alsoKnownAs[0] }}
            </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import { isDev } from '~/utils'

  export default {
    layout: 'default',
    data() {
      return {
        inputText: '',
        results: [],
        hasError: false
      }
    },
    methods: {
      async getDID(handle) {
        try {
          this.hasError = false
          handle = handle.startsWith('@') ? handle.substring(1) : handle
          const res = await axios.get(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`);
          console.log(res)
          if (res.data.did)
            return res.data.did
        } catch (error) {
          this.hasError = true
          if (isDev()) console.error(error);
          this.results = error.message
          if (error.response.data.message)
            this.results = error.response.data.message
          
        }
      },
      async getHistory() {
        try {
          let did = this.inputText
          if (!this.inputText.startsWith('did:'))
            did = await this.getDID(this.inputText)
          if (this.hasError) return
          const res = await axios.get(`https://plc.directory/${did}/log`);
          if (isDev()) console.log(res)
          if (res.data.length > 0)
            this.results = res.data
            this.results.reverse()
        } catch (error) {
          if (isDev()) console.error(error);
          this.results = error.message
          if (error.response?.data?.message)
            this.results = error.response.data.message
          
        }
      }
    },
  }
</script>
  