import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { Loadout } from '~/constants/Loadout'

export interface InstanceLoadoutResponseInterface
  extends CombatMetricsInterface {
  instance: string
  loadout: Loadout
}
