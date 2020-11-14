import {InstanceResultInterface} from "@/interfaces/InstanceResultInterface";

export interface TerritoryResultInterface extends InstanceResultInterface {
  cutoff: number;
  outOfPlay: number;
  draw: boolean;
}
