import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import type { QueryObject } from 'ufo'
import { DidResolver, HandleResolver } from '@atproto/identity'
import { getHandle } from '@atproto/common-web'
import { type DidDocument } from '@atproto/identity/src/types'

const timeoutMS: number = 1000
export default defineEventHandler(async event => {
  const query: QueryObject = getQuery(event)
  const actor: string = query.actor as string

  console.log('Received request with actor:', actor)

  if (!actor) {
    console.log('No actor provided')
    setResponseStatus(event, 400)
    return { error: 'No `actor` provided' }
  }

  try {
    let result: { error?: string; did?: string; handle?: string } = {
      error: 'No DID or handle found',
    }

    const timeout = (
      promise: Promise<DidDocument | string | null | undefined>,
      ms: number
    ) => {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('Promise timed out after ' + ms + ' ms'))
        }, ms as number)
        promise
          .then(value => {
            clearTimeout(timer)
            resolve(value)
          })
          .catch(err => {
            clearTimeout(timer)
            reject(err)
          })
      })
    }

    if (actor.startsWith('did:')) {
      console.log('Resolving DID:', actor)
      const resolver = new DidResolver({})
      const handle = (await timeout(
        resolver.resolve(actor),
        timeoutMS
      )) as DidDocument
      if (handle) {
        result = { did: actor, handle: getHandle(handle) }
        console.log('Resolved handle:', result.handle)
      }
    } else {
      console.log('Resolving handle:', actor)
      const resolver = new HandleResolver({})
      const did = (await timeout(resolver.resolve(actor), timeoutMS)) as string
      if (did) {
        result = { did: did, handle: actor }
        console.log('Resolved DID:', result.did)
      }
    }

    if (result.did) {
      console.log('Returning success response:', result)
      setResponseStatus(event, 200)
      return result
    } else {
      console.log('Returning not found response:', result)
      setResponseStatus(event, 404)
      return result
    }
  } catch (error: Error | any) {
    console.error('Error occurred:', error)
    setResponseStatus(event, 500)
    return { error: error.message }
  }
})
