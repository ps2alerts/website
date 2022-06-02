import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { OutfitInterface } from '@/interfaces/OutfitInterface'
import XPerMinuteOutfitInterface from '~/interfaces/XPerMinuteOutfitInterface'

export interface InstanceOutfitAggregateResponseInterface
  extends CombatMetricsInterface {
  instance: string
  participants: number
  captures?: number
  outfit: OutfitInterface
  durationInAlert: number
  durationFirstSeen: number
  xPerMinutes: XPerMinuteOutfitInterface
}
