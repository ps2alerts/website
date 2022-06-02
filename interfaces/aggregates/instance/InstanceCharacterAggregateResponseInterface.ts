import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { CharacterInterface } from '@/interfaces/CharacterInterface'
import XPerMinuteInterface from '~/interfaces/XPerMinuteInterface'

export interface InstanceCharacterAggregateResponseInterface
  extends CombatMetricsInterface {
  instance: string
  character: CharacterInterface
  durationInAlert: number
  durationFirstSeen: number
  xPerMinutes: XPerMinuteInterface
}
