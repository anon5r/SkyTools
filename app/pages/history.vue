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
        <div class="bg-white shadow-md rounded-lg px-3 py-2" v-if="results.length > 0">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Handle history
          </div>
          <div class="text-gray-700 py-2 px-2">
            <ul>
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
  export default {
    layout: 'default',
    data() {
      return {
        inputText: '',
        results: []
      }
    },
    methods: {
      async getDID(handle) {
        try {
          handle = handle.startsWith('@') ? handle.substring(1) : handle
          const res = await axios.get(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`);
          console.log(res)
          if (res.data.did)
            return res.data.did
        } catch (error) {
          console.error(error);
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
          
          const res = await axios.get(`https://plc.directory/${did}/log`);
          console.log(res)
          if (res.data.length > 0)
            this.results = res.data
            this.results.reverse()
        } catch (error) {
          console.error(error);
          this.result = error.message
          if (error.response.data.message)
            this.result = error.response.data.message
          
        }
      }
    },
  }
</script>
  