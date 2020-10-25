import axios, {AxiosInstance} from "axios";
import {Config} from "@/config";

export default class ApiRequest {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: Config.api.url,
      responseType: 'json',
    })
  }
}
