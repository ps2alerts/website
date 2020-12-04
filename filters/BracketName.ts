import { Bracket } from '@/constants/Bracket'
import Vue from 'vue'

const bracketName = Vue.filter('bracketName', (value: Bracket) => {
  switch (value) {
    case Bracket.NONE:
      return 'N/A'
    case Bracket.AFTERNOON:
      return 'Afternoon'
    case Bracket.PRIME:
      return 'Prime'
    case Bracket.MORNING:
      return 'Morning'
    default:
      return 'UNKNOWN!'
  }
})

export default bracketName
