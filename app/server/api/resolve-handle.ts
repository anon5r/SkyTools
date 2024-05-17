import { defineEventHandler, getQuery } from 'h3'
import type { QueryObject } from 'ufo'
import { HandleResolver } from '@atproto/identity'

export default defineEventHandler(async event => {
  const query: QueryObject = getQuery(event)
  const handle: string = query.handle as string
  if (!handle) return { error: 'No handle provided' }
  if (handle.startsWith('did:')) return { did: handle }

  const resolve = new HandleResolver({})
  const did = await resolve.resolve(handle)
  if (did) return { did }
  return { error: 'No DID found for handle' }
})
