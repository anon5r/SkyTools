import { HandleResolver } from '@atproto/identity'
import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async (context) => {
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

  try {
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
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}