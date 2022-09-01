import Vue from 'vue'
import factionName from './FactionName'
import teamName from './TeamName'
import { Faction } from '@/ps2alerts-constants/faction'
import { Team } from '~/ps2alerts-constants/outfitwars/team'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'

const factionOrTeamName = Vue.filter(
  'factionOrTeamName',
  (value: Faction & Team, eventType: Ps2AlertsEventType) => {
    if (eventType !== Ps2AlertsEventType.LIVE_METAGAME) {
      return teamName(value)
    }
    return factionName(value)
  }
)

export default factionOrTeamName
