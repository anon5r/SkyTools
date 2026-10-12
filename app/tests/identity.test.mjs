import { afterEach, describe, expect, spyOn, test } from 'bun:test'
import { resolveDid, resolveHandle } from '../server/utils/identity.ts'

const did = 'did:plc:46ntpdavkmlq4ecbnjgdlbm2'
let fetchSpy
afterEach(() => fetchSpy?.mockRestore())

describe('Workers identity resolution', () => {
  test('resolves and validates a PLC document using native fetch', async () => {
    fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        id: did,
        alsoKnownAs: ['at://example.bsky.social'],
        service: [
          {
            id: '#atproto_pds',
            type: 'AtprotoPersonalDataServer',
            serviceEndpoint: 'https://example.pds.host',
          },
        ],
      })
    )
    const data = await resolveDid(did)
    expect(data.aka).toBe('example.bsky.social')
    expect(data.pds.serviceEndpoint).toBe('https://example.pds.host')
    expect(fetchSpy.mock.calls[0][1].redirect).toBe('manual')
  })

  test('rejects a document belonging to a different DID', async () => {
    fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        id: 'did:plc:c22jdrqhoajyj5ca7e56a3ke',
      })
    )
    await expect(resolveDid(did)).rejects.toThrow()
  })

  test('refuses DID document redirects instead of following them', async () => {
    fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 302,
        headers: { location: 'https://another.example/did.json' },
      })
    )
    await expect(resolveDid(did)).rejects.toThrow()
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  test('rejects private did:web destinations before issuing a request', async () => {
    fetchSpy = spyOn(globalThis, 'fetch')
    await expect(resolveDid('did:web:localhost')).rejects.toThrow()
    await expect(resolveDid('did:web:127.0.0.1')).rejects.toThrow()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('resolves DNS-only handles through DNS over HTTPS', async () => {
    fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(async input => {
      const url = new URL(
        input instanceof Request ? input.url : input.toString()
      )
      if (url.hostname === 'cloudflare-dns.com') {
        return Response.json({
          Status: 0,
          Answer: [
            {
              name: '_atproto.example.bsky.social.',
              type: 16,
              TTL: 60,
              data: `"did=${did}"`,
            },
          ],
        })
      }
      return new Response('Not found', { status: 404 })
    })
    expect(await resolveHandle('example.bsky.social')).toBe(did)
  })
})
