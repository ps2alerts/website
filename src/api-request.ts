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
    console.log('endpoint', endpoint);
    console.log('params', params);
    return await this.client.get(endpoint, {
        params: params,
      }
    )
    .then(data => {
      console.log('api data', data);
      return data.data;
    })
  }
}
