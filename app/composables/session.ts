import { ref, onMounted } from 'vue'
import { AtpAgent, AtpSessionEvent, AtpSessionData, AtpPersistSessionHandler } from '@atproto/api'
import { useAppConfig } from 'nuxt/app'

interface Session {
  accessJwt: string,
  refreshJwt: string,
  handle: string,
  did: string
}

export function useSession() {
  const isAuthenticated = ref(false)
  const session = ref<Session | null>(null)
  const agent = ref<AtpAgent | null>(null)

  
  // Watch for changes to `session.value`
  watchEffect(() => {
    isAuthenticated.value = session.value !== null;
  })

  onMounted(() => {
  })

  const config = useAppConfig()

  const getAgent = () : AtpAgent => {
    if (agent?.value === null || agent?.value instanceof AtpAgent === false){
      agent.value = new AtpAgent({
        service: config.bskyService as string,
        persistSession: (_, sess) => {
          if (sess != null)
            sessionStorage.setItem('session', JSON.stringify(sess))
        }
      })
    }
    
    return agent.value as AtpAgent
  }
  

  const login = async (credentials: { identifier: string, password: string}) => {
    const agent = getAgent()
    const { success, data } = await agent.login({identifier: credentials.identifier, password: credentials.password})
    isAuthenticated.value = success

    if (success) {
      session.value = {
        accessJwt: data.accessJwt,
        refreshJwt: data.refreshJwt,
        handle: data.handle,
        did: data.did
      }
      // Save the session data in the sessionStorage
      sessionStorage.setItem('session', JSON.stringify(session.value))
    } else {
      throw new Error('Login failed')
    }
  }

  const logout = () => {
    session.value = null;
    sessionStorage.removeItem('session');
  }

  const restore = async () => {
    const storedSession = sessionStorage.getItem('session')
    if (storedSession) {
      session.value = JSON.parse(storedSession)
      const { success } = await agent.resumeSession(session.value)
      isAuthenticated.value = success
    }
  }
  
  return { session, agent, isAuthenticated,
    login, logout, getAgent, restore
  }
}
