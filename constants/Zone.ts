import { Zone } from '@/ps2alerts-constants/zone'

export const ZoneBgClassString = (zone: Zone | undefined): string => {
  if (!zone) {
    return ''
  }

  switch (zone) {
    case Zone.INDAR:
      return 'bg-indar'
    case Zone.HOSSIN:
      return 'bg-hossin'
    case Zone.AMERISH:
      return 'bg-amerish'
    case Zone.ESAMIR:
      return 'bg-esamir'
    case Zone.OSHUR:
      return 'bg-oshur'
    case Zone.NEXUS:
      return 'bg-nexus'
  }
}

export const ZoneHexSize = (zone: Zone | undefined): number => {
  switch (zone) {
    case Zone.AMERISH:
    case Zone.ESAMIR:
    case Zone.HOSSIN:
    case Zone.INDAR:
    case Zone.NEXUS:
      return 115.5
    case Zone.OSHUR:
      return 57.75
    default:
      return 1
  }
}
