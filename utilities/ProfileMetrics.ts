import { Bracket } from '~/ps2alerts-constants/bracket'
import BracketName from '~/filters/BracketName'
import {
  ProfileAlertInterface,
  ProfileCommonMetricsInterface,
  ProfileGlobalAggregateInterface,
  ProfileMetricsInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'

export const profileBrackets = [
  Bracket.TOTAL,
  Bracket.DEAD,
  Bracket.LOW,
  Bracket.MEDIUM,
  Bracket.HIGH,
  Bracket.PRIME,
]

interface BracketTotals {
  kills: number
  deaths: number
  headshots: number
  teamKills: number
  teamKilled: number
  suicides: number
  alerts: number
  xpmAlerts: number
  kpm: number
  dpm: number
}

const emptyTotals = (): BracketTotals => ({
  kills: 0,
  deaths: 0,
  headshots: 0,
  teamKills: 0,
  teamKilled: 0,
  suicides: 0,
  alerts: 0,
  xpmAlerts: 0,
  kpm: 0,
  dpm: 0,
})

const ratio = (numerator: number, denominator: number, scale = 1): string =>
  denominator > 0 ? ((numerator / denominator) * scale).toFixed(2) : '0.00'

export const filterAlertsByDays = (
  alerts: ProfileAlertInterface[],
  days: number | null
): ProfileAlertInterface[] => {
  if (!days || days <= 0) {
    return alerts
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  return alerts.filter((alert) => {
    const started = alert.instanceDetails?.timeStarted
    return !!started && new Date(started).getTime() >= cutoff
  })
}

const sumAlert = (totals: BracketTotals, alert: ProfileAlertInterface) => {
  totals.alerts++
  totals.kills += alert.kills ?? 0
  totals.deaths += alert.deaths ?? 0
  totals.headshots += alert.headshots ?? 0
  totals.teamKills += alert.teamKills ?? 0
  totals.teamKilled += alert.teamKilled ?? 0
  totals.suicides += alert.suicides ?? 0

  // XPMs only exist for alerts tracked since the feature launched, so they get their own denominator
  if (alert.xPerMinutes) {
    totals.xpmAlerts++
    totals.kpm += alert.xPerMinutes.killsPerMinute ?? 0
    totals.dpm += alert.xPerMinutes.deathsPerMinute ?? 0
  }
}

const buildAverages = (
  totals: BracketTotals,
  bracket: Bracket
): ProfileCommonMetricsInterface => ({
  kills: ratio(totals.kills, totals.alerts),
  deaths: ratio(totals.deaths, totals.alerts),
  kd: ratio(totals.kills, totals.deaths),
  headshots: ratio(totals.headshots, totals.alerts),
  hsr: ratio(totals.headshots, totals.kills, 100),
  teamKills: ratio(totals.teamKills, totals.alerts),
  tkr: ratio(totals.teamKills, totals.kills, 100),
  teamKilled: ratio(totals.teamKilled, totals.alerts),
  tkedr: ratio(totals.teamKilled, totals.deaths, 100),
  suicides: ratio(totals.suicides, totals.alerts),
  suir: ratio(totals.suicides, totals.deaths, 100),
  kpm: ratio(totals.kpm, totals.xpmAlerts),
  dpm: ratio(totals.dpm, totals.xpmAlerts),
  xpmBracketCount: totals.xpmAlerts,
  bracket: `Avg (${BracketName(bracket)})`,
  bracketCount: totals.alerts,
})

const buildBracket = (
  totals: BracketTotals,
  averages: ProfileCommonMetricsInterface,
  bracket: Bracket
): ProfileCommonMetricsInterface => ({
  kills: `${totals.kills} [${averages.kills}]`,
  deaths: `${totals.deaths} [${averages.deaths}]`,
  kd: averages.kd,
  headshots: `${totals.headshots} [${averages.headshots}]`,
  hsr: averages.hsr,
  teamKills: `${totals.teamKills} [${averages.teamKills}]`,
  tkr: averages.tkr,
  teamKilled: `${totals.teamKilled} [${averages.teamKilled}]`,
  tkedr: averages.tkedr,
  suicides: `${totals.suicides} [${averages.suicides}]`,
  suir: averages.suir,
  kpm: averages.kpm,
  dpm: averages.dpm,
  xpmBracketCount: totals.xpmAlerts,
  bracket: BracketName(bracket),
  bracketCount: totals.alerts,
})

/**
 * Builds the profile tables from the per-alert aggregates. When global aggregates are supplied (the all-time view)
 * their totals win, since they include alerts that predate per-alert tracking; a day-filtered view sums the alerts instead.
 */
export const buildProfileMetrics = (
  alerts: ProfileAlertInterface[],
  globals: Map<Bracket, ProfileGlobalAggregateInterface | null> | null
): ProfileMetricsInterface => {
  const totals = new Map<Bracket, BracketTotals>()
  profileBrackets.forEach((bracket) => totals.set(bracket, emptyTotals()))

  alerts.forEach((alert) => {
    sumAlert(totals.get(Bracket.TOTAL)!, alert)

    const bracket = alert.instanceDetails?.bracket
    const bracketTotals =
      bracket !== undefined ? totals.get(bracket) : undefined

    if (bracketTotals) {
      sumAlert(bracketTotals, alert)
    }
  })

  if (globals) {
    globals.forEach((global, bracket) => {
      const bracketTotals = totals.get(bracket)

      if (!global || !bracketTotals) {
        return
      }

      bracketTotals.kills = global.kills ?? 0
      bracketTotals.deaths = global.deaths ?? 0
      bracketTotals.headshots = global.headshots ?? 0
      bracketTotals.teamKills = global.teamKills ?? 0
      bracketTotals.teamKilled = global.teamKilled ?? 0
      bracketTotals.suicides = global.suicides ?? 0
    })
  }

  const brackets: ProfileMetricsInterface['brackets'] = {}
  const averages: ProfileMetricsInterface['averages'] = {}

  profileBrackets.forEach((bracket) => {
    const bracketTotals = totals.get(bracket)!
    const hasData = bracketTotals.alerts > 0 || !!globals?.get(bracket)

    if (!hasData) {
      brackets[bracket] = null
      averages[bracket] = null
      return
    }

    const bracketAverages = buildAverages(bracketTotals, bracket)
    averages[bracket] = bracketAverages
    brackets[bracket] = buildBracket(bracketTotals, bracketAverages, bracket)
  })

  return { brackets, averages, alerts }
}
