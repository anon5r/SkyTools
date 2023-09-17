import { defineNuxtPlugin } from 'nuxt/app'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default defineNuxtPlugin(nuxt => {
  library.add(far, fas, fab)
  nuxt.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
