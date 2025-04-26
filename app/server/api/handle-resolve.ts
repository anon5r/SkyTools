import {
  createError,
  defineEventHandler,
  getQuery,
  H3Event,
  sendError,
} from 'h3'
import { DidResolver, HandleResolver } from '@atproto/identity'

const didResolver = new DidResolver({ timeout: 3000 })
const handleResolver = new HandleResolver()

async function resolveHandle(handle: string): Promise<string | null> {
  try {
    const did = await handleResolver.resolve(handle)
    return did?.toString() ?? null
  } catch (error) {
    console.error(`Failed to resolve handle: ${handle}`, error)
    return null
  }
}

async function resolveDid(did: string): Promise<string | null> {
  try {
    const handle = await didResolver.resolve(did)
    return handle?.alsoKnownAs?.toString() ?? null
  } catch (error) {
    console.error(`Failed to resolve DID: ${did}`, error)
    return null
  }
}

function isDid(value: string): boolean {
  return value.startsWith('did:')
}

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const param = query.query

  if (param) {
    if (isDid(param.toString())) {
      const resolvedHandle = await resolveDid(param.toString())
      if (resolvedHandle) {
        return { handle: resolvedHandle, did: param }
      } else {
        return sendError(
          event,
          createError({ status: 404, statusText: 'DID not found' })
        )
      }
    } else {
      const resolvedDid = await resolveHandle(param.toString())
      if (resolvedDid) {
        return { handle: param, did: resolvedDid }
      } else {
        return sendError(
          event,
          createError({ status: 404, statusText: 'Handle not found' })
        )
      }
    }
  } else {
    return sendError(
      event,
      createError({ status: 400, statusText: 'Query parameter is required' })
    )
  }
})
