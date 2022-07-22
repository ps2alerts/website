import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { Faction } from '@/constants/faction'

export interface WeaponInterface extends CombatMetricsInterface {
  id: number
  name: string
  faction: Faction
}
