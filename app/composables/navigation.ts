import { onMounted, ref } from 'vue'
import { useAppConfig, useRouter } from 'nuxt/app'

interface Navigation {
  next: string | null
  prev: string | null
}

export function useNavigation() {
  const config = useAppConfig()
  const router = useRouter()

  // to navigate page after processing
  const navigate = ref<Navigation>({ next: null, prev: null })

  onMounted(() => {
    const storedSession = localStorage.getItem('navi')
    if (storedSession) {
      navigate.value = JSON.parse(storedSession)
    }
  })

  const clear = () => {
    navigate.value = { next: null, prev: null }
    localStorage.removeItem('navi')
  }

  const setNext = (next: string): void => {
    navigate.value.next = next
    localStorage.setItem('navi', JSON.stringify(navigate.value))
  }

  const setPrev = (prev: string): void => {
    navigate.value.prev = prev
    localStorage.setItem('navi', JSON.stringify(navigate.value))
  }

  const getNext = (): string | null => {
    return navigate?.value?.next
  }
  const getPrev = (): string | null => {
    return navigate?.value?.prev
  }

  const goNext = (): void => {
    try {
      if (getNext()?.startsWith('/')) router.push({ path: getNext() })
      else router.push({ name: getNext() ?? 'index' })
    } catch (err) {
      goHome()
    }
  }

  const goPrev = (): void => {
    try {
      if (getPrev()?.startsWith('/')) router.push({ path: getPrev() })
      router.push({ name: getPrev() ?? 'index' })
    } catch (err) {
      goHome()
    }
  }

  const goHome = (): void => {
    router.push({ path: '/' })
  }

  return {
    navigate,
    setNext,
    setPrev,
    getNext,
    getPrev,
    clear,
    goNext,
    goPrev,
    goHome,
  }
}
