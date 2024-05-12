import type { AtpSessionData, AtpSessionEvent } from '@atproto/api'
import { BskyAgent } from '@atproto/api'
import type { Ref } from '#imports'
import { useAppConfig, useState, ref, ClientPost, isDev } from '#imports'

declare interface LoginState {
  isLoggedIn: boolean
  userHandle: string | undefined
  userDid: string | undefined
  userEmail: string | undefined
  session?: AtpSessionData | undefined
}

// let _agent: Ref<{ [key: string]: BskyAgent }> = ref({})
let _agent: Ref<Record<string, BskyAgent>> = ref({})

const keyCredentials = 'credentials'
const keyService = 'service'

const initLoginState = (): LoginState => {
  return {
    isLoggedIn: false,
    userEmail: undefined,
    userDid: undefined,
    userHandle: undefined,
  }
}

const getAgent = async (pdsEntrypoint?: string): Promise<BskyAgent> => {
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
    const agent = new BskyAgent({
      service: pdsEntrypoint,
      persistSession: (event: AtpSessionEvent, sess?: AtpSessionData) => {
        if (process.client && sess != null) {
          localStorage.setItem(keyCredentials, JSON.stringify(sess))
          localStorage.setItem(keyService, pdsEntrypoint as string)
          ClientPost.setViewerLoggedIn(true)
        }
      },
    })
    if (agent && agent.hasSession) {
      const blockedResponse = await agent.api.app.bsky.graph.getBlocks({
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
  return _agent.value[pdsEntrypoint]
}

export { getAgent, initLoginState }

export const login = async (credentials: {
  identifier: string
  password: string
  pds?: string
}) => {
  const agent: BskyAgent = await getAgent(credentials.pds)
  if (!agent) throw new Error('Could not get agent')
  try {
    const response = await agent.login({
      identifier: credentials.identifier,
      password: credentials.password,
    })

    if (response.success && process.client) {
      if (process.client) {
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

export const logout = async (pdsEntrypoint?: string): Promise<void> => {
  try {
    const agent = await getAgent(pdsEntrypoint)
    if (agent.hasSession) {
      await agent.api.com.atproto.server.deleteSession()
      agent.session = undefined
      ClientPost.setViewerLoggedIn(false)
      ClientPost.setViewerBlockedList([])
    }
  } catch (error) {
    console.error(error)
  }
  if (process.client) {
    localStorage.removeItem(keyCredentials)
    const useLoginState = useState('loginState', initLoginState)
    useLoginState.value = initLoginState()
  }
}

export const restoreSession = async (pdsEntrypoint?: string): Promise<void> => {
  if (process.client) {
    const credentials: string | null = localStorage.getItem(keyCredentials)
    if (credentials) {
      try {
        const session = JSON.parse(credentials)
        const agent: BskyAgent = await getAgent(pdsEntrypoint)
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
  const agent: BskyAgent = await getAgent(pdsUri)
  if (!agent) throw new Error('Require authentication')

  const result = await agent.api.app.bsky.actor.getProfile({
    actor: agent.session?.did as string,
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
    getHandle,
    getDid,
    getEmail,
    getProfile,
    initLoginState,
  }
}
