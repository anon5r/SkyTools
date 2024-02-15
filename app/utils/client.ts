import { AppBskyActorProfile, AppBskyFeedPost } from '@atproto/api'
import * as lexicons from '@/utils/lexicons'
import { isDev } from '~/utils/helpers'
import { UnauthenticatedError } from '~/errors/UnauthenticatedError'

const cdnURL = process.env.cdnPrefix || 'https://cdn-skytools.anon5r.com/proxy'

interface AppConfig {
  [key: string]: any
}

class ClientPost {
  private _config: AppConfig = {}
  private _atUri: { [key: string]: string } = {}
  private _profile: AppBskyActorProfile.Record | null = null
  private _handle: string | undefined = undefined
  private _appUrl: string | null = null
  private _record: AppBskyFeedPost.Record | null = null
  private _cid: string | null = null
  private _removed: boolean = false
  private _hidden: boolean = false
  private _avatarURL: string | null = null
  private _bannerURL: string | null = null
  private _noUnauthenticated: boolean = false

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
  public get avatarURL(): string | null {
    return this._avatarURL
  }
  /**
   * Retrieve the banner URL for the given actor profile.
   *
   * @returns {string} The URL of the banner.
   */
  public get bannerURL(): string | null {
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
    lexicons.setConfig(config)
  }

  /**
   * Load a post from a URI
   * @param config
   * @param atUriPost at://did:plc:0x1234567890abcdef/post/0x1234567890abcdef
   * @returns ClientPost
   * @throws UnauthenticatedError
   */
  public static async load(
    config: AppConfig,
    atUriPost: string
  ): Promise<ClientPost> {
    const client = new ClientPost(config)

    client._atUri = lexicons.parseAtUri(atUriPost)
    const did = client._atUri.did

    try {
      client._handle = await lexicons.resolveDID(did, true)
    } catch (err) {
      client._handle = did
    }
    let filtered: { val: string }[] = []
    try {
      // Load profile
      client._profile = (await lexicons.loadProfile(
        did,
        false
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
        if (client._noUnauthenticated)
          throw new UnauthenticatedError('You should be logged-in to Bluesky')
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
    await ClientPost.loadPost(client, atUriPost)

    return client
  }

  public static loadProfileBlobs(client: ClientPost): void {
    // Avatar
    client._avatarURL = lexicons.buildBlobRefURL(
      cdnURL,
      client.atUri.did,
      client.profile as AppBskyActorProfile.Record,
      'avatar'
    )

    // Banner
    client._bannerURL = lexicons.buildBlobRefURL(
      cdnURL,
      client.atUri.did,
      client.profile as AppBskyActorProfile.Record,
      'banner'
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
      if (atUriPost) client._atUri = lexicons.parseAtUri(atUriPost)

      const record = await lexicons.getRecord(
        client._atUri.collection,
        client._atUri.did,
        client._atUri.rkey
      )
      client._cid = record.data.cid as string
      client._record = record.data.value as AppBskyFeedPost.Record
    } catch (err) {
      client._removed = true
    }

    try {
      client._appUrl = await lexicons.buildPostURL(
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
