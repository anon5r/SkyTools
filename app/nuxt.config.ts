// https://nuxt.com/docs/api/configuration/nuxt-config

export default {
  app: {
    ssr: true,
    head: {
      title: 'SkyBox',
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
    title: 'SkyBox',
    defaultSuffix: '.bsky.social' as string,
    bskyService: 'https://bsky.social' as string,
    inviteCodeFreq: { weeks: 2 },
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    'flowbite/dist/flowbite.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/css/main.css',
  ],
  plugins: ['@/plugins/fontawesome.client.ts'],
}
