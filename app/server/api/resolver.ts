import { DidResolver, HandleResolver } from '@atproto/identity'
import { getHandle } from '@atproto/common-web'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const timeoutMS: number = 3000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query: param } = req.query

  console.log('Received request with query:', param)

  if (!param || typeof param !== 'string') {
    console.log('No query provided')
    return res.status(400).json({ error: 'No `query` provided' })
  }

  try {
    let result: { error?: string; did?: string; handle?: string } = {
      error: 'No DID or handle found',
    }

    const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('Promise timed out after ' + ms + ' ms'))
        }, ms)
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
      const didDoc = await timeout(resolver.resolve(param), timeoutMS)
      if (didDoc) {
        result = { did: param, handle: getHandle(didDoc) }
        console.log('Resolved handle:', result.handle)
      }
    } else {
      console.log('Resolving handle:', param)
      const resolver = new HandleResolver({
        timeout: timeoutMS,
        backupNameservers: ['1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4'],
      })
      const did = await timeout(resolver.resolve(param), timeoutMS)
      if (did) {
        result = { did: did.toString(), handle: param }
        console.log('Resolved DID:', result.did)
      }
    }

    if (result.did) {
      console.log('Returning success response:', result)
      return res.status(200).json(result)
    } else {
      console.log('Returning not found response:', result)
      return res.status(404).json({ error: 'Not found' })
    }
  } catch (error: unknown) {
    console.error('Error occurred:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
