import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far, fas, fal, fat } from '@awesome.me/kit-e7e521035c/icons'

export default defineNuxtPlugin(nuxt => {
  library.add(far, fas, fab, fal, fat)
  nuxt.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
