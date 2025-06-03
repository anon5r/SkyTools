import { DidResolver, HandleResolver } from '@atproto/identity'
import type { VercelRequest, VercelResponse } from '@vercel/node'

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
    const didDoc = await didResolver.resolve(did)
    return didDoc?.alsoKnownAs?.[0]?.replace('at://', '') ?? null
  } catch (error) {
    console.error(`Failed to resolve DID: ${did}`, error)
    return null
  }
}

function isDid(value: string): boolean {
  return value.startsWith('did:')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query: param } = req.query

  if (!param || typeof param !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' })
  }

  try {
    if (isDid(param)) {
      const resolvedHandle = await resolveDid(param)
      if (resolvedHandle) {
        return res.status(200).json({ handle: resolvedHandle, did: param })
      } else {
        return res.status(404).json({ error: 'DID not found' })
      }
    } else {
      const resolvedDid = await resolveHandle(param)
      if (resolvedDid) {
        return res.status(200).json({ handle: param, did: resolvedDid })
      } else {
        return res.status(404).json({ error: 'Handle not found' })
      }
    }
  } catch (error) {
    console.error('Error in handle-resolve:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
