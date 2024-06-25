import { AppBskyActorProfile, AppBskyFeedPost } from '@atproto/api'
import * as bskyutils from '~/utils/bskyutils'
import { isDev } from '~/utils/helpers'
import { UnauthenticatedError, BlockedError } from '~/errors/BskyErrors'

const cdnURL = process.env.cdnPrefix || 'https://cdn-skytools.anon5r.com/proxy'

interface AppConfig {
  [key: string]: any
}

class ClientPost {
  private _config: AppConfig = {}
  private _atUri: { [key: string]: string } = {}
  private _endpoint: string | undefined = undefined
  private _profile: AppBskyActorProfile.Record | null = null
  private _handle: string | undefined = undefined
  private _appUrl: string | null = null
  private _record: AppBskyFeedPost.Record | AppBskyActorProfile.Record | null =
    null
  private _cid: string | null = null
  private _removed: boolean = false
  private _hidden: boolean = false
  private _avatarURL: string | undefined = undefined
  private _bannerURL: string | undefined
  private _noUnauthenticated: boolean = false
  /** Static authenticated variables */
  private static _viewer_loggedIn: boolean = false
  private static _viewer_blockList: string[] = []

  public static setViewerLoggedIn(value: boolean): void {
    ClientPost._viewer_loggedIn = value
  }
  public static setViewerBlockedList(list: string[]): void {
    ClientPost._viewer_blockList = list
  }
  public static getViewerLoggedIn(): boolean {
    return ClientPost._viewer_loggedIn
  }
  public static getViewerBlockedList(): string[] {
    return ClientPost._viewer_blockList
  }

  public get atUri(): { [key: string]: string } {
    return this._atUri
  }
  public get did(): string | undefined {
    return this._atUri.did
  }
  public get cid(): string | null {
    return this._cid
  }
  public get profile(): AppBskyActorProfile.Record {
    return this._profile as AppBskyActorProfile.Record
  }
  /**
   * Returns the handle value.
   * @return {string | undefined} The handle value.
   */
  public get handle(): string | undefined {
    return this._handle
  }
  /**
   * Returns the URL of the blob for the user.
   * The URL is constructed using the CDN URL, user's DID, user's profile, and 'avatar' as the blob reference.
   *
   * @returns The URL of the avatar.
   */
  public get avatarURL(): string | undefined {
    return this._avatarURL
  }
  /**
   * Retrieve the banner URL for the given actor profile.
   *
   * @returns {string} The URL of the banner.
   */
  public get bannerURL(): string | undefined {
    return this._bannerURL
  }

  /**
   * Retrieves the application URL.
   * @return {string | null} The application URL, or null if it is not set.
   */
  public get appUrl(): string | null {
    return this._appUrl
  }
  public get record(): AppBskyFeedPost.Record {
    return this._record as AppBskyFeedPost.Record
  }

  public get endpoint(): string | undefined {
    return this._endpoint
  }

  /**
   * Returns the removed value.
   */
  public get isRemoved(): boolean {
    return this._removed
  }

  /**
   * Returns the hidden value.
   */
  public get isHidden(): boolean {
    return this._hidden
  }

  /**
   * Returns the permanent URL value.
   */
  public permaURL(): string {
    return ClientPost.getPermanentLink(this.handle, this.atUri.rkey)
  }

  private constructor(config: any) {
    bskyutils.setConfig(config)
  }

  /**
   * Load a post from a URI
   * @param config
   * @param {string} atUriPost at://did:plc:0x1234567890abcdef/post/0x1234567890abcdef
   * @param {string?} pdsEndpoint PDS endpoint https://bsky.social
   * @returns ClientPost
   * @throws UnauthenticatedError
   */
  public static async load(
    config: AppConfig,
    atUriPost: string,
    pdsEndpoint?: string
  ): Promise<ClientPost> {
    const client = new ClientPost(config)
    if (pdsEndpoint) client._endpoint = pdsEndpoint

    client._atUri = bskyutils.parseAtUri(atUriPost)
    const did = client._atUri.actor

    try {
      if (client._endpoint === undefined)
        client._endpoint = await bskyutils.getPDSEndpointByDID(did)
      client._handle = await bskyutils.resolveDID(did, true)
    } catch (err) {
      client._handle = did
    }
    let filtered: { val: string }[] = []
    try {
      // Load profile
      client._profile = (await bskyutils.loadProfile(
        client._endpoint ?? config.defaultPDSEntrypoint,
        did
      )) as AppBskyActorProfile.Record
      if (
        client._profile.labels &&
        client._profile.labels.$type === 'com.atproto.label.defs#selfLabels'
      ) {
        filtered = (client._profile.labels.values as [{ val: string }]).filter(
          v => {
            return v.val === '!no-unauthenticated'
          }
        )
        // No authenticated
        client._noUnauthenticated = filtered.length > 0
        if (client._noUnauthenticated && !ClientPost._viewer_loggedIn)
          throw new UnauthenticatedError('You should be logged-in to Bluesky')
        if (ClientPost._viewer_blockList.includes(did))
          throw new BlockedError('Blocked user')
      }

      ClientPost.loadProfileBlobs(client)
    } catch (err) {
      if (isDev()) console.error(err)
      if (err instanceof UnauthenticatedError) {
        client._hidden = true
        return client
      }
      console.info('No profile: ' + did)
    }

    if (client._atUri.collection === 'app.bsky.feed.post') {
      // Load post
      await ClientPost.loadPost(client, atUriPost)
    }

    return client
  }

  public static loadProfileBlobs(client: ClientPost): void {
    // Avatar
    client._avatarURL = bskyutils.buildBlobRefURL(
      cdnURL,
      client.atUri.did,
      client.profile as AppBskyActorProfile.Record,
      'avatar',
      client._endpoint
    )

    // Banner
    client._bannerURL = bskyutils.buildBlobRefURL(
      cdnURL,
      client.atUri.did,
      client.profile as AppBskyActorProfile.Record,
      'banner',
      client._endpoint
    )
  }

  /**
   * Load a post from a URI
   * @param client
   * @param atUriPost at://did:plc:0x1234567890abcdef/post/0x1234567890abcdef
   */
  public static async loadPost(
    client: ClientPost,
    atUriPost?: string
  ): Promise<void> {
    try {
      if (atUriPost) client._atUri = bskyutils.parseAtUri(atUriPost)

      const record = await bskyutils.getRecord(
        client._endpoint ?? client._config.defaultPDSEntrypoint,
        client._atUri.collection,
        client._atUri.actor,
        client._atUri.rkey
      )
      client._cid = record.data.cid as string
      client._record = record.data.value as AppBskyFeedPost.Record
    } catch (err) {
      client._removed = true
    }

    try {
      client._appUrl = await bskyutils.buildPostURL(
        client._config.bskyAppURL,
        client._atUri,
        client.handle
      )
    } catch (err) {
      if (isDev()) console.error(err)
    }
  }

  /**
   *
   * @param {string | null} handleOrDid
   * @param {string} postID
   * @return {string} path or URL
   */
  public static getPermanentLink = (
    handleOrDid: string | undefined,
    postID?: string
  ): string => {
    if (postID) return `/profile/${handleOrDid}/post/${postID}`
    return `/profile/${handleOrDid}`
  }
}

export { ClientPost }
