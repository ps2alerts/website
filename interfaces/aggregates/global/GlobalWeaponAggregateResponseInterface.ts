import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { WeaponInterface } from '@/interfaces/WeaponInterface'
import { World } from '~/constants/World'

export interface GlobalWeaponAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  weapon: WeaponInterface
}
