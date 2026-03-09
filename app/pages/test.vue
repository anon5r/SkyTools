<!-- /pages/test-resolver.vue -->
<template>
  <div>
    <h1>Test Resolver</h1>
    <input v-model="actor" placeholder="Enter actor" >
    <button @click="testResolver">Test</button>
    <pre>{{ result }}</pre>
  </div>
</template>

<script>
  import * as identity from '@atproto/identity'
  const { DidResolver, HandleResolver } = identity

  export default {
    data() {
      return {
        actor: '',
        result: null,
        error: null,
      }
    },
    methods: {
      async testResolver() {
        try {
          const actor = this.actor
          if (!actor) {
            this.result = { error: 'No `actor` provided' }
            return
          }

          let result = {}
          if (actor.startsWith('did:')) {
            const resolver = new DidResolver({})
            const handle = await resolver.resolve(actor)
            result = { did: actor, handle }
          } else {
            const resolver = new HandleResolver({})
            const did = await resolver.resolve(actor)
            result = { did, handle: actor }
          }

          this.result = result
        } catch (error) {
          this.error = error.message
        }
      },
    },
  }
</script>
