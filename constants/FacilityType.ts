export enum FacilityType {
  DEFAULT = 1, // Wat
  AMP_STATION = 2,
  BIO_LAB = 3,
  TECH_PLANT = 4,
  LARGE_OUTPOST = 5,
  SMALL_OUTPOST = 6,
  WARPGATE = 7,
  INTERLINK_FACILITY = 8,
  CONSTRUCTION_OUTPOST = 9,
  RELIC_OUTPOST = 10, // Desolation only
  CONTAINMENT_SITE = 11,
  TRIDENT = 12,
  UNDERWATER = 13,
}

export const MAJOR_FACILITIES = [
  FacilityType.AMP_STATION,
  FacilityType.BIO_LAB,
  FacilityType.CONTAINMENT_SITE,
  FacilityType.INTERLINK_FACILITY,
  FacilityType.TRIDENT,
  FacilityType.TECH_PLANT,
  FacilityType.WARPGATE,
  FacilityType.RELIC_OUTPOST,
]
