import type { AtpSessionData, AtpSessionEvent } from '@atproto/api'
import { Agent, AtpAgent } from '@atproto/api'
import { getPDSEndpointByDID, resolveHandle } from '~/utils/bskyutils'
import { BrowserOAuthClient } from '@atproto/oauth-client-browser'
import type { Ref } from '#imports'
import { ClientPost, isDev, ref, useAppConfig, useState } from '#imports'

declare interface LoginState {
  isLoggedIn: boolean
  userHandle: string | undefined
  userDid: string | undefined
  userEmail: string | undefined
  session?: AtpSessionData | undefined
}

// let _agent: Ref<{ [key: string]: BskyAgent }> = ref({})
const _agent: Ref<Record<string, AtpAgent | Agent>> = ref({})
let _oauthClient: BrowserOAuthClient | undefined

const keyCredentials = 'credentials'
const keyService = 'service'

const getOAuthClient = async () => {
  if (_oauthClient) return _oauthClient

  const config = useAppConfig()
  const url = import.meta.client ? window.location.origin : config.prodURLPrefix

  if (import.meta.client && window.location.hostname === 'localhost') {
    // OAuth providers typically reject 'localhost' as a redirect URI.
    // We automatically redirect to 127.0.0.1, which is usually allowed.
    // If this redirect fails for any reason, please open the app at
    // http://127.0.0.1:3000 directly to avoid this redirection.
    window.location.hostname = '127.0.0.1'
    await new Promise(() => {}) // Halt until browser completes navigation
  }

  const redirectUri = `${url}/auth/oauth/callback`
  const scope = 'atproto transition:generic'
  const clientId = isDev()
    ? `http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
    : `${config.prodURLPrefix}/client-metadata.json`

  _oauthClient = new BrowserOAuthClient({
    clientMetadata: {
      client_id: clientId,
      client_name: 'SkyTools',
      client_uri: config.prodURLPrefix as string,
      redirect_uris: [redirectUri],
      scope: scope,
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      application_type: isDev() ? 'native' : 'web',
      token_endpoint_auth_method: 'none',
      dpop_bound_access_tokens: true,
    },
    handleResolver: 'https://bsky.social', // Default resolver
  })

  return _oauthClient
}

const initLoginState = (): LoginState => {
  return {
    isLoggedIn: false,
    userEmail: undefined,
    userDid: undefined,
    userHandle: undefined,
  }
}

const getAgent = async (pdsEntrypoint?: string): Promise<AtpAgent | Agent> => {
  if (
    pdsEntrypoint &&
    pdsEntrypoint.length > 0 &&
    !pdsEntrypoint.startsWith('https://')
  )
    pdsEntrypoint = `https://${pdsEntrypoint}`
  if (!pdsEntrypoint) {
    const config = useAppConfig()
    pdsEntrypoint = config.defaultPDSEntrypoint
  }
  console.log(_agent.value, pdsEntrypoint)
  if (!_agent.value[pdsEntrypoint]) {
    const agent = new AtpAgent({
      service: pdsEntrypoint,
      persistSession: (event: AtpSessionEvent, sess?: AtpSessionData) => {
        if (import.meta.client && sess != null) {
          localStorage.setItem(keyCredentials, JSON.stringify(sess))
          localStorage.setItem(keyService, pdsEntrypoint as string)
          ClientPost.setViewerLoggedIn(true)
        }
      },
    })
    if (agent && agent.hasSession) {
      const blockedResponse = await agent.app.bsky.graph.getBlocks({
        limit: 1000,
      })
      const blocks = blockedResponse.success
        ? blockedResponse.data.blocks.map(prof => prof.did)
        : []
      ClientPost.setViewerBlockedList(blocks)
    }
    _agent.value[pdsEntrypoint] = agent
  }
  if (!_agent.value[pdsEntrypoint]) throw new Error('Could not get agent')
  return _agent.value[pdsEntrypoint] as AtpAgent | Agent
}

export { getAgent, initLoginState }

export const login = async (credentials: {
  identifier: string
  password?: string
  pds?: string
}) => {
  if (!credentials.password) {
    // OAuth Login
    const client = await getOAuthClient()

    // Resolve PDS from identifier (handle or DID)
    let pds = credentials.pds
    if (!pds) {
      try {
        const did = credentials.identifier.startsWith('did:')
          ? credentials.identifier
          : await resolveHandle(credentials.identifier)
        pds = await getPDSEndpointByDID(did)
      } catch (e) {
        console.error('Failed to resolve PDS', e)
        // Fallback to default or let client handle it
      }
    }

    await client.signIn(credentials.identifier, {
      // @ts-expect-error: login_hint is internally handled but explicitly requested
      login_hint: credentials.identifier,
    })
    return true
  }

  const agent = (await getAgent(credentials.pds)) as AtpAgent
  if (!agent) throw new Error('Could not get agent')
  try {
    const response = await agent.login({
      identifier: credentials.identifier,
      password: credentials.password,
    })

    if (response.success && import.meta.client) {
      if (import.meta.client) {
        localStorage.setItem(keyCredentials, JSON.stringify(agent.session))
        const useLoginState = useState('loginState', initLoginState)
        useLoginState.value = {
          isLoggedIn: true,
          userHandle: agent.session?.handle ?? undefined,
          userDid: agent.session?.did ?? undefined,
          userEmail: agent.session?.email ?? undefined,
        }
      }
    }

    return response.success
  } catch (error) {
    if (isDev()) console.error(error)
    throw error
  }
}

/**
 * Shared helper: register an OAuth session agent and update login state.
 */
const _applyOAuthSession = async (session: { did: string }): Promise<Agent> => {
  const agent = new Agent(session as any)
  const config = useAppConfig()
  const pdsEntrypoint = config.defaultPDSEntrypoint || 'https://bsky.social'
  _agent.value[pdsEntrypoint] = agent

  const useLoginState = useState('loginState', initLoginState)
  useLoginState.value = {
    isLoggedIn: true,
    userHandle: session.did,
    userDid: session.did,
    userEmail: undefined,
  }

  // Try to resolve the human-readable handle from the profile
  try {
    const profile = await agent.getProfile({ actor: session.did })
    useLoginState.value.userHandle = profile.data.handle
  } catch (e) {
    if (isDev()) console.error('Failed to get profile after OAuth', e)
  }

  ClientPost.setViewerLoggedIn(true)
  return agent
}

export const finalizeOAuth = async () => {
  if (!import.meta.client) return false
  const client = await getOAuthClient()
  const initResult = await client.init()
  const session = initResult ? initResult.session : null

  if (session) {
    await _applyOAuthSession(session)
    return true
  }
  return false
}

export const logout = async (pdsEntrypoint?: string): Promise<void> => {
  try {
    const agent = await getAgent(pdsEntrypoint)
    const actorDid = 'session' in agent ? agent.session?.did : agent.assertDid
    if ('hasSession' in agent ? agent.hasSession : !!agent.did) {
      if (import.meta.client && actorDid) {
        try {
          const client = await getOAuthClient()
          await client.revoke(actorDid)
        } catch (e) {
          console.error('Failed to revoke OAuth session', e)
        }
      }
      if ('com' in agent && agent.com.atproto.server.deleteSession) {
        try {
          await agent.com.atproto.server.deleteSession()
        } catch (e) {
          // Might error for OAuth, which is fine as revoke() handles OAuth sessions
        }
      }
      ClientPost.setViewerLoggedIn(false)
      ClientPost.setViewerBlockedList([])
    }
  } catch (error) {
    console.error(error)
  }
  if (import.meta.client) {
    localStorage.removeItem(keyCredentials)
    const useLoginState = useState('loginState', initLoginState)
    useLoginState.value = initLoginState()
  }
}

export const restoreSession = async (pdsEntrypoint?: string): Promise<void> => {
  if (import.meta.client) {
    const client = await getOAuthClient()
    const initResult = await client.init()
    const session = initResult ? initResult.session : null

    if (session) {
      await _applyOAuthSession(session)
      return
    }

    const credentials: string | null = localStorage.getItem(keyCredentials)
    if (credentials) {
      try {
        const session = JSON.parse(credentials)
        const agent = (await getAgent(pdsEntrypoint)) as AtpAgent
        const res = await agent.resumeSession(session)
        const useLoginState = useState('loginState', initLoginState)
        useLoginState.value = {
          isLoggedIn: res.success,
          userHandle: res.data.handle ?? undefined,
          userDid: res.data.did ?? undefined,
          userEmail: res.data.email ?? undefined,
        }
      } catch (err: any) {
        if (isDev()) console.error(err)
        if (err.response?.status == 400) {
          if (err.response.data.error == 'ExpiredToken') await logout()
        }
        throw err
      }
    }
  }
}

/**
 * @returns {boolean} true if the user is logged in
 */
export const isLoggedIn = (): boolean => {
  const useLoginState = useState('loginState', initLoginState)
  return useLoginState.value?.isLoggedIn
}

/**
 *
 * @returns {string} the handle of the logged-in user
 */
export const getHandle = (): string => {
  const useLoginState = useState('loginState', initLoginState)
  return useLoginState.value.session?.handle ?? ''
}

export const getDid = (): string => {
  const useLoginState = useState('loginState', initLoginState)
  return useLoginState.value.session?.did ?? ''
}

export const getEmail = (): string => {
  const useLoginState = useState('loginState', initLoginState)
  return useLoginState.value.session?.email ?? ''
}

export const getProfile = async (pdsUri?: string) => {
  const agent = await getAgent(pdsUri)
  if (!agent) throw new Error('Require authentication')

  const actorDid = 'session' in agent ? agent.session?.did : agent.assertDid
  const result = await agent.app.bsky.actor.getProfile({
    actor: actorDid as string,
  })

  if (!result.success) throw new Error('Could not get profile')

  return result.data
}

export function useAuth() {
  return {
    login,
    logout,
    isLoggedIn,
    getAgent,
    restoreSession,
    finalizeOAuth,
    getHandle,
    getDid,
    getEmail,
    getProfile,
    initLoginState,
  }
}
