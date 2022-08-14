import Vue from 'vue'
import { Phase } from '@/ps2alerts-constants/outfitwars/phase'

const phaseName = Vue.filter('phaseName', (value: Phase) => {
  switch (value) {
    case Phase.QUALIFIERS:
      return 'Qualifiers'
    case Phase.PLAYOFFS:
      return 'Playoffs'
    case Phase.CHAMPIONSHIPS:
      return 'Championships'
    default:
      return 'UNKNOWN!'
  }
})

export default phaseName
