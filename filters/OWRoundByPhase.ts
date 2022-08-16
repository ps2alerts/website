import Vue from 'vue'
import { Phase } from '~/ps2alerts-constants/outfitwars/phase'

const owRoundByPhase = Vue.filter(
  'owRoundByPhase',
  (round: number, phase: Phase) => {
    switch (phase) {
      case Phase.QUALIFIERS:
        return round
      case Phase.PLAYOFFS:
        return round - 4
      case Phase.CHAMPIONSHIPS:
        return 1
      default:
        return -1
    }
  }
)

export default owRoundByPhase
