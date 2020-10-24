export default class Config {
  public readonly api = {
      url: process.env.API_HOST ? process.env.API_HOST : 'http://dev.api.ps2alerts.com'
  }
}
