import axios from 'axios'
import { isDev } from '@/utils'

const plcURL = 'https://plc.directory'
const xrpcPath = '/xrpc/com.atproto.identity.resolveHandle'




const resolveDID = async (identifier :string) => {
  const url = `${plcURL}/${identifier}`
  try {
    const res = await axios.get(url)
    if (isDev()) console.log(res)
    if (res.data?.alsoKnownAs)
      return res.data?.alsoKnownAs[0]
  } catch (err) {
    if (isDev()) console.error(err)
    if (err.response?.data.message)
      return err.response?.data.message
  }
}

const resolveHandle = async (identifier :string) => {
  const host = identifier.substring(identifier.indexOf('.')+1)
  const url = `https://${host}${xrpcPath}?handle=${identifier}`
  try {
    const res = await axios.get(url)
    if (isDev()) console.log(res)

    if (res.data?.did)
      return res.data.did
  } catch (err) {
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