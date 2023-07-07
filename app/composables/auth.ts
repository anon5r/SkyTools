import { ref } from 'vue'
import { useAppConfig } from 'nuxt/app'
import { BskyAgent } from '@atproto/api'
import { isDev } from '@/utils/helpers'

let agent: BskyAgent | null = null

const isLoggedIn = ref(false)

const getAgent = (): BskyAgent => {
  if (!agent) {
    const config = useAppConfig()
    agent = new BskyAgent({
      service: config.bskyService as string,
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
      isLoggedIn.value = true
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
    isLoggedIn.value = false
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
        isLoggedIn.value = res.success
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

export async function useAuth() {
  await getAgent()
  // RunAtOne
  await restoreSession()

  return {
    login,
    logout,
    isLoggedIn,
    getAgent,
    restoreSession,
  }
}
