const config = {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'STAYFUN員工福利整合平台',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          '精選數百件商品、全台優惠折扣票券、特約優惠商店、各式有趣活動資訊，STAYFUN幫你搞定福委大小事！'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'STAYFUN員工福利整合平台'
      },
      {
        hid: 'og:type',
        name: 'og:type',
        content: 'STAYFUN員工福利整合平台'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content:
          '精選數百件商品、全台優惠折扣票券、特約優惠商店、各式有趣活動資訊，STAYFUN幫你搞定福委大小事！'
      },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'STAYFUN員工福利整合平台'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/main.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/fontawesome',
    '~/plugins/axios',
    '~/plugins/vee-validate.js',
    { src: '~/plugins/vue-good-table', mode: 'client' },
    '~/plugins/tooltip',
    { src: '~/plugins/vue-simple-calendar', mode: 'client' },
    { src: '~plugins/zendesk.js', mode: 'client' },
    { src: '~/plugins/nuxt-leaflet.js', mode: 'client' },
    { src: '~/plugins/console.js', mode: 'client' }
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'bootstrap-vue/nuxt',
    'cookie-universal-nuxt',
    'nuxt-leaflet'
  ],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false // Or `bvCSS: false`
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  // axios: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    babel: {
      presets() {
        return [['@nuxt/babel-preset-app', { loose: true }]]
      }
    },
    transpile: ['vee-validate/dist/rules'],
    // analyze: true,
    analyze: false
  },
  env: {
    apiKey: '',
    PROXY_URL: process.env.NUXT_ENV_PROXY_URL,
    ZENDESK_KEY: process.env.NUXT_ENV_ZENDESK_KEY
  },
  loading: '~/components/DefaultLoading.vue',
  pageTransition: 'fade',
  pwa: {
    manifest: {
      name: 'STAYFUN員工福利整合平台',
      short_name: 'STAYFUN',
      description:
        '精選數百件商品、全台優惠折扣票券、特約優惠商店、各式有趣活動資訊，STAYFUN幫你搞定福委大小事！',
      lang: 'zh-tw',
      useWebmanifestExtension: false,
      display: 'standalone',
      theme_color: '#fabf13'
    },
    icon: {
      purpose: 'maskable'
    }
  }
}

module.exports = {
  ...config
}
