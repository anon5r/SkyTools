import { defineEventHandler, getQuery } from 'h3'
import { resolveTxt } from 'node:dns/promises'
import type { QueryObject } from 'ufo'

export default defineEventHandler(async event => {
  const query: QueryObject = getQuery(event)
  const handle: string = query.handle as string
  if (!handle) return { error: 'No handle provided' }
  if (handle.startsWith('did:')) return { did: handle }

  await event.respondWith(requestDNS(handle))
})

async function requestDNS(handle: string): Promise<Response> {
  console.log('start resolve via DNS TXT record')
  const records = await resolveTxt(`_atproto.${handle}`)
  console.log('records', records)
  let recordValue: string[] = []
  for (const i in records)
    for (const ii in records[i])
      if (records[i][ii].startsWith('did='))
        recordValue.push(
          records[i][ii].startsWith('did=')
            ? records[i][ii].substring(4)
            : records[i][ii]
        )
  // return recordValue
  return new Response(JSON.stringify({ did: recordValue }), { status: 200 })
}
