import { ref } from 'vue'
import { useAppConfig } from 'nuxt/app'
import { BskyAgent, AtpSessionData, AppBskyActorGetProfile } from '@atproto/api'
import { isDev } from '@/utils/helpers'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'

let _agent: BskyAgent | null = null

let _isLoggedIn = false

let _session: AtpSessionData | undefined = undefined

export const getAgent = (service?: string): BskyAgent => {
  if (!_agent) {
    const config = useAppConfig()
    if (!service) service = config.bskyService
    else if (service.length > 0 && !service.startsWith('https://'))
      service = `https://${service}`

    _agent = new BskyAgent({
      service: service,
      persistSession: (_, sess) => {
        if (process.client && sess != null) {
          sessionStorage.setItem('credentials', JSON.stringify(sess))
          sessionStorage.setItem('service', service as string)
          _session = sess
        }
      },
    })
  }
  return _agent
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
      if (process.client)
        sessionStorage.setItem(
          'credentials',
          JSON.stringify(getAgent().session)
        )
      _isLoggedIn = true
    }

    return response.success
  } catch (error) {
    if (isDev()) console.error(error)
    throw error
  }
}

export const logout = async () => {
  try {
    if (getAgent().hasSession) getAgent().session = undefined

    if (process.client) sessionStorage.removeItem('credentials')
    _isLoggedIn = false
  } catch (error) {
    console.error(error)
  }
}

export const restoreSession = async () => {
  if (process.client) {
    const credentials = sessionStorage.getItem('credentials')
    if (credentials) {
      try {
        const session = JSON.parse(credentials)
        const res = await getAgent().resumeSession(session)
        _isLoggedIn = res.success
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
  return _isLoggedIn
}

/**
 *
 * @returns {string} the handle of the logged in user
 */
export const getHandle = (): string => {
  return getAgent().session?.handle ?? ''
}

export const getDid = (): string => {
  return getAgent().session?.did ?? ''
}

export const getEmail = (): string => {
  return getAgent().session?.email ?? ''
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

export function useAuth(service?: string) {
  _agent = getAgent(service)

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
