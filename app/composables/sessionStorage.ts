import { ref, watchEffect } from 'vue'

export function useSessionStorage(key: string) {
  // Get initial value from sessionStorage
  const storedValue = sessionStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : null)

  // Save value to sessionStorage on change
  watchEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value.value))
  })

  return value
}
