import { HandleResolver } from '@atproto/identity'

export async function onRequest(context: any) {
  const url = new URL(context.request.url)
  const handle = url.searchParams.get('handle')

  if (!handle) {
    return new Response(JSON.stringify({ error: 'No handle provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (handle.startsWith('did:')) {
    return new Response(JSON.stringify({ did: handle }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const resolve = new HandleResolver({})
  const did = await resolve.resolve(handle)

  if (did) {
    return new Response(JSON.stringify({ did }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({ error: 'No DID found for handle' }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}