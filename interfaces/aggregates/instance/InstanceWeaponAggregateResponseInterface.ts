import {CombatMetricsInterface} from "@/interfaces/CombatMetricsInterface";
import {WeaponInterface} from "@/interfaces/WeaponInterface";

export interface InstanceWeaponAggregateResponseInterface extends CombatMetricsInterface{
  instance: string;
  weapon: WeaponInterface;
}
