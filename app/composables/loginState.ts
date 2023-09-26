import { useState } from 'nuxt/app'

export const initLoginState = (): {
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

export const useLoginState = useState('loginState', initLoginState)

export default {
  useLoginState,
}
