import axios from 'axios'
import { isDev } from '@/utils'

const plcURL = 'https://plc.directory'
const xrpcPath = '/xrpc/com.atproto.identity.resolveHandle'




const resolveDID = async (identifier: string, onlyHandle: boolean = true) => {
  const url = `${plcURL}/${identifier}`
  try {
    const res = await axios.get(url)
    if (isDev()) console.log(res)
    if (res.data?.alsoKnownAs && res.data?.alsoKnownAs.length > 0) {
      // console.debug(res.data?.alsoKnownAs[0])
      if (onlyHandle && /^at:\/\//i.test(res.data?.alsoKnownAs[0])) {
        return res.data?.alsoKnownAs[0].replace(/^at:\/\//i, '')
      }
      return res.data?.alsoKnownAs[0]
    }
  } catch (err: Error) {
    if (isDev()) console.error(err)
    if (err.response?.data.message)
      return err.response?.data.message
  }
}

const resolveHandle = async (identifier: string) => {
  const host = identifier.substring(identifier.indexOf('.') + 1)
  const url = `https://${host}${xrpcPath}?handle=${identifier}`
  try {
    const res = await axios.get(url)
    if (isDev()) console.log(res)

    if (res.data?.did)
      return res.data.did
  } catch (err: Error) {
    if (isDev()) console.error(err)
    if (err.response?.data.message)
      return err.response?.data.message
  }
}

export function useIdentity() {
  return {
    resolveDID,
    resolveHandle
  }
}