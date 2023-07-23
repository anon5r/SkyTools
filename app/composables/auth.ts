import { ref } from 'vue'
import { useAppConfig } from 'nuxt/app'
import { BskyAgent } from '@atproto/api'
import { isDev } from '@/utils/helpers'

let agent: BskyAgent | null = null

let _isLoggedIn = false

const getAgent = (service?: string): BskyAgent => {
  if (!agent) {
    const config = useAppConfig()
    if (!service) service = config.bskyService
    else if (service.length > 0 && !service.startsWith('https://'))
      service = `https://${service}`

    agent = new BskyAgent({
      service: service,
      persistSession: (_, sess) => {
        if (process.client && sess != null)
          sessionStorage.setItem('credentials', JSON.stringify(sess))
      },
    })
  }
  return agent
}

const login = async (credentials: { identifier: string; password: string }) => {
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

const logout = async () => {
  try {
    if (getAgent().hasSession) getAgent().session = undefined

    if (process.client) sessionStorage.removeItem('credentials')
    _isLoggedIn = false
  } catch (error) {
    console.error(error)
  }
}

const restoreSession = async () => {
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
const isLoggedIn = () => {
  return _isLoggedIn
}

const setAsLogqedIn = (value: boolean) => {
  _isLoggedIn = value
}

/**
 *
 * @returns {string} the handle of the logged in user
 */
const getHandle = () => {
  return getAgent().session?.handle ?? ''
}

export async function useAuth(service?: string) {
  const agent = getAgent(service)
  // RunAtOne
  await restoreSession()

  return {
    login,
    logout,
    isLoggedIn,
    getAgent,
    restoreSession,
    getHandle,
  }
}
