import { defineEventHandler, getQuery } from 'h3'
import { getPdsEndpoint, getHandle } from '@atproto/common-web'
import axios from 'axios'
import type { QueryObject } from 'ufo'
import { DidResolver } from '@atproto/identity'
import { DateTime } from 'luxon'

export default defineEventHandler(async event => {
  const query: QueryObject = getQuery(event)
  const actor = query.repo as string
  if (!actor) return { error: 'No DID provided' }
  if (!actor.startsWith('did:')) return { error: 'Invalid DID' }

  const didResolve = new DidResolver({})
  const didDoc = await didResolve.resolve(actor)
  if (!didDoc) return { error: 'No DID document found' }

  const handle = getHandle(didDoc)
  const pdsEndpoint = getPdsEndpoint(didDoc)
  if (!pdsEndpoint) return { error: 'No personal data server found' }

  const url = `${pdsEndpoint}/xrpc/com.atproto.sync.getRepo?did=${actor}`

  try {
    const response = await axios.get(url)
    const date = DateTime.now().toFormat('yyyyMMdd_HHmm')
    const filename = `${handle}_${date}.car`

    const headers = {
      'Content-Type': 'application/vnd.ipld.car',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Cache-Control': 'no-cache',
    }
    return new Response(response.data, { status: 200, headers: headers })
  } catch (error) {
    console.error(error)
    return { error: 'Error occurred while downloading file' }
  }
})
