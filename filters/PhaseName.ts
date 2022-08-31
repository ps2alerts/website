import Vue from 'vue'
import { Phase } from '@/ps2alerts-constants/outfitwars/phase'

const phaseName = Vue.filter('phaseName', (value: Phase, plural: boolean = true) => {
  switch (value) {
    case Phase.QUALIFIERS:
      return plural ? 'Qualifiers' : 'Qualifier'
    case Phase.PLAYOFFS:
      return plural ? 'Playoffs' : 'Playoff'
    case Phase.CHAMPIONSHIPS:
      return plural ? 'Championships' : 'Championship'
    default:
      return 'UNKNOWN!'
  }
})

export default phaseName
