export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      GTM_ID: process.env.GTM_ID || 'GTM-UNDEFINED',

      defaultPDS: 'bsky.social',
      atprotoServiceSuffix: 'bsky.social',
      atprotoService: 'https://bsky.social',
      serviceAppUrl: ' https://bsky.app',
      adminDid: 'did:plc:c22jdrqhoajyj5ca7e56a3ke',
      inviteCodeFreq: '{"days": 10}',
      cdnPrefix: 'https://cdn.bluesky.social/imgproxy',
    },
  },
  ssr: true,
  devtools: { enabled: true, timeline: { enabled: true } },
  app: {
    head: {
      title: 'SkyTools',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
        },
        {
          name: 'description',
          content: 'SkyTools is a tools for the Bluesky',
        },
        {
          name: 'theme-color',
          content: '#ccf2ff',
        },
        { property: 'og:site_name', content: 'SkyTools' },
        { property: 'og:title', content: 'SkyTools' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://bsky.social' },
        {
          property: 'og:description',
          content: 'SkyTools is a tools for the Bluesky',
        },
        {
          property: 'og:image',
          content: 'https://skytools.anon5r.com/images/default.png',
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'SkyTools' },
        { name: 'twitter:site', content: '@anon5r' },
        {
          name: 'twitter:creator',
          content: 'https://bsky.app/profile/did:plc:c22jdrqhoajyj5ca7e56a3ke',
        },
        {
          name: 'twitter:description',
          content: 'SkyTools is a tools for the Bluesky',
        },
        {
          name: 'twitter:image',
          content: 'https://skytools.anon5r.com/images/default.png',
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
    defaultPDS: process.env.PDS_DEFAULT || ('bsky.social' as string),
    bskyService:
      process.env.ATPROTO_SERVICE || ('https://bsky.social' as string),
    bskyAppURL: process.env.SERVICE_APP_URL || ('https://bsky.app' as string),
    adminDID:
      process.env.ADMIN_DID || ('did:plc:c22jdrqhoajyj5ca7e56a3ke' as string),
    inviteCodeFreq:
      (process.env.INVITE_CODE_FREQ &&
        JSON.parse(process.env.INVITE_CODE_FREQ)) ||
      ({ weeks: 2 } as object),
    cdnPrefix: process.env.CDN_PREFIX || 'https://cdn.bluesky.social/imgproxy',
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-cloudflare-analytics',
    '@nuxt/devtools',
  ],
  css: [
    'flowbite/dist/flowbite.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/css/main.css',
  ],
  plugins: ['@/plugins/analytics.client.ts'],
  cloudflareAnalytics: {
    token: process.env.CLOUDFLARE_TOKEN || 'none',
  },

  routeRules: {
    '/lookup': { redirect: '/profile' },
  },
})
