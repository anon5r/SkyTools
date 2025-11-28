import { DidResolver, HandleResolver } from '@atproto/identity'
import { getHandle } from '@atproto/common-web'
import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url)
  const actor = url.searchParams.get('actor')

  if (!actor) {
    return new Response(JSON.stringify({ error: 'No `actor` provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    if (actor.startsWith('did:')) {
      const resolver = new DidResolver({})
      const didDoc = await resolver.resolve(actor)
      if (didDoc) {
        return new Response(
          JSON.stringify({ did: actor, handle: getHandle(didDoc) }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
    } else {
      const resolver = new HandleResolver({})
      const did = await resolver.resolve(actor)
      if (did) {
        return new Response(JSON.stringify({ did: did, handle: actor }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    return new Response(
      JSON.stringify({ error: 'No DID or handle found' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
