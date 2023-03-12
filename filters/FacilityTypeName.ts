import Vue from 'vue'
import { FacilityType } from '@/ps2alerts-constants/facilityType'

const facilityTypeName = Vue.filter(
  'facilityTypeName',
  (facilityType: FacilityType) => {
    switch (facilityType) {
      case FacilityType.TECH_PLANT:
        return 'Tech Plant'
      case FacilityType.DEFAULT:
        return 'Default / Unknown'
      case FacilityType.AMP_STATION:
      case FacilityType.CTF_AMP_STATION:
        return 'Amp Station'
      case FacilityType.BIO_LAB:
        return 'Biolab'
      case FacilityType.CONSTRUCTION_OUTPOST:
        return 'Construction / 1 min'
      case FacilityType.LARGE_OUTPOST:
        return 'Large Facility'
      case FacilityType.SMALL_OUTPOST:
        return 'Small Facility'
      // Unused
      case FacilityType.WARPGATE:
        return 'Warpgate'
      case FacilityType.RELIC_OUTPOST:
        return 'Relic Outpost (Desolation - Unused)'
      case FacilityType.INTERLINK_FACILITY:
        return 'Interlink Facility'
    }
  }
)

export default facilityTypeName
