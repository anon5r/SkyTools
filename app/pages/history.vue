<template>
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Enter current handle or DID
          </div>
          <div class="flex items-center bg-gray-200 rounded-md">
            <div class="w-full p-2">
              <input class="bg-transparent rounded-md w-full text-gray-700" v-model="handle" @keyup.enter="submit" placeholder="jack.bsky.social or did:plc:xxxxxxxxxxx" />
            </div>
            <div class="p-2">
              <button class="bg-blue-500 text-white rounded-md px-2 py-1" @click="submit">Submit</button>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg px-3 py-2 border-2" v-if="results.length > 0" :class="{'border-red-600': hasError, 'border-green-500': !hasError}">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Handle history
          </div>
          <div class="py-2 px-2" :class="{'text-red-600 dark:text-red-400': hasError, 'text-gray-600 dark:text-gray-400': !hasError}">
            <div v-if="hasError">{{ results }}</div>
            <ul v-else class="relative border-l border-gray-200 dark:border-gray-700">
              <li v-for="record in results" :key="record.id" class="mb-4 ml-3">
                <font-awesome-icon :icon="record.icon" :style="record.iconStyle" class="absolute w-3 h-3 mt-1.5 -left-1.5" />
                <time class="mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{ record.createdAt }}</time>
                <p class="mb-1 text-base font-normal">{{ record.handle }}</p>
                <div class="mb-5 text-xs text-gray-300 dark:text-gray-700">{{ record.did }}</div>
            </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import { DateTime } from 'luxon'
  import axios from 'axios'
  import { isDev } from '~/utils'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const defaultDomain = '.bsky.social' 

  export default {
    layout: 'default',
    data() {
      return {
        results: [],
        hasError: false
      }
    },
    setup() {
      const route = useRoute()
      const handle = ref(route.query.handle || '');
      return { handle }
    },
    methods: {
      submit() {
        this.$router.push({ query: { handle: this.handle } })
        if (this.handle.length > 0) {
          this.getHistory(this.handle)
        }
      },
      /** Get DID from handle */
      async getDID(handle) {
        try {
          this.hasError = false
          handle = handle.startsWith('@') ? handle.substring(1) : handle
          if (!handle.includes('.')) {
            handle = handle + defaultDomain // default xxx -> xxx.bsky.social
            this.handle = handle
            this.$router.push({ query: { id: handle } })
          }
          const res = await axios.get(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`);
          if (isDev()) console.log(res)
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
      /** Get handle history from DID */
      async getHistory(did) {
        try {
          if (!did.startsWith('did:'))
            did = await this.getDID(did)
          if (this.hasError) return
          const res = await axios.get(`https://plc.directory/${did}/log/audit`);
          if (isDev()) console.log(res)
          if (res.data.length > 0) {
            let records = res.data.reverse()
            let items = []
            for (let idx in records) {
              let record,icon,style
              record = records[idx]
              icon = ['fas', 'square-minus']
              style = {color: '#cccccc'};
              if (idx == 0) {
                icon = ['fas', 'circle-check']
                style = {color: '#18b404'}
              } else if (record.operation?.type==='create' || record.operation?.prev === null) {
                icon = ['fas', 'flag']
                style = {color: '#ea2a63'}
              }
              items.push({
                id: record.cid,
                icon: icon,
                iconStyle: style,
                createdAt: DateTime.fromISO(record.createdAt).toString(),
                handle: record.operation.handle ? record.operation.handle : record.operation.alsoKnownAs[0],
                did: record.did,
                _raw: record.operation
              })
            }
            this.results = items
          }
        } catch (err) {
          if (isDev()) console.error(err);
          this.results = err.message
          if (err.response?.data?.message)
            this.results = err.response.data.message
          
        }
      }
    },
  }
</script>
  