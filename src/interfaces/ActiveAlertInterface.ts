import {World} from "@/constants/World";
import {Zone} from "@/constants/Zone";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";

export interface ActiveAlertInterface {
  instanceId: string;
  censusInstanceId: string;
  world: World,
  zone: Zone,
  timeStarted: string;
  censusMetagameEventType: number;
  duration: number;
  state: Ps2alertsEventState;
  remaining: number; // Calculated remaining time
}
