import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { Faction } from '@/ps2alerts-constants/faction'

export interface WeaponInterface extends CombatMetricsInterface {
  id: number
  name: string
  faction: Faction
}
