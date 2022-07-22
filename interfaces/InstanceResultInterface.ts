import { Faction } from '~/constants/faction'

export interface InstanceResultInterface {
  vs: number
  nc: number
  tr: number
  victor: Faction | null
}
