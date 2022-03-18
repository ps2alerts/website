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

export const zoneArray = [2, 4, 6, 8];

export const zoneToWarpgateArray = new Map<Zone, number[]>([
  [Zone.INDAR, [7801, 120000, 4801]],
  [Zone.HOSSIN, [308000, 309000, 310000]],
  [Zone.AMERISH, [200000, 201000, 203000]],
  [Zone.ESAMIR, [258000, 259000, 260000]],
  [Zone.OSHUR, [400370, 400369, 400371]]
]);

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
      return 115.5;
    case Zone.OSHUR:
      return 57.75;
    default:
      return 1;
  }
}