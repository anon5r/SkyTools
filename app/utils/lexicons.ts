import axios, { AxiosError } from 'axios'
import { isDev } from '@/utils/helpers'

const plcURL = 'https://plc.directory'

const config = {
  defaultSuffix:
    process.env.ATPROTO_SERVICE_SUFFIX || ('.bsky.social' as string),
  bskyService: process.env.ATPROTO_SERVICE || ('https://bsky.social' as string),
  bskyAppURL: process.env.SERVICE_APP_URL || ('https://bsky.app' as string),
  adminDID: process.env.ADMIN_DID || ('did:bsky:admin' as string),
}

export const formatIdentifier = (id: string) => {
  if (id.length > 0 && !id.startsWith('did:')) {
    id = id.startsWith('@') ? id.substring(1) : id
    id = id.startsWith('at://') ? id.substring(5) : id
    if (!id.includes('.')) {
      id += config.defaultSuffix // default xxx -> xxx.bsky.social
    }
  }
  return id
}

/**
 * Convert DID to at-proto-uri or handle to DID
 * @param {string} identifier DID
 * @returns {string}
 */
export const resolveDID = async (
  identifier: string,
  onlyHandle: boolean = true
): Promise<string> => {
  try {
    let requestUrl
    if (identifier.startsWith('did:')) requestUrl = `${plcURL}/${identifier}`
    else
      requestUrl = `${config.bskyService}/xrpc/com.atproto.identity.resolveHandle?handle=${identifier}`

    const res = await axios.get(requestUrl)

    if (res.data?.did) {
      if (isDev()) console.log(res.data)
      return res.data.did as string
    } else if (res.data?.alsoKnownAs) {
      const handle = res.data.alsoKnownAs[0]
      return onlyHandle ? formatIdentifier(handle) : (handle as string)
    }
    throw new Error('Invalid DID')
  } catch (error: any) {
    if (isDev()) console.error(error)
    throw error
  }
}

/**
 *
 * @param {string} identifier
 * @returns
 */
export const resolveHandle = async (identifier: string): Promise<string> => {
  const host = identifier.substring(identifier.indexOf('.') + 1)
  const url = `${config.bskyService}/xrpc/com.atproto.identity.resolveHandle?handle=${identifier}`
  try {
    const res = await axios.get(url)
    if (isDev()) console.log(res)

    if (res.data?.did) return res.data.did as string
    throw new Error('Failed to resolve handle')
  } catch (err: any) {
    if (isDev()) console.error(err)
    throw err
  }
}

/**
 *
 * @param {string} identifier
 * @returns
 */
export const getIdentityAuditLogs = async (
  identifier: string
): Promise<any> => {
  const host = identifier.substring(identifier.indexOf('.') + 1)
  const url = `${plcURL}/${identifier}/log/audit`
  try {
    const res = await axios.get(url)
    if (isDev()) console.log(res)

    if (res.data) return res.data as any
    throw new Error('Failed to resolve handle')
  } catch (err: any) {
    if (isDev()) console.error(err)
    throw err
  }
}

/**
 * Parsing at-proto-uri
 * @param {string} uri at://did:plc:xxxxxxxxxxxxx/app.bsky.feed.post/abbcde12345
 * @return {object} {did: did:plc:xxxxxxxxxxxxx, identifier: xxxxxxxxxxxxxx, collection: app.bsky.feed.post, key: abbcde12345}
 */
export const parseAtUri = (uri: string): { [key: string]: string } => {
  const m = uri.match(
    /^at:\/\/(?<did>did:\w+:(?<identifier>[a-z0-9]+))\/(?<collection>[\w.-]+)\/(?<key>[a-z0-9]+)$/
  )
  if (m && m.groups) return m.groups

  throw new Error('Invalid URI format')
}

/**
 * Parsing DID
 * @param {string} did did:plc:xxxxxxxxxxxxxx, did:web:xxxxxxxxxxxxxx
 * @return {object} {method: plc, identifier: xxxxxxxxxxxxxx}
 */
export const parseDID = (did: string): { [key: string]: string } => {
  const m = did.match(/^did:(?<method>\w+):(?<identifier>[a-z0-9]+)$/)
  if (m && m.groups) return m.groups

  throw new Error('Invalid URI format')
}

/**
 * Fetch posts
 * @param string collection
 * @param string repo
 * @param string recordKey
 * @return object
 */
export const getRecord = async (
  collection: string,
  repo: string,
  recordKey: string
): Promise<object> => {
  try {
    const params = new URLSearchParams()
    params.append('collection', collection)
    params.append('repo', repo)
    params.append('rkey', recordKey)
    const response = await axios({
      url: `${config.bskyService}/xrpc/com.atproto.repo.getRecord`,
      method: 'GET',
      params: params,
    })

    if (response.data) {
      console.log(response.data)
      return response.data as object
    }
    return {}
  } catch (err: any) {
    if (isDev()) console.error(err)
    throw new Error(err.message, err)
  }
}

/**
 * Get records as list
 * @param {string} collection
 * @param {string} identifier
 * @param {int} limit
 * @return {array} list of records
 */
export const listRecords = async (
  collection: string,
  identifier: string,
  limit: number = 50
): Promise<any> => {
  try {
    const params = new URLSearchParams()
    params.append('collection', collection)
    params.append('repo', identifier)
    params.append('limit', limit.toString())
    const response = await axios({
      url: `${config.bskyService}/xrpc/com.atproto.repo.listRecords`,
      method: 'GET',
      params: params,
    })

    if (response.data) return response.data as any
  } catch (err: any) {
    if (isDev()) console.error(err)
    throw new Error(err.message, err)
  }
}

export const getBlob = async (did: string, cid: string): Promise<string> => {
  try {
    const params = new URLSearchParams()
    params.append('did', did)
    params.append('cid', cid)
    const response = await axios({
      url: `${config.bskyService}/xrpc/com.atproto.sync.getBlob`,
      method: 'GET',
      params: params,
    })
    if (response.data) {
      const blobObject = new Blob([response.data], {
        type: response.headers['Content-Type'] as string,
      })
      return URL.createObjectURL(blobObject)
    }
    return ''
  } catch (err: any) {
    if (isDev()) console.error(err)
    throw new Error(err.message, err)
  }
}

/**
 * Get individual post
 * @param {string} identity
 * @param {string} recordKey
 */
export const getPost = async (identity: string, recordKey: string) => {
  try {
    return await getRecord('app.bsky.feed.post', identity, recordKey)
  } catch (err: any) {
    if (isDev()) console.error(err)
    return err.message
  }
}

export default {
  isDev,
  formatIdentifier,
  resolveDID,
  resolveHandle,
  getIdentityAuditLogs,
  parseDID,
  parseAtUri,
  getPost,
  getBlob,
  listRecords,
  getRecord,
}
