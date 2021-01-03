import { WeaponInterface } from '@/interfaces/WeaponInterface'
import { World } from '~/constants/World'

// This is not extended from CombatMetricsInterface as Deaths is not present in this dataset
export interface GlobalWeaponAggregateResponseInterface {
  kills: number
  teamKills: number
  suicides: number
  headshots: number
  world: World
  weapon: WeaponInterface
}
