import join from 'memory-fs/lib/join'
const metaTitle = 'Planetside 2 Alert Tracker'
const metaDesc = "PS2Alerts - Building Planetside 2's Alert metagame"
const metaImg = `${process.env.BASE_URL}/og-image.png`

export default {
  // We're forced to use env injection for this otherwise we can't build it into class constructors.
  env: {
    apiHost: process.env.API_HOST ?? 'https://api.ps2alerts.com',
  },
  publicRuntimeConfig: {
    built: process.env.BUILT ?? 'UNKNOWN BUILD TIME',
    environment: process.env.ENV ?? 'UNKNOWN ENVIRONMENT',
    build: process.env.BUILD ?? 'UNKNOWN BUILD',
    version: process.env.VERSION ?? 'UNKNOWN VERSION',
    baseUrl: process.env.BASE_URL ?? 'https://dev.ps2alerts.com',
    maintenance: false,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    timing: false,
  },
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'PS2Alerts',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'title', content: metaTitle },
      {
        hid: 'description',
        name: 'description',
        content: metaDesc,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: metaDesc,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: metaTitle,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: metaImg,
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'PS2Alerts',
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: metaTitle,
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content: metaTitle,
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content: metaImg,
      },
      {
        hid: 'twitter:image:alt',
        property: 'twitter:image:alt',
        content: metaTitle,
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~assets/css/tailwind.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/filters/AlertEndTime', mode: 'client' },
    { src: '@/filters/BracketName', mode: 'client' },
    { src: '@/filters/DateTimeFormat', mode: 'client' },
    { src: '@/filters/FacilityTypeShortName', mode: 'client' },
    { src: '@/filters/FactionCircleEmoji', mode: 'client' },
    { src: '@/filters/FactionId', mode: 'client' },
    { src: '@/filters/FactionImage', mode: 'client' },
    { src: '@/filters/FactionName', mode: 'client' },
    { src: '@/filters/FactionOrTeamName', mode: 'client' },
    { src: '@/filters/FactionShortName', mode: 'client' },
    { src: '@/filters/ItemShortName', mode: 'client' },
    { src: '@/filters/OrdinalSuffix', mode: 'client' },
    { src: '@/filters/OutfitImage', mode: 'client' },
    { src: '@/filters/OWRoundByPhase', mode: 'client' },
    { src: '@/filters/PhaseName', mode: 'client' },
    { src: '@/filters/TeamName', mode: 'client' },
    { src: '@/filters/UcFirst', mode: 'client' },
    { src: '@/filters/VehicleFaction', mode: 'client' },
    { src: '@/filters/WorldName', mode: 'client' },
    { src: '@/filters/ZoneName', mode: 'client' },
    { src: '@/plugins/NumeralFilter', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [{ path: '~/components', pathPrefix: false }],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/vuetify',
    '@nuxtjs/style-resources',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://github.com/nuxt-community/google-gtag-module
    '@nuxtjs/google-gtag',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-leaflet',
    '@nuxtjs/fontawesome',
  ],
  tailwindcss: {
    configPath: 'tailwind.config.js',
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  fontawesome: {
    icons: {
      solid: true,
      brands: true,
    },
  },

  // https://www.npmjs.com/package/@nuxtjs/vuetify
  vuetify: {
    theme: { dark: true },
    treeShake: true, // required for scss vars to work
  },

  'google-gtag': {
    id: process.env.GOOGLE_PROPERTY,
    debug: process.env.ENV !== 'production', // enable to track in dev / staging mode
  },

  router: {
    scrollBehavior() {
      const elem = document.getElementById('panel-right')
      return { x: 0, y: elem.offsetTop - 12 }
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    babel: {
      presets({ isServer }) {
        const targets = isServer ? { node: 'current' } : { ie: 11 }
        return [[require.resolve('@babel/preset-env'), { targets }]]
      },
      plugins: [
        '@babel/syntax-dynamic-import',
        '@babel/transform-runtime',
        '@babel/transform-async-to-generator',
      ],
    },
    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
        tailwindcss: join(__dirname, 'tailwind.config.js'),
        'postcss-extend-rule': {},
        'postcss-import': {},
        'postcss-nested': {},
        autoprefixer: {},
      },
      preset: {
        // Change the postcss-preset-env settings
        autoprefixer: {
          grid: true,
        },
      },
    },
  },
}
