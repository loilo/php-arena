// https://nuxt.com/docs/api/configuration/nuxt-config
const baseURL = (String(import.meta.env.BASE_URL ?? '') + '/').replace(
  /\/+$/,
  '/',
)

export default defineNuxtConfig({
  vite: {
    esbuild: {
      keepNames: true,
    },
  },
  devServer: {
    port: 53344,
  },
  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    'nuxt-headlessui',
    '~/modules/fix-manifest/module',
    '~/modules/pre-build-wasm/module',
  ],
  app: {
    baseURL,
    keepalive: true,
  },
  runtimeConfig: {
    public: {
      baseURL,
    },
  },
  css: ['~/assets/css/global.scss'],
  pwa: {
    registerType: 'autoUpdate',
    base: baseURL,
    buildBase: baseURL,
    manifest: {
      name: 'PHP Arena | The Online PHP Playground',
      short_name: 'PHP Arena',
      theme_color: '#1a212f',
      icons: [
        {
          src: baseURL + 'php-arena-pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: baseURL + 'php-arena-pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: baseURL + 'php-arena-pwa-512x512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: baseURL,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,ttf,woff,woff2}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
  googleFonts: {
    fontsPath: baseURL + 'fonts',
    families: {
      'JetBrains+Mono': [400],
      Poppins: [400],
    },
  },
  imports: {
    dirs: ['./stores'],
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  colorMode: {
    storageKey: 'theme',
    classSuffix: '',
  },
})
