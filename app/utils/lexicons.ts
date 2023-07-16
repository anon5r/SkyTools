import axios, { AxiosError } from 'axios'
import { isDev } from '@/utils/helpers'
import {
  AppBskyActorProfile,
  AppBskyFeedPost,
  AtUri,
  AtpAgent,
  ComAtprotoRepoGetRecord,
  ComAtprotoRepoListRecords,
} from '@atproto/api'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'

const plcURL = 'https://plc.directory'
let atp: AtpAgent | null = null

let config = {
  defaultSuffix: '.bsky.social' as string,
  bskyService: 'https://bsky.social' as string,
  bskyAppURL: 'https://bsky.app' as string,
  adminDID: 'did:bsky:admin' as string,
}

export const setConfig = (newConfig: typeof config) => {
  if (isDev()) console.log('[Lexicons] setConfig::newConfig = ', newConfig)
  config = { ...config, ...newConfig }
  atp = new AtpAgent({ service: config.bskyService })
}

export const getConfig = (): {
  defaultSuffix: string
  bskyService: string
  bskyAppURL: string
  adminDID: string
} => {
  return config
}

export const getAgent = (): AtpAgent => {
  if (!atp) {
    atp = new AtpAgent({ service: config.bskyService })
  }
  return atp
}

/**
 *
 */
export const formatIdentifier = (id: string) => {
  if (id.length > 0) {
    id = id.startsWith('at://') ? id.substring(5) : id
    if (!id.startsWith('did:')) id = id.startsWith('@') ? id.substring(1) : id
    if (!id.startsWith('did:') && !id.includes('.')) {
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
      if (isDev())
        console.log('[Lexicons] resolveDID::response.data = ', res.data)
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
    if (isDev()) console.log('[Lexicons] resolveHandle::response.data = ', res)

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
    if (isDev())
      console.log('[Lexicons] getIdentityAuditLogs::response.data = ', res)

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
  try {
    const aturi = new AtUri(uri)
    return {
      did: aturi.host,
      collection: aturi.collection,
      rkey: aturi.rkey,
    }
  } catch (err) {
    throw err
  }
}

/**
 * Parsing DID
 * @param {string} did did:plc:xxxxxxxxxxxxxx, did:web:xxxxxxxxxxxxxx
 * @return {object} {method: plc, identifier: xxxxxxxxxxxxxx}
 */
export const parseDID = (did: string): { [key: string]: string } => {
  const m = did.match(/^did:(?<method>\w+):(?<identifier>[a-z0-9:%-]+)$/)
  if (m && m.groups) return m.groups

  throw new Error('Invalid URI format')
}

/**
 * Fetch posts
 * @param string collection
 * @param string repo
 * @param string recordKey
 * @return ComAtprotoRepoGetRecord.Response
 */
export const getRecord = async (
  collection: string,
  repo: string,
  recordKey: string
): Promise<ComAtprotoRepoGetRecord.Response | any> => {
  try {
    const response = await getAgent().api.com.atproto.repo.getRecord({
      repo: repo,
      collection: collection,
      rkey: recordKey,
    })

    if (response.data) {
      if (isDev())
        console.log('[Lexicons] getRecord::response.data = ', response.data)
      return response
    }
    throw new Error('Record not found')
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
 * @return {ComAtprotoRepoListRecords.Response} list of records
 */
export const listRecords = async (
  collection: string,
  identifier: string,
  limit: number = 50
): Promise<ComAtprotoRepoListRecords.Response> => {
  try {
    const response = await getAgent().api.com.atproto.repo.listRecords({
      collection: collection,
      repo: identifier,
      limit: limit,
    })

    if (response) return response
    throw new Error('Record not found')
  } catch (err: any) {
    if (isDev()) console.error(err)
    throw new Error(err.message, err)
  }
}

export const getBlob = async (did: string, cid: string): Promise<string> => {
  try {
    const response = await getAgent().com.atproto.sync.getBlob({
      did: did,
      cid: cid,
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
 * @return {Promise<AppBskyFeedPost.Record>}
 */
export const getPost = async (
  identity: string,
  recordKey: string
): Promise<AppBskyFeedPost.Record> => {
  try {
    const res = await getRecord('app.bsky.feed.post', identity, recordKey)
    if (res.success) return res
    throw new Error('Failed to get post')
  } catch (err: any) {
    if (isDev()) console.error(err)
    return err.message
  }
}

/**
 * Get identifier details
 * @param {string} id handle or DID
 */
export const describeRepo = async (id: string): Promise<any> => {
  try {
    const params = new URLSearchParams()
    params.append('repo', id)
    const response = await axios({
      url: `${config.bskyService}/xrpc/com.atproto.repo.describeRepo`,
      method: 'GET',
      params: params,
    })

    if (response.data) {
      if (isDev())
        console.log('[Lexicons] describeRepo::response.data = ', response.data)
      return response.data
    }
    throw new Error('Failed to get details')
  } catch (err) {
    console.error(err)
    throw err
  }
}

/**
 * Get account profile
 * @param {string} id
 * @return AppBskyActorProfile.Record
 */
export const getProfile = async (
  id: string
): Promise<AppBskyActorProfile.Record> => {
  const profile = await getRecord('app.bsky.actor.profile', id, 'self')
  if (isDev()) console.log('[Lexicons] getProfile::profile = ', profile.data)
  return profile.data as AppBskyActorProfile.Record
}

/**
 * Build avatar image URL with com.atproto.sync.getBlob
 * @param {string} serviceURL https://bsky.social
 * @param {string} did DID
 * @param {ProfileRecord} profile ProfileRecord object
 * @returns
 */
export const buildAvatarURL = (
  serviceURL: string,
  did: string,
  profile: AppBskyActorProfile.Record
) => {
  if (isDev())
    console.log('[Lexicons] buildAvatarURL::profile = ', profile?.avatar)
  return `${serviceURL}/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${profile.avatar?.ref}`
}

/**
 * Build post page URL for App
 * @param {string} urlPrefix App URL prefix
 * @param {string} uri At Uri
 * @param {string} handle? Handle
 * @returns {string}
 */
export const buildPostURL = async (
  urlPrefix: string,
  uri: string,
  handle?: string
) => {
  const aturi = parseAtUri(uri)
  //if (isDev()) console.log('[Lexicons] buildPostURL::aturi(parsed) = ', aturi)
  //if (isDev()) console.log('[Lexicons] buildPostURL::handle(param) = ', handle)
  if (handle === undefined) {
    try {
      handle = await resolveDID(aturi.did)
    } catch (er) {
      handle = aturi.did
    }
  }
  //if (isDev()) console.log('[Lexicons] buildPostURL::handle = ', handle)
  return `${urlPrefix}/profile/${handle}/post/${aturi.rkey}`
}

export default {
  isDev,
  getConfig,
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
  buildAvatarURL,
  getProfile,
  describeRepo,
  buildPostURL,
}
