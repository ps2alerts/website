import axios, { AxiosInstance } from 'axios'
import { CommonApiParamsInterface } from '~/interfaces/CommonApiParmsInterface'

export default class ApiRequest {
  public client: AxiosInstance

  constructor(baseUrl?: string) {
    this.client = axios.create({
      baseURL: baseUrl ?? process.env.apiHost,
      responseType: 'json',
    })
  }

  public async get<T>(
    endpoint: string,
    params?: CommonApiParamsInterface
  ): Promise<T> {
    return await this.client
      .get(endpoint, {
        params,
      })
      .then((response) => {
        // console.log('Api Client Request', { endpoint, params, response })
        return response.data
      })
  }
}
