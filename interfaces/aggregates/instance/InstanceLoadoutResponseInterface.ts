import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { Loadout } from '@/ps2alerts-constants/loadout'

export interface InstanceLoadoutResponseInterface
  extends CombatMetricsInterface {
  instance: string
  loadout: Loadout
}
