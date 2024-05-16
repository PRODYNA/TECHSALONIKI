// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  sourcemap: {
    server: true,
    client: true
  },
  nitro: {
    storage: {
      filesystem: {
        driver: "fs",
        base: "./db"
      }
    }
  },
  build: {
    transpile: ["beercss"]
  },
  modules: ["@vite-pwa/nuxt"],
  pwa: {
    /* PWA options */
    registerType: 'autoUpdate',
    manifest: {
      "short_name": "Workshop app",
      "name": "Workshop app",
      "start_url": ".",
      "display": "standalone",
      "theme_color": "#ffffff",
      "background_color": "#ffffff"
    },
    strategies: 'injectManifest',
      injectManifest: {

      },
      scope: '/',
      srcDir: './service-worker',
      filename: 'sw.ts',
      devOptions: {
        enabled: true,
        type: 'module'
      }
  }
})