import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { resolveDid } from '../utils/identity'
import { DateTime } from 'luxon'

export default defineEventHandler(async event => {
  const { repo: actor } = getQuery(event)

  if (typeof actor !== 'string' || !actor) {
    setResponseStatus(event, 400)
    return { error: 'Query parameter "repo" must be a non-empty string.' }
  }

  if (!actor.startsWith('did:')) {
    setResponseStatus(event, 400)
    return { error: 'Invalid DID' }
  }

  try {
    const didDoc = await resolveDid(actor)

    if (!didDoc) {
      setResponseStatus(event, 404)
      return { error: 'No DID document found' }
    }

    const handle = didDoc.aka ?? actor
    const pdsEndpoint = didDoc.pds?.serviceEndpoint

    if (!pdsEndpoint) {
      setResponseStatus(event, 404)
      return { error: 'No personal data server found' }
    }

    const repoUrl = `${pdsEndpoint}/xrpc/com.atproto.sync.getRepo?did=${actor}`

    const response = await fetch(repoUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'SkyTools/1.0 (Cloudflare Workers)',
      },
    })
    if (response.status !== 200 || response.body === null) {
      throw new Error(`Error fetching repo data: Status ${response.status}`)
    }

    const date = DateTime.now().toFormat('yyyyMMdd_HHmm')
    const filename = `${handle}_${date}.car`

    const headers = {
      'Content-Type': 'application/vnd.ipld.car',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Cache-Control': 'no-cache',
    }

    return new Response(response.body, { status: 200, headers })
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return {
      error: 'Error occurred while downloading file',
      details: error instanceof Error ? error.message : String(error),
    }
  }
})
