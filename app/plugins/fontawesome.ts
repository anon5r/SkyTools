import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/pro-brands-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'

export default defineNuxtPlugin(nuxt => {
  library.add(far, fas, fab)
  nuxt.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
