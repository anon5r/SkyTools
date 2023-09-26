import { ref, Ref } from 'vue'
import { useAppConfig, useState } from 'nuxt/app'
import AtpAgent, {
  BskyAgent,
  AtpSessionData,
  AppBskyActorGetProfile,
} from '@atproto/api'
import { isDev } from '@/utils/helpers'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'

const _agent: Ref<BskyAgent | null> = ref(null)

let _isLoggedIn = false

let _session: AtpSessionData | undefined = undefined

export const getAgent = (service?: string): BskyAgent => {
  if (!_agent.value) {
    const config = useAppConfig()
    if (!service) service = config.bskyService
    else if (service.length > 0 && !service.startsWith('https://'))
      service = `https://${service}`

    _agent.value = new BskyAgent({
      service: service,
      persistSession: (_, sess) => {
        if (process.client && sess != null) {
          localStorage.setItem('credentials', JSON.stringify(sess))
          localStorage.setItem('service', service as string)
          _session = sess
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
}) => {
  try {
    const response = await getAgent().login({
      identifier: credentials.identifier,
      password: credentials.password,
    })

    if (response.success && process.client) {
      if (process.client) {
        localStorage.setItem('credentials', JSON.stringify(getAgent().session))
        _isLoggedIn = true
        const useLoginState = useState('loginState', initLoginState)
        console.log(useLoginState.value)
        useLoginState.value = {
          isLoggedIn: true,
          userHandle: getAgent().session?.handle ?? undefined,
          userDid: getAgent().session?.did ?? undefined,
          userEmail: getAgent().session?.email ?? undefined,
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
    if (getAgent().hasSession) {
      await getAgent().api.com.atproto.server.deleteSession()
      getAgent().session = undefined
    }

    if (process.client) {
      localStorage.removeItem('credentials')
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
    const credentials = localStorage.getItem('credentials')
    if (credentials) {
      try {
        const session = JSON.parse(credentials)
        const res = await getAgent().resumeSession(session)
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

export const getProfile = async (): Promise<ProfileViewDetailed> => {
  if (!getAgent()) throw new Error('Require authentication')

  try {
    const result = await getAgent().api.app.bsky.actor.getProfile({
      actor: getAgent().session?.did as string,
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
