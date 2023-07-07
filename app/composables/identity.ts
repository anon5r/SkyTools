import axios from 'axios'
import { isDev } from '@/utils/helpers'
import { resolveDID, resolveHandle } from '@/utils/lexicons'

export function useIdentity() {
  return {
    resolveDID,
    resolveHandle,
  }
}
