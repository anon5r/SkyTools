import { ref, watchEffect } from '#imports'

export function useLocalStorage(key: string) {
  // Get initial value from localStorage
  const storedValue = localStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : null)

  // Save value to localStorage on change
  watchEffect(() => {
    localStorage.setItem(key, JSON.stringify(value.value))
  })

  return value
}
