export const Config = {
  app: {
    version: process.env.VUE_APP_VERSION ? process.env.VUE_APP_VERSION : 'UNKNOWN VERSION',
  },
  api: {
    url: process.env.VUE_APP_API_HOST ? process.env.VUE_APP_API_HOST : 'http://dev.api.ps2alerts.com',
  }
}
