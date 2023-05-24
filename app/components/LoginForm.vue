<template>
    <div class="w-full max-w-xs mx-auto">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h4 class="text-2xl font-bold dark:text-white">Bluesky login</h4>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Your handle
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            v-model="username"
            type="text"
            placeholder="jack.bsky.social"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            App Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            v-model="password"
            type="password"
            placeholder="xxxx-xxxx-xxxx-xxxx"
            @input="validatePassword"
          />
          <p class="text-red-500 text-xs italic" v-if="formatErrorMessage">{{ formatErrorMessage }}</p>
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="submitForm"
          >
            Login
          </button>
        </div>
      </form>
    </div>
</template>



<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      formatErrorMessage: ''
    }
  },
  methods: {
    validatePassword() {
      const appPassFormat = /^[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}$/i
      if (this.password.length > 0 && !this.password.match(appPassFormat)) {
        this.formatErrorMessage = 'Do NOT enter your normal password'
      } else {
        this.formatErrorMessage = ''
      }
    },
    submitForm() {
      // Here, you would typically make a request to your server to log the user in.
      if (!this.formatErrorMessage) {
          this.$emit('submit', { username: this.username, password: this.password })
      }
    },
  },
}
</script>