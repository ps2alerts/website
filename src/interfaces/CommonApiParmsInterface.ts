import {World} from "@/constants/World";
import {Zone} from "@/constants/Zone";

export interface CommonApiParamsInterface {
  world?: World;
  zone?: Zone;
  sortBy?: string;
  order?: string
  pageSize?: number,
}
