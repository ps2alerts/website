import {Faction} from "@/constants/Faction";

export interface InstanceResultInterface {
  vs: number;
  nc: number;
  tr: number;
  victor: Faction | null;
}
