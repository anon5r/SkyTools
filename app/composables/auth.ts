import type { Ref } from 'vue'
import { ref } from 'vue'
import { useAppConfig, useState } from 'nuxt/app'
import type { AtpSessionData } from '@atproto/api'
import { BskyAgent } from '@atproto/api'
import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { isDev } from '@/utils/helpers'

const _agent: Ref<BskyAgent | null> = ref(null)

const credentialKey = 'credentials'

let _isLoggedIn = false

export const getAgent = (service?: string | undefined): BskyAgent => {
  if (!_agent.value) {
    if (!service) {
      const config = useAppConfig()
      service = config.defaultPDS as string
    }
    console.log('service: ', service)
    _agent.value = new BskyAgent({
      service: `https://${service}`,
      persistSession: (_, sess) => {
        if (process.client && sess != null) {
          const session = JSON.stringify(sess)
          localStorage.setItem(credentialKey, session)
          localStorage.setItem('service', service as string)
        }
      },
    })
  }
  return _agent.value
}

const initLoginState = (): {
  isLoggedIn: boolean
  userEmail: string | undefined
  userDid: string | undefined
  userHandle: string | undefined
} => {
  return {
    isLoggedIn: false,
    userEmail: undefined,
    userDid: undefined,
    userHandle: undefined,
  }
}

export const login = async (credentials: {
  identifier: string
  password: string
  pds: string
}) => {
  try {
    const config = useAppConfig()
    const agent = getAgent(credentials.pds ?? config.defaultPDS)
    const response = await agent.login({
      identifier: credentials.identifier,
      password: credentials.password,
    })

    if (response.success && process.client) {
      if (process.client) {
        localStorage.setItem('service', credentials.pds ?? config.defaultPDS)
        localStorage.setItem(credentialKey, JSON.stringify(agent.session))
        _isLoggedIn = true
        const useLoginState = useState('loginState', initLoginState)
        console.log(useLoginState.value)
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

export const logout = async () => {
  try {
    const agent = getAgent()
    if (agent.hasSession) {
      await agent.api.com.atproto.server.deleteSession()
      agent.session = undefined
    }

    if (process.client) {
      localStorage.removeItem(credentialKey)
      const useLoginState = useState('loginState', initLoginState)
      useLoginState.value = initLoginState()
    }
    _isLoggedIn = false
  } catch (error) {
    console.error(error)
  }
}

export const restoreSession = async () => {
  if (process.client) {
    const credentials = localStorage.getItem(credentialKey)
    if (credentials) {
      try {
        const session = JSON.parse(credentials)
        const config = useAppConfig()
        const pds = localStorage.getItem('service') ?? config.defaultPDS
        const res = await getAgent(pds).resumeSession(session)
        _isLoggedIn = res.success
        const useLoginState: Ref<{
          isLoggedIn: boolean
          userHandle: string | undefined
          userDid: string | undefined
          userEmail: string | undefined
        }> = useState('loginState', initLoginState)
        useLoginState.value = {
          isLoggedIn: res.success,
          userHandle: res.data.handle ?? undefined,
          userDid: res.data.did ?? undefined,
          userEmail: res.data.email ?? undefined,
        }
      } catch (err: any) {
        if (isDev()) console.error(err)
        if (err.response.status == 400) {
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
  return useLoginState.value.isLoggedIn
}

/**
 *
 * @returns {string} the handle of the logged in user
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

export const getProfile = async (
  pds?: string
): Promise<ProfileViewDetailed> => {
  pds = pds ?? useAppConfig().defaultPDS
  if (!getAgent(pds)) throw new Error('Require authentication')

  try {
    const agent = getAgent(pds)
    const result = await agent.api.app.bsky.actor.getProfile({
      actor: agent.session?.did as string,
    })

    if (!result.success) throw new Error('Could not get profile')

    return result.data
  } catch (err) {
    throw err
  }
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
  }
}
