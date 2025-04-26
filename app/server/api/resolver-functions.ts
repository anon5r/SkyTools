import { DidResolver, HandleResolver } from '@atproto/identity'
import { getHandle } from '@atproto/common-web'

export async function onRequest(context: any) {
  const { request } = context
  const url = new URL(request.url)
  const actor = url.searchParams.get('actor')

  if (!actor) {
    return new Response(JSON.stringify({ error: 'No `actor` provided' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  if (actor.startsWith('did:')) {
    const resolver = new DidResolver({})
    const handle = await resolver.resolve(actor)
    if (handle) {
      return new Response(
        JSON.stringify({ did: actor, handle: getHandle(handle) }),
        {
          headers: { 'content-type': 'application/json' },
        }
      )
    }
  } else {
    const resolver = new HandleResolver({})
    const did = await resolver.resolve(actor)
    if (did) {
      return new Response(JSON.stringify({ did: did, handle: actor }), {
        headers: { 'content-type': 'application/json' },
      })
    }
  }

  return new Response(JSON.stringify({ error: 'No DID or handle found' }), {
    status: 404,
    headers: { 'content-type': 'application/json' },
  })
}
