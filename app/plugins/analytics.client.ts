import { createGtm } from '@gtm-support/vue-gtm'
import { defineNuxtPlugin, useRouter, useRuntimeConfig } from '#app' // ❶ 型補完を効かせたい場合は明示 import

export default defineNuxtPlugin(nuxtApp => {
  // ❷ runtimeConfig から GTM ID を取得
  const {
    public: { GTM_ID },
  } = useRuntimeConfig()

  // ❸ Router インスタンスを取得
  const router = useRouter()

  // ❹ GTM 初期化
  const gtm = createGtm({
    id: GTM_ID,
    defer: true,
    compatibility: false,
    enabled: true,
    debug: false,
    loadScript: true,
    vueRouter: router,
    trackOnNextTick: true,
    ignoredViews: [],
  })

  // ❺ アプリに登録
  nuxtApp.vueApp.use(gtm)
})
