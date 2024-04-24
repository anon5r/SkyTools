import { getQuery } from 'h3'
import dns from 'dns'
import type { QueryObject } from 'ufo'
export default defineEventHandler(async (event) => {
  const query: QueryObject = getQuery(event)
  const handle: string = query.handle as string
  if (!handle)
    return { error: 'No handle provided' }
  if (handle.startsWith('did:plc:') || handle.startsWith('did:web:'))
    return handle

  try {
    const records = await dns.promises.resolveTxt(`_atproto.${handle}`)
    const recordValue = records[0][0]
    return { did: recordValue.startsWith('did=') ? recordValue.substring(4) : recordValue }
  } catch (e: any) {
    return { error: 'No record found', details: { code: e.code, hostname: e.hostname } }
  }
})