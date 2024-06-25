import {
  createError,
  defineEventHandler,
  getQuery,
  sendError,
  setResponseStatus,
} from 'h3'
import type { QueryObject } from 'ufo'
import { DidResolver, HandleResolver } from '@atproto/identity'
import { getHandle } from '@atproto/common-web'
import { type DidDocument } from '@atproto/identity/src/types'

const timeoutMS: number = 3000
export default defineEventHandler(async event => {
  const query: QueryObject = getQuery(event)
  const param: string = query.query as string

  console.log('Received request with query:', param)

  if (!param) {
    console.log('No query provided')
    sendError(
      event,
      createError({ status: 500, statusText: 'No `query` provided' })
    )
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

    if (param.startsWith('did:')) {
      console.log('Resolving DID:', param)
      const resolver = new DidResolver({
        timeout: timeoutMS,
      })
      const handle = (await timeout(
        resolver.resolve(param),
        timeoutMS
      )) as DidDocument
      if (handle) {
        result = { did: param, handle: getHandle(handle) }
        console.log('Resolved handle:', result.handle)
      }
    } else {
      console.log('Resolving handle:', param)
      const resolver = new HandleResolver({
        timeout: timeoutMS,
        backupNameservers: ['1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4'],
      })
      const did = (await timeout(resolver.resolve(param), timeoutMS)) as string
      if (did) {
        result = { did: did, handle: param }
        console.log('Resolved DID:', result.did)
      }
    }

    if (result.did) {
      console.log('Returning success response:', result)
      setResponseStatus(event, 200)
      return result
    } else {
      console.log('Returning not found response:', result)
      sendError(
        event,
        createError({ status: 404, statusText: 'Not found' }),
        false
      )
    }
  } catch (error: Error | any) {
    console.error('Error occurred:', error)
    sendError(event, error, false)
  }
})
