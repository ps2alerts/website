import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { CharacterInterface } from '@/interfaces/CharacterInterface'

export interface InstanceCharacterAggregateResponseInterface
  extends CombatMetricsInterface {
  instance: string
  character: CharacterInterface
}
