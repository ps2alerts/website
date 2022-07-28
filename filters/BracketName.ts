import Vue from 'vue'
import { Bracket } from '@/ps2alerts-constants/bracket'

const bracketName = Vue.filter('bracketName', (value: Bracket) => {
  switch (value) {
    case Bracket.UNKNOWN:
      return 'N/A'
    case Bracket.DEAD:
      return 'Dead'
    case Bracket.LOW:
      return 'Low'
    case Bracket.MEDIUM:
      return 'Medium'
    case Bracket.HIGH:
      return 'High'
    case Bracket.PRIME:
      return 'Prime'
    case Bracket.TOTAL:
      return 'Totalled (UNUSED)'
    default:
      return 'UNKNOWN!'
  }
})

export default bracketName
