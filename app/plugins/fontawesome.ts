import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

export default defineNuxtPlugin(nuxt => {
  // Use Free version
  // Map light (fal) → solid (fas) and thin (fat) → regular (far)
  library.add(far, fas, fab, fas, far)
  nuxt.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
