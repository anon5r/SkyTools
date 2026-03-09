import { onMounted, ref, useAppConfig, useRouter } from '#imports'

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

  const isValidLocalPath = (path: string | null | undefined): boolean => {
    if (!path) return false
    return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\')
  }

  const goNext = (): void => {
    try {
      if (isValidLocalPath(getNext()))
        router.push({ path: getNext() ?? undefined })
      else router.push({ name: getNext() ?? 'index' })
    } catch (err) {
      goHome()
    }
  }

  const goPrev = (): void => {
    try {
      if (isValidLocalPath(getPrev()))
        router.push({ path: getPrev() ?? undefined })
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
