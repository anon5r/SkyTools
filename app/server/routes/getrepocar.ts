import { DidResolver } from '@atproto/identity'
import { getHandle, getPdsEndpoint } from '@atproto/common-web'
import { DateTime } from 'luxon'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { repo: actor } = req.query

  if (!actor || typeof actor !== 'string') {
    return res.status(400).json({ error: 'No DID provided' })
  }

  if (!actor.startsWith('did:')) {
    return res.status(400).json({ error: 'Invalid DID' })
  }

  try {
    const didResolve = new DidResolver({})
    const didDoc = await didResolve.resolve(actor)

    if (!didDoc) {
      return res.status(404).json({ error: 'No DID document found' })
    }

    const handle = getHandle(didDoc)
    const pdsEndpoint = getPdsEndpoint(didDoc)

    if (!pdsEndpoint) {
      return res.status(404).json({ error: 'No personal data server found' })
    }

    const repoUrl = `${pdsEndpoint}/xrpc/com.atproto.sync.getRepo?did=${actor}`

    // Fetch the repo data
    const response = await fetch(repoUrl)

    if (!response.ok || !response.body) {
      throw new Error(`Error fetching repo data: ${response.status} ${response.statusText}`)
    }

    const date = DateTime.now().toFormat('yyyyMMdd_HHmm')
    const filename = `${handle}_${date}.car`

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.ipld.car')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    res.setHeader('Cache-Control', 'no-cache')

    // Stream the response body
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res.status(200).send(buffer)

  } catch (error) {
    console.error('Error in getrepocar:', error)
    return res.status(500).json({
      error: 'Error occurred while downloading file',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
