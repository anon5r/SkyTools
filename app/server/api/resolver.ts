import { defineEventHandler, getQuery } from 'h3'
import type { QueryObject } from 'ufo'
import { DidResolver, HandleResolver } from '@atproto/identity'
import { getHandle } from '@atproto/common-web'

export default defineEventHandler(async event => {
  const query: QueryObject = getQuery(event)
  const actor: string = query.actor as string
  if (!actor) return { error: 'No `actor` provided' }
  if (actor.startsWith('did:')) {
    const resolver = new DidResolver({})
    const handle = await resolver.resolve(actor)
    if (handle) return { did: actor, handle: getHandle(handle) }
  } else {
    const resolver = new HandleResolver({})
    const did = await resolver.resolve(actor)
    if (did) return { did: did, handle: actor }
  }

  return { error: 'No DID or handle found' }
})
