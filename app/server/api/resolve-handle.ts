import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import type { QueryObject } from 'ufo'
import { HandleResolver } from '@atproto/identity'

export default defineEventHandler(async (event) => {
  const query: QueryObject = getQuery(event)
  const handle = query.handle as string

  if (!handle) {
    setResponseStatus(event, 400)
    return { error: 'No handle provided' }
  }

  if (handle.startsWith('did:')) {
    return { did: handle }
  }

  try {
    const resolve = new HandleResolver({})
    const did = await resolve.resolve(handle)

    if (did) {
      return { did }
    }

    setResponseStatus(event, 404)
    return { error: 'No DID found for handle' }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { error: 'Internal Server Error' }
  }
})
