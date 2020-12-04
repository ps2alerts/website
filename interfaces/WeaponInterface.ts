import {CombatMetricsInterface} from "@/interfaces/CombatMetricsInterface";
import {Faction} from "@/constants/Faction";

export interface WeaponInterface extends CombatMetricsInterface {
  id: number;
  name: string;
  faction: Faction;
}
