// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    BASE_URL: process.env.BASE_URL,
    public: {
      BASE_URL: process.env.BASE_URL,
      apiBase: "", // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    // plugins: ["~/server/index.js"],
  },
  modules: [
    'nuxt-particles'
  ]
});
