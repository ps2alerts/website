import Vue from 'vue'
import { Team } from '@/ps2alerts-constants/outfitwars/team'

const teamName = Vue.filter('teamName', (value: Team) => {
  switch (value) {
    case Team.NONE:
      return 'None / High Pops'
    case Team.BLUE:
      return 'Blue'
    case Team.RED:
      return 'Red'
    default:
      return 'UNKNOWN!'
  }
})

export default teamName
