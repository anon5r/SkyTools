import { HandleResolver } from '@atproto/identity'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { handle } = req.query

  if (!handle || typeof handle !== 'string') {
    return res.status(400).json({ error: 'No handle provided' })
  }

  if (handle.startsWith('did:')) {
    return res.status(200).json({ did: handle })
  }

  try {
    const resolver = new HandleResolver({})
    const did = await resolver.resolve(handle)

    if (did) {
      return res.status(200).json({ did: did.toString() })
    }

    return res.status(404).json({ error: 'No DID found for handle' })
  } catch (error) {
    console.error('Error in resolve-handle:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
