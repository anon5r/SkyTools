// https://nuxt.com/docs/api/configuration/nuxt-config


export default {
    appConfig: {
        pages: true,
        productionTip: false,
        defaultSuffix: '.bsky.social' as string,
        bskyService: 'https://bsky.social' as string,
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
}
