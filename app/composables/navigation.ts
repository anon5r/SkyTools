import { ref, onMounted } from 'vue'
import { useAppConfig } from 'nuxt/app'

interface Navigation {
  next: string | null,
  prev: string | null,
}

export function useNavigation() {
  const navigate = ref<Navigation>({ next: null, prev: null })

  
  onMounted(() => {
    const storedSession = sessionStorage.getItem('navi')
    if (storedSession) {
      navigate.value = JSON.parse(storedSession)
    }
  })
  const config = useAppConfig()

  const clear = () => {
    navigate.value = { next: null, prev: null }
    sessionStorage.removeItem('navi')
  }

  const setNext = (next: string) :void => {
    navigate.value.next = next
    sessionStorage.setItem('navi', JSON.stringify(navigate.value))
  }

  const setPrev = (prev: string) :void => {
    navigate.value.prev = prev
    sessionStorage.setItem('navi', JSON.stringify(navigate.value))
  }

  const getNext = () :string | null => { 
      return navigate?.value?.next
  }
  const getPrev = () :string | null => {
      return navigate?.value?.prev
  }


    return { navigate,
      setNext, setPrev, getNext, getPrev, clear }
    
  }
