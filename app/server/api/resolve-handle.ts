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
    let recordValue: string[] = []
    for (const i in records)
      for (const ii in records[i])
        if (records[i][ii].startsWith('did='))
          recordValue.push(records[i][ii].startsWith('did=') ? records[i][ii].substring(4) : records[i][ii])
    return { did: recordValue }
  } catch (e: any) {
    return { error: 'No record found', details: { code: e.code, hostname: e.hostname } }
  }
})