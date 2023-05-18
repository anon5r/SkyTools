<template>
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Enter your handle
          </div>
          <div class="flex items-center bg-gray-200 rounded-md">
            <div class="w-full p-2">
              <input class="bg-transparent rounded-md w-full text-gray-700" v-model="inputHandle" placeholder="jack.bsky.social" />
            </div>
            <div class="p-2">
              <button class="bg-blue-500 text-white rounded-md px-2 py-1" @click="requestDID">Lookup</button>
            </div>
          </div>
        </div>
        <div class="bg-white shadow-md rounded-lg px-3 py-2" v-if="result">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            DID
          </div>
          <div class="text-gray-700 py-2 px-2">
            {{ result }}
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios';

  export default {
    layout: 'default',
    data() {
      return {
        inputHandle: '',
        result: ''
      }
    },
    methods: {
      async requestDID() {
        try {
          this.inputHandle = this.inputHandle.startsWith('@') ? this.inputHandle.substring(1) : this.inputHandle
          const res = await axios.get(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${this.inputHandle}`);
          console.log(res)
          if (res.data.did)
            this.result = res.data.did
        } catch (error) {
          console.error(error);
          this.result = error.message
          if (error.response.data.message)
            this.result = error.response.data.message
          
        }
      },
    },
  }
</script>
  