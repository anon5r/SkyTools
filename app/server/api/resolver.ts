import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { DidResolver, HandleResolver } from '@atproto/identity'
import { getHandle } from '@atproto/common-web'

export default defineEventHandler(async (event) => {
  const { actor } = getQuery(event)

  if (typeof actor !== 'string' || !actor) {
    setResponseStatus(event, 400)
    return { error: 'Query parameter "actor" must be a non-empty string.' }
  }

  try {
    if (actor.startsWith('did:')) {
      const resolver = new DidResolver({})
      const didDoc = await resolver.resolve(actor)
      if (didDoc) {
        return { did: actor, handle: getHandle(didDoc) }
      }
    } else {
      const resolver = new HandleResolver({})
      const did = await resolver.resolve(actor)
      if (did) {
        return { did: did, handle: actor }
      }
    }

    setResponseStatus(event, 404)
    return { error: 'No DID or handle found' }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { error: 'Internal server error' }
  }
})
