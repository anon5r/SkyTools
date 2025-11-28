import { defineEventHandler, getQuery } from 'h3'
import type { QueryObject } from 'ufo'
import { DidResolver, HandleResolver } from '@atproto/identity'
import { getHandle } from '@atproto/common-web'

export default defineEventHandler(async (event) => {
  const query: QueryObject = getQuery(event)
  const actor = query.actor as string

  if (!actor) {
    return { error: 'No `actor` provided' }
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

    return { error: 'No DID or handle found' }
  } catch (error) {
    console.error(error)
    return { error: 'Internal server error' }
  }
})
