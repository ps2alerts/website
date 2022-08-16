import Vue from 'vue'
import factionName from './FactionName'
import teamName from './TeamName'
import { Faction } from '@/ps2alerts-constants/faction'
import { Team } from '~/ps2alerts-constants/outfitwars/team'
import { Ps2alertsEventType } from '~/ps2alerts-constants/ps2alertsEventType'

const factionOrTeamName = Vue.filter(
  'factionOrTeamName',
  (value: Faction & Team, eventType: Ps2alertsEventType) => {
    if (eventType !== Ps2alertsEventType.LIVE_METAGAME) {
      return teamName(value)
    }
    return factionName(value)
  }
)

export default factionOrTeamName
