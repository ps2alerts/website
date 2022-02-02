export enum Zone {
  INDAR = 2,
  HOSSIN = 4,
  AMERISH = 6,
  ESAMIR = 8,
  OSHUR = 344,
  // VR_TRAINING_NC = 96,
  // VR_TRAINING_TR = 97,
  // VR_TRAINING_VS = 98,
}

export const zoneArray = [2, 4, 6, 8]

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
  }
}
