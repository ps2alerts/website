import { Zone } from '@/ps2alerts-constants/zone'
import { Faction } from '@/ps2alerts-constants/faction'

export interface MetagameDetailsInterface {
  title: string
  zone: Zone
  duration: number
  triggeringFaction: Faction
  unstable: boolean // Whether the zone has links disabled, known as Underpowered Warpgate mode.
}
