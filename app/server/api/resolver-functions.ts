import { DidResolver } from '@atproto/identity'
import { getHandle } from '@atproto/common-web'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { actor } = req.query

  if (!actor || typeof actor !== 'string') {
    return res.status(400).json({ error: 'No `actor` provided' })
  }

  try {
    if (actor.startsWith('did:')) {
      const resolver = new DidResolver({})
      const didDoc = await resolver.resolve(actor)
      if (didDoc) {
        return res.status(200).json({
          did: actor,
          handle: getHandle(didDoc),
        })
      }
    } else {
      const resolver = new DidResolver({})
      // For handle resolution, we'd need HandleResolver but let's use a simpler approach
      // This is a simplified version - you may need to adjust based on your needs
      try {
        // Try to resolve as handle by checking common DID methods
        const response = await fetch(`https://${actor}/.well-known/atproto-did`)
        if (response.ok) {
          const did = await response.text()
          if (did.startsWith('did:')) {
            return res.status(200).json({ did: did.trim(), handle: actor })
          }
        }
      } catch (e) {
        // Fallback or additional logic can go here
      }
    }

    return res.status(404).json({ error: 'No DID or handle found' })
  } catch (error) {
    console.error('Error in resolver-functions:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
