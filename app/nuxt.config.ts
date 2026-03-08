import { defineNuxtConfig } from 'nuxt/config'
import { existsSync } from 'fs'
import { join } from 'path'
import tailwindcss from '@tailwindcss/vite'

const isProInstalled = () => {
  try {
    return existsSync(
      join(process.cwd(), 'node_modules/@fortawesome/pro-solid-svg-icons')
    )
  } catch (e) {
    return false
  }
}

const usePro = isProInstalled()
console.log(`FontAwesome Setup: Using ${usePro ? 'Pro' : 'Free'} version`)

const faAliases = usePro
  ? {}
  : {
      '@fortawesome/pro-solid-svg-icons': '@fortawesome/free-solid-svg-icons',
      '@fortawesome/pro-regular-svg-icons':
        '@fortawesome/free-regular-svg-icons',
      '@fortawesome/pro-brands-svg-icons': '@fortawesome/free-brands-svg-icons',
      '@fortawesome/pro-light-svg-icons': '@fortawesome/free-solid-svg-icons',
      '@fortawesome/pro-thin-svg-icons': '@fortawesome/free-solid-svg-icons',
      '@fortawesome/pro-duotone-svg-icons': '@fortawesome/free-solid-svg-icons',
    }

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  srcDir: '.',
  alias: {
    ...faAliases,
  },
  runtimeConfig: {
    public: {
      GTM_ID: process.env.GTM_ID || 'GTM-UNDEFINED',

      defaultPDS: 'bsky.social',
      defaultPDSEntrypoint: 'https://bsky.social',
      webmasterDid: 'did:plc:c22jdrqhoajyj5ca7e56a3ke',
      inviteCodeFreq: '{"days": 10}',
      cdnPrefix: 'https://cdn-skytools.anon5r.com/proxy',
      prodURLPrefix: 'https://skytools.anon5r.com',
      bskyAppURL: process.env.DEFAULT_APP_URL || 'https://bsky.app',
    },
  },
  ssr: false,
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
    timeline: { enabled: process.env.NODE_ENV === 'development' },
  },

  devServer: {
    host: '127.0.0.1',
  },

  app: {
    head: {
      title: 'SkyTools',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
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

        { name: 'twitter:card', content: 'summary_image' },
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
  appConfig: {},
  compatibilityDate: '2026-01-08',
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/scripts',
    '@nuxt/image',
    '@nuxt/eslint',
    process.env.NODE_ENV !== 'production' ? 'nitro-cloudflare-dev' : null,
  ].filter(Boolean) as any[],
  css: [
    'flowbite/dist/flowbite.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/css/main.css',
  ],
  plugins: [],
  scripts: {
    registry: {
      cloudflareWebAnalytics: {
        token: process.env.CLOUDFLARE_TOKEN || 'none',
      },
    },
  },
  build: {
    transpile: process.env.NODE_ENV === 'production' ? ['@atproto/api'] : [],
    analyze: process.env.NODE_ENV !== 'production',
  },
  vite: {
    plugins: [tailwindcss() as any],
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'atproto/api': ['@atproto/api'],
          },
        },
      },
    },
  },
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  routeRules: {
    // Generated at build time for SEO purpose
    '/': { prerender: true },
    '/about': { prerender: true },
    '/profile': { prerender: true },
    '/invite-code': { prerender: true },
    '/profile/:did': { swr: 3600 },
    '/pds': { prerender: true },
    '/pds/:hostname': { swr: 3600 },
  },
  colorMode: {
    classSuffix: '',
  },
})
