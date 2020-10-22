import Config from "@/config";
import axios, {AxiosInstance} from "axios";

export default class ApiRequest {
  public client: AxiosInstance;
  private readonly config: Config

  constructor() {
    this.config = new Config();
    this.client = axios.create({
      baseURL: this.config.api.url,
      responseType: 'json',
    })
  }
}
