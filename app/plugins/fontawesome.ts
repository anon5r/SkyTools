import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'

async function loadIcons() {
  // Try to use Pro version if available, fallback to Free version
  try {
    // Try FontAwesome Kit (Pro)
    const kit = await import('@awesome.me/kit-e7e521035c/icons')
    console.log('✓ Using FontAwesome Pro (Kit)')
    return {
      far: kit.far,
      fas: kit.fas,
      fal: kit.fal,
      fat: kit.fat
    }
  } catch {
    try {
      // Try individual Pro packages
      const [proRegular, proSolid, proLight, proThin] = await Promise.all([
        import('@fortawesome/pro-regular-svg-icons'),
        import('@fortawesome/pro-solid-svg-icons'),
        import('@fortawesome/pro-light-svg-icons'),
        import('@fortawesome/pro-thin-svg-icons')
      ])
      console.log('✓ Using FontAwesome Pro (Packages)')
      return {
        far: proRegular.far,
        fas: proSolid.fas,
        fal: proLight.fal,
        fat: proThin.fat
      }
    } catch {
      // Fallback to Free version
      const [freeRegular, freeSolid] = await Promise.all([
        import('@fortawesome/free-regular-svg-icons'),
        import('@fortawesome/free-solid-svg-icons')
      ])
      console.log('⚠️  Using FontAwesome Free (Pro not available)')
      return {
        far: freeRegular.far,
        fas: freeSolid.fas,
        fal: freeSolid.fas, // Light → Solid fallback
        fat: freeRegular.far // Thin → Regular fallback
      }
    }
  }
}

export default defineNuxtPlugin(async nuxt => {
  const { far, fas, fal, fat } = await loadIcons()
  library.add(far, fas, fab, fal, fat)
  nuxt.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
