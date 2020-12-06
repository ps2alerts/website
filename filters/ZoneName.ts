import { Zone } from '@/constants/Zone'
import Vue from 'vue'

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
