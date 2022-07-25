export enum Zone {
    INDAR = 2,
    HOSSIN = 4,
    AMERISH = 6,
    ESAMIR = 8,
    // VR_TRAINING_NC = 96,
    // VR_TRAINING_TR = 97,
    // VR_TRAINING_VS = 98,
    OSHUR = 344,
  }


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
  
  export const ZoneHexSize = (zone: Zone | undefined): number => {
    switch (zone) {
      case Zone.AMERISH:
      case Zone.ESAMIR:
      case Zone.HOSSIN:
      case Zone.INDAR:
        return 115.5
      case Zone.OSHUR:
        return 57.75
      default:
        return 1
    }
  }