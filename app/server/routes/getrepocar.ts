import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { DidResolver } from '@atproto/identity'
import { DateTime } from 'luxon'
import { getHandle, getPdsEndpoint } from '@atproto/common-web'

export default defineEventHandler(async (event) => {
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
    const didResolve = new DidResolver({})
    const didDoc = await didResolve.resolve(actor)

    if (!didDoc) {
      setResponseStatus(event, 404)
      return { error: 'No DID document found' }
    }

    const handle = getHandle(didDoc)
    const pdsEndpoint = getPdsEndpoint(didDoc)

    if (!pdsEndpoint) {
      setResponseStatus(event, 404)
      return { error: 'No personal data server found' }
    }

    const repoUrl = `${pdsEndpoint}/xrpc/com.atproto.sync.getRepo?did=${actor}`

    const response = await fetch(repoUrl, {
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
  } catch (error: any) {
    console.error(error)
    setResponseStatus(event, 500)
    return { 
      error: 'Error occurred while downloading file',
      details: error.message || String(error)
    }
  }
})
