// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    appConfig: {
        productionTip: false,
        defaultSuffix: '.bsky.social',
        bskyService: 'https://bsky.social',
    },
    modules: [
        '@nuxtjs/tailwindcss'
    ],
    css: [
        'flowbite/dist/flowbite.css',
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    plugins: [
        '@/plugins/fontawesome.ts',
         { src: '~/plugins/vercel.ts', mode: 'client' },
    ]
})
