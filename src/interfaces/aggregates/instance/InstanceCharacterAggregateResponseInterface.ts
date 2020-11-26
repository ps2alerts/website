import {CombatMetricsInterface} from "@/interfaces/CombatMetricsInterface";

export interface InstanceCharacterAggregateResponseInterface extends CombatMetricsInterface{
  instance: string;
  character: string;
  outfit?: string;
}
