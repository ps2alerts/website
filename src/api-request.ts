import axios, {AxiosInstance} from "axios";
import {Config} from "@/config";
import {CommonApiParamsInterface} from "@/interfaces/CommonApiParmsInterface";

export default class ApiRequest {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: Config.api.url,
      responseType: 'json',
    })
  }

  public async get<T>(endpoint: string, params?: CommonApiParamsInterface): Promise<T> {
    return await this.client.get(endpoint, {
        params: params,
      }
    )
    .then(response => {
      // console.log('Api Client Request', {endpoint, params, response});
      return response.data;
    })
  }
}
