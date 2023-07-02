import axios, { AxiosError } from 'axios'
import { useAppConfig } from 'nuxt/app'

//
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}

export const formatIdentifier = (id: string) => {
  if (id.length > 0 && !id.startsWith('did:')) {
    id.startsWith('@') ? id.substring(1) : id
    id.startsWith('at://') ? id.substring(5) : id
    if (!id.includes('.')) {
      id += useAppConfig().defaultSuffix // default xxx -> xxx.bsky.social
    }
  }
  return id
}

export const resolveDID = async (identifier: string) => {
  try {
    let requestUrl
    const config = useAppConfig()
    if (identifier.startsWith('did:'))
      requestUrl = `https://plc.directory/${identifier}`
    else
      requestUrl = `${config.bskyService}/xrpc/com.atproto.identity.resolveHandle?handle=${identifier}`

    const res = await axios.get(requestUrl)
    if (isDev()) console.log(res)

    if (res.data?.did) return res.data.did
    else if (res.data?.alsoKnownAs) return res.data.alsoKnownAs[0]
  } catch (error: any) {
    if (isDev()) console.error(error)
    throw error
  }
}
