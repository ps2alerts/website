import join from 'memory-fs/lib/join'

export default {
  env: {
    build: process.env.BUILD ?? 'UNKNOWN BUILD',
    version: process.env.VERSION ?? 'UNKNOWN VERSION',
    environment: process.env.ENVIRONMENT ?? 'UNKNOWN ENVIRONMENT',
    apiUrl: process.env.API_HOST ?? 'http://dev.api.ps2alerts.com',
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    timing: false,
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'PS2Alerts',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: "PS2Alerts - Building Planetside 2's Alert metagame",
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/filters/AlertEndTime', mode: 'client' },
    { src: '@/filters/BracketName', mode: 'client' },
    { src: '@/filters/DateTimeFormat', mode: 'client' },
    { src: '@/filters/FactionName', mode: 'client' },
    { src: '@/filters/ItemShortName', mode: 'client' },
    { src: '@/filters/VehicleFaction', mode: 'client' },
    { src: '@/filters/WorldName', mode: 'client' },
    { src: '@/filters/ZoneName', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    [
      'nuxt-fontawesome',
      {
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas'],
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab'],
          },
        ],
      },
    ],
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
        tailwindcss: join(__dirname, 'tailwind.config.js'),
        'postcss-import': {},
        'postcss-nested': {},
        'postcss-extend': {},
        'postcss-normalize': {},
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
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL ?? 'dev.ps2alerts.com.test',
  },
}
