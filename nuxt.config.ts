// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  css: ['@fortawesome/fontawesome-free/css/all.css'],

  modules: ['@nuxtjs/sitemap'],

  sitemap: {
    siteUrl: 'https://daily-prophet-pi.vercel.app',
    gzip: true,
    trailingSlash: false,
    exclude: ['/admin'], // 有需要可排除
    routes: async () => {
      const { data } = await $fetch('https://daily-prophet-pi.vercel.app/api/post-routes')
      return data // 自訂 API 回傳動態路由
    }
  }
})
