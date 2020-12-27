import { Bracket } from '@/constants/Bracket'
import Vue from 'vue'

const bracketName = Vue.filter('bracketName', (value: Bracket) => {
  switch (value) {
    case Bracket.NONE:
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
    default:
      return 'UNKNOWN!'
  }
})

export default bracketName
