import { AppBskyActorProfile, AppBskyFeedPost } from '@atproto/api'
import * as lexicons from '@/utils/lexicons'
import { isDev } from '~/utils/helpers'

const cdnURL = process.env.cdnPrefix || 'https://cdn-skytools.anon5r.com/proxy'

class ClientPost {
  private _atUri: { [key: string]: string } = {}
  private _profile: AppBskyActorProfile.Record | null = null
  private _handle: string | undefined = undefined
  private _appUrl: string | null = null
  private _record: AppBskyFeedPost.Record | null = null
  private _removed: boolean = false
  private _avatarURL: string | null = null
  private _bannerURL: string | null = null

  public get atUri(): { [key: string]: string } {
    return this._atUri
  }
  public get did(): string | undefined {
    return this._atUri.did
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
  public get isRemoved(): boolean {
    return this._removed
  }
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
   */
  public static async load(
    config: any,
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

    try {
      // Load profile
      client._profile = await lexicons.loadProfile(did)

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
    } catch (err) {
      if (isDev()) console.error(err)
      console.info('No profile: ' + did)
    }

    try {
      client._record = await lexicons.getRecord(
        client._atUri.collection,
        client._atUri.did,
        client._atUri.rkey
      )
    } catch (err) {
      client._removed = true
    }

    try {
      client._appUrl = await lexicons.buildPostURL(
        config.bskyAppURL,
        atUriPost,
        client.handle
      )
    } catch (err) {
      if (isDev()) console.error(err)
    }

    return client
  }

  /**
   *
   * @param {string | null} handleOrDid
   * @param {string} postID
   * @return {string} path or URL
   */
  public static getPermanentLink = (
    handleOrDid: string | undefined,
    postID: string
  ): string => {
    if (postID) return `/profile/${handleOrDid}/post/${postID}`
    return `/profile/${handleOrDid}`
  }
}

export { ClientPost }
