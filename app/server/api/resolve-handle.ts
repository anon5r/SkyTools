import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { HandleResolver } from '@atproto/identity'

export default defineEventHandler(async (event) => {
  const { handle } = getQuery(event)

  if (typeof handle !== 'string' || !handle) {
    setResponseStatus(event, 400)
    return { error: 'Query parameter "handle" must be a non-empty string.' }
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
