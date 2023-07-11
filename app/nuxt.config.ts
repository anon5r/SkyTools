import { defineNuxtConfig } from 'nuxt/config'

export default {
  runtimeConfig: {
    public: {
      GTM_ID: process.env.GTM_ID || 'GTM-UNDEFINED',

      atprotoServiceSuffix: '.bsky.social',
      atprotoService: 'https://bsky.social',
      serviceAppUrl: ' https://bsky.app',
      adminDid: 'did:plc:c22jdrqhoajyj5ca7e56a3ke',
      inviteCodeFreq: '{"days": 10}',
    },
  },
  app: {
    ssr: true,
    darkmode: 'class',
    head: {
      title: 'SkyTools',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
          description: 'SkyTools is a tools for the Bluesky',
        },
        {
          name: 'theme-color',
          content: '#ccf2ff',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          sizes: '180x180',
          href: '/icons/apple-touch-icon.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          sizes: '144x144',
          href: '/icons/apple-touch-icon-144x144.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          sizes: '96x96',
          href: '/icons/apple-touch-icon-96x96.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          sizes: '72x72',
          href: '/icons/apple-touch-icon-72x72.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          sizes: '57x57',
          href: '/icons/apple-touch-icon-57x57.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '180x180',
          href: '/icons/icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '144x144',
          href: '/icons/icon-144x144.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: '/icons/icon-96x96.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '72x72',
          href: '/icons/icon-72x72.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '57x57',
          href: '/icons/icon-57x57.png',
        },
      ],
    },
  },
  appConfig: {
    pages: true,
    productionTip: false,
    title: 'SkyTools' as string,
    defaultSuffix:
      process.env.ATPROTO_SERVICE_SUFFIX || ('.bsky.social' as string),
    bskyService:
      process.env.ATPROTO_SERVICE || ('https://bsky.social' as string),
    bskyAppURL: process.env.SERVICE_APP_URL || ('https://bsky.app' as string),
    adminDID:
      process.env.ADMIN_DID || ('did:plc:c22jdrqhoajyj5ca7e56a3ke' as string),
    inviteCodeFreq:
      (process.env.INVITE_CODE_FREQ &&
        JSON.parse(process.env.INVITE_CODE_FREQ)) ||
      ({ weeks: 2 } as object),
  },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-cloudflare-analytics'],
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
  cloudflareAnalytics: {
    token: process.env.CLOUDFLARE_TOKEN || 'none', //'82dce72b88df4fba9032244b9a294ee1',
  },
}
