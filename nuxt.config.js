export default {
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
    // title: process.env.npm_package_name || '',
    title: 'STAYFUN員工福利整合平台',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        // content: process.env.npm_package_description || ''
        content:
          '精選數百件商品、全台優惠折扣票券、特約優惠商店、各式有趣活動資訊，STAYFUN幫你搞定福委大小事！'
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
    '~/plugins/composition-api',
    '~/plugins/fontawesome',
    '~/plugins/axios',
    '~/plugins/vee-validate.js',
    { src: '~/plugins/vue-good-table', ssr: false },
    '~/plugins/tooltip'
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
    bootstrapVueCSS: true // Or `bvCSS: false`
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
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
    transpile: ['vee-validate/dist/rules']
  },
  env: {
    apiUrl: process.env.API_URL || '',
    apiKey: process.env.API_KEY || '',
    proxyUrl: process.env.PROXY_URL || 'http://localhost:8080',
    useProxy: process.env.USE_PROXY || '1'
  },
  loading: '~/components/DefaultLoading.vue',
  pageTransition: 'fade'
}
