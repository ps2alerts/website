import { World } from '@/ps2alerts-constants/world'
import { Zone } from '@/ps2alerts-constants/zone'
import { Ps2alertsEventState } from '@/ps2alerts-constants/ps2alertsEventState'
import { Phase } from '@/ps2alerts-constants/outfitwars/phase'
import { OutfitwarsTerritoryResultInterface } from '@/ps2alerts-constants/interfaces/OutfitwarsTerritoryResultInterface'
import { PS2AlertsInstanceFeaturesInterface } from '~/interfaces/PS2AlertsInstanceFeaturesInterface'

export interface InstanceOutfitWarsResponseInterface {
  instanceId: string
  world: World
  zone: Zone
  zoneInstanceId: number
  timeStarted: string
  timeEnded?: string | null
  duration: number
  state: Ps2alertsEventState
  phase: Phase
  round: number
  mapVersion?: string
  result: OutfitwarsTerritoryResultInterface
  features?: PS2AlertsInstanceFeaturesInterface
}
