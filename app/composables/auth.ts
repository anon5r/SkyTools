import type { AtpSessionEvent, AtpSessionData } from '@atproto/api'
import { BskyAgent } from '@atproto/api'
import { useState, useAppConfig } from 'nuxt/app'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { isDev } from '~/utils/helpers'

let _agent: Ref<BskyAgent | null> = ref(null)

const initLoginState = (): {
  isLoggedIn: boolean
  userEmail: string | undefined
  userDid: string | undefined
  userHandle: string | undefined
  session?: AtpSessionData
} => {
  return {
    isLoggedIn: false,
    userEmail: undefined,
    userDid: undefined,
    userHandle: undefined,
  }
}

const getAgent = async (service?: string): Promise<BskyAgent> => {
  if (!_agent.value) {
    const config = useAppConfig()
    if (!service) service = config.bskyService
    else if (service.length > 0 && !service.startsWith('https://'))
      service = `https://${service}`

    _agent.value = new BskyAgent({
      service: service,
      persistSession: (event: AtpSessionEvent, sess?: AtpSessionData) => {
        if (process.client && sess != null) {
          localStorage.setItem('credentials', JSON.stringify(sess))
          localStorage.setItem('service', service as string)
        }
      },
    })
  }
  return _agent.value
}

export { getAgent, initLoginState }

export const login = async (credentials: {
  identifier: string
  password: string
}) => {
  const agent: BskyAgent = await getAgent()
  try {
    const response = await agent.login({
      identifier: credentials.identifier,
      password: credentials.password,
    })

    if (response.success && process.client) {
      if (process.client) {
        localStorage.setItem('credentials', JSON.stringify(agent.session))
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

export const logout = async (): Promise<void> => {
  try {
    const agent = await getAgent()
    if (agent.hasSession) {
      await agent.api.com.atproto.server.deleteSession()
      agent.session = undefined
    }

    if (process.client) {
      localStorage.removeItem('credentials')
      const useLoginState = useState('loginState', initLoginState)
      useLoginState.value = initLoginState()
    }
  } catch (error) {
    console.error(error)
  }
}

export const restoreSession = async (): Promise<void> => {
  if (process.client) {
    const credentials: string | null = localStorage.getItem('credentials')
    if (credentials) {
      try {
        const session = JSON.parse(credentials)
        const agent: BskyAgent = await getAgent()
        const res = await agent.resumeSession(session)
        const useLoginState: Ref<{
          isLoggedIn: boolean
          userHandle: string | undefined
          userDid: string | undefined
          userEmail: string | undefined
          // eslint-disable-next-line no-undef
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

export const getProfile = async () => {
  const agent: BskyAgent = await getAgent()
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
  }
}
