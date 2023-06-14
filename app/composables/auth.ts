import { ref } from 'vue'
import { useAppConfig } from 'nuxt/app'
import { BskyAgent } from '@atproto/api'

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
      }
    })
  }
  return agent
}

const login = async (credentials: { identifier: string, password: string }) => {
  try {
    const response = await getAgent().login({ identifier: credentials.identifier, password: credentials.password })

    if (response.success && process.client) {
      if (process.client)
        sessionStorage.setItem('credentials', JSON.stringify(getAgent().session))
      isLoggedIn.value = true
    }

    return response.success
  } catch (error) {
    console.error(error)
    return false
  }
}

const logout = async () => {
  try {
    if (getAgent().hasSession)
      getAgent().session = undefined

    if (process.client)
      sessionStorage.removeItem('credentials')
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
        const success = await getAgent().resumeSession(session)
        if (success) isLoggedIn.value = true
      } catch (err) {
        console.error(err)
        if (err.response.status == 400) {
          if (err.response.data.error == 'ExpiredToken')
            await logout()
        }
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
    isLoggedIn: () => isLoggedIn.value,
    getAgent,
    restoreSession
  }
}
