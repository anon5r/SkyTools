import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { resolveDid, resolveHandle } from '../utils/identity'

export default defineEventHandler(async event => {
  const { actor } = getQuery(event)

  if (typeof actor !== 'string' || !actor) {
    setResponseStatus(event, 400)
    return { error: 'Query parameter "actor" must be a non-empty string.' }
  }

  try {
    if (actor.startsWith('did:')) {
      const didDoc = await resolveDid(actor)
      if (didDoc) {
        return { did: actor, handle: didDoc.aka }
      }
    } else {
      const did = await resolveHandle(actor)
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
