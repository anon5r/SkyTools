import { AppBskyActorProfile, AppBskyFeedPost } from '@atproto/api'
import * as lexicons from '@/utils/lexicons'
import { App } from 'nuxt/dist/app/compat/capi'

const cdnURL = process.env.cdnPrefix || 'https://cdn-skytools.anon5r.com/proxy'

class ClientPost {
  private _atUri: { [key: string]: string } = {}
  private _profile: AppBskyActorProfile.Record | null = null
  private _handle: string | undefined = undefined
  private _avatarURL: string | null = null
  private _appUrl: string | null = null
  private _record: AppBskyFeedPost.Record | null = null
  private _removed: boolean = false

  public get atUri(): { [key: string]: string } {
    return this._atUri
  }

  public get profile(): AppBskyActorProfile.Record {
    return this._profile as AppBskyActorProfile.Record
  }
  public get handle(): string | undefined {
    return this._handle
  }
  public get avatarURL(): string | null {
    return this._avatarURL
  }
  public get appUrl(): string | null {
    return this._appUrl
  }
  public get record(): AppBskyFeedPost.Record {
    return this._record as AppBskyFeedPost.Record
  }
  public get isRemoved(): boolean {
    return this._removed
  }

  private constructor(config: any) {
    lexicons.setConfig(config)
  }

  /**
   * Get profile and avatar from DID
   * @param did string DID
   */
  protected async getProfileAndAvatar(did: string): Promise<void> {
    lexicons
      .getProfile(did)
      .then(profile => {
        console.log(profile )
        this._profile = profile
        this._avatarURL = lexicons.buildAvatarURL(cdnURL, did, this._profile)
      })
      .catch(err => {
        throw err
      })
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
      // Load avatar and profile
      await client.getProfileAndAvatar(did)
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
}

export { ClientPost }
