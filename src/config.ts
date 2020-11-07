export const Config = {
  app: {
    build: process.env.VUE_APP_BUILD ? process.env.VUE_APP_BUILD : 'UNKNOWN BUILD!',
    version: process.env.VUE_APP_VERSION ? process.env.VUE_APP_VERSION : 'UNKNOWN VERSION!',
  },
  api: {
    url: process.env.VUE_APP_API_HOST ? process.env.VUE_APP_API_HOST : 'http://dev.api.ps2alerts.com',
  }
}
