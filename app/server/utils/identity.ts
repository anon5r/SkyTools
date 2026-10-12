import {
  createDidResolver,
  asAtprotoDid,
  extractAtprotoData,
} from '@atproto-labs/did-resolver'
import { AtprotoDohHandleResolver } from '@atproto-labs/handle-resolver'

// Use Workers' native fetch instead of the Node-only undici dispatcher.
// Workers does not implement redirect: 'error'; manual redirects preserve the
// resolver's refusal to follow redirects without changing global fetch.
const identityFetch: typeof fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input.toString())
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    !url.hostname.includes('.') ||
    url.hostname.includes(':') ||
    /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) ||
    /\.(local|internal|localhost|test|invalid)$/.test(url.hostname)
  )
    throw new Error('Identity resolution requires a public HTTPS hostname')
  const timeout = AbortSignal.timeout(10_000)
  return fetch(input, {
    ...init,
    redirect: 'manual',
    signal: init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout,
  })
}

export async function resolveDid(actor: string) {
  const resolver = createDidResolver({ fetch: identityFetch, allowHttp: false })
  const document = await resolver.resolve(asAtprotoDid(actor))
  return extractAtprotoData(document)
}

export async function resolveHandle(handle: string) {
  const resolver = new AtprotoDohHandleResolver({
    dohEndpoint: 'https://cloudflare-dns.com/dns-query',
    fetch: identityFetch,
  })
  return resolver.resolve(handle)
}
