import { AppBskyActorProfile, AppBskyFeedPost } from '@atproto/api'
import * as lexicons from '@/utils/lexicons'

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

  public get profile(): AppBskyActorProfile.Record | null {
    return this._profile
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
  public get record(): AppBskyFeedPost.Record | null {
    return this._record
  }
  public get isRemoved(): boolean {
    return this._removed
  }

  private constructor(config: any) {
    lexicons.setConfig(config)
  }

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
      client._record = await lexicons.getRecord(
        client._atUri.collection,
        client._atUri.did,
        client._atUri.rkey
      )
    } catch (err) {
      client._removed = true
    }

    lexicons.getProfile(did).then((profile: AppBskyActorProfile.Record) => {
      client._profile = profile
      client._avatarURL = lexicons.buildAvatarURL(
        cdnURL,
        did,
        (profile as any).value // AppBskyActorProfile.Record.value does not defined `value` property...
      )
    })

    client._appUrl = await lexicons.buildPostURL(
      config.bskyAppURL,
      atUriPost,
      client.handle
    )
    return client
  }
}

export { ClientPost }
