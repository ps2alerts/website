import Vue from 'vue'
import { Zone } from '@/constants/Zone'

const zoneNameFilter = Vue.filter('zoneName', (value: Zone) => {
  switch (value) {
    case Zone.INDAR:
      return 'Indar'
    case Zone.HOSSIN:
      return 'Hossin'
    case Zone.AMERISH:
      return 'Amerish'
    case Zone.ESAMIR:
      return 'Esamir'
    default:
      return 'UNKNOWN!'
  }
})

export default zoneNameFilter
