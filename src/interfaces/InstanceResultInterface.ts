import {Faction} from "@/constants/Faction";

export interface InstanceResultInterface {
  vs: number;
  nc: number;
  tr: number;
  winner: Faction | null;
}
