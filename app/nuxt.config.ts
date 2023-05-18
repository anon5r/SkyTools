// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    appConfig: {
        productionTip: false
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
    ]
})
