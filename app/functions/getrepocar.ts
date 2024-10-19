import type { EventContext } from '@cloudflare/workers-types'
import { DidResolver } from '@atproto/identity'
import { DateTime } from 'luxon'

interface Env {
  MY_SECRET: string
}

interface Params {
  id: string
}

export async function onRequest(context: EventContext<Env, Params, unknown>) {
  const url = new URL(context.request.url)
  const actor = url.searchParams.get('repo')

  if (!actor) {
    return new Response(JSON.stringify({ error: 'No DID provided' }), {
      status: 400,
    })
  }
  if (!actor.startsWith('did:')) {
    return new Response(JSON.stringify({ error: 'Invalid DID' }), {
      status: 400,
    })
  }

  const didResolve = new DidResolver({})
  const didDoc = await didResolve.resolve(actor)

  if (!didDoc) {
    return new Response(JSON.stringify({ error: 'No DID document found' }), {
      status: 404,
    })
  }

  const handle = getHandle(didDoc)
  const pdsEndpoint = getPdsEndpoint(didDoc)

  if (!pdsEndpoint) {
    return new Response(
      JSON.stringify({ error: 'No personal data server found' }),
      { status: 404 }
    )
  }

  const repoUrl = `${pdsEndpoint}/xrpc/com.atproto.sync.getRepo?did=${actor}`

  try {
    const response = await fetch(repoUrl)
    if (response.status !== 200 || response.body === null) {
      throw new Error('Error occurred while fetching the repo data')
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
    return new Response(
      JSON.stringify({ error: 'Error occurred while downloading file' }),
      { status: 500 }
    )
  }
}
