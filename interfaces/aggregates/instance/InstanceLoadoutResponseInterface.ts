import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { Loadout } from '~/constants/loadout'

export interface InstanceLoadoutResponseInterface
  extends CombatMetricsInterface {
  instance: string
  loadout: Loadout
}
