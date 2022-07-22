import { Zone } from '@/constants/zone'
import { Faction } from '~/constants/faction'

export interface MetagameDetailsInterface {
  title: string
  zone: Zone
  duration: number
  triggeringFaction: Faction
  unstable: boolean // Whether the zone has links disabled, known as Underpowered Warpgate mode.
}
