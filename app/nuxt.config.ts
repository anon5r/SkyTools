// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default {
  app: {
    ssr: true,
    head: {
      title: 'SkyTools',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
    },
  },
  appConfig: {
    pages: true,
    productionTip: false,
    title: 'SkyTools' as string,
    defaultSuffix: '.bsky.social' as string,
    bskyService: 'https://bsky.social' as string,
    bskyAppURL: 'https://bsky.app' as string,
    adminDID: 'did:plc:c22jdrqhoajyj5ca7e56a3ke' as string,
    inviteCodeFreq: { weeks: 2 } as object,
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    'flowbite/dist/flowbite.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/css/main.css',
  ],
  plugins: [
    '@/plugins/fontawesome.client.ts',
    '@/plugins/vue-gtm.client.ts',
    { src: '~/plugins/vercel.ts', mode: 'client' },
  ],
}
