<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 2xl:col-span-6 2xl:col-start-4 card relative mb-2">
      <div class="tag section">Global Faction Combat</div>
      <CountdownSpinner
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
      />
      <div v-if="!loaded" class="text-center">
        <h1>Loading...</h1>
      </div>
      <div v-if="loaded">
        <table class="w-full table-fixed text-center border-row">
          <thead class="font-bold">
            <tr>
              <td style="width: 100px" class="text-left">Metric</td>
              <td>Global Faction Score</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="py-1 text-left">Kills</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.kills"
                  :nc="totalsData.nc.kills"
                  :tr="totalsData.tr.kills"
                  :other="totalsData.nso.kills"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.2a"
                  fraction-digits="1"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">Deaths</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.deaths"
                  :nc="totalsData.nc.deaths"
                  :tr="totalsData.tr.deaths"
                  :other="totalsData.nso.deaths"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.0a"
                  fraction-digits="1"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">KD</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.kd"
                  :nc="totalsData.nc.kd"
                  :tr="totalsData.tr.kd"
                  :other="totalsData.nso.kd"
                  other-segment-text="NSO"
                  :is-percentage="false"
                  :show-as-calculated-percentage="false"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">Teamkills</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.teamKills"
                  :nc="totalsData.nc.teamKills"
                  :tr="totalsData.tr.teamKills"
                  :other="totalsData.nso.teamKills"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.0a"
                  fraction-digits="1"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">Teamkill %</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.teamKills / totalsData.vs.deaths"
                  :nc="totalsData.nc.teamKills / totalsData.nc.deaths"
                  :tr="totalsData.tr.teamKills / totalsData.tr.deaths"
                  :other="totalsData.nso.teamKills / totalsData.nso.deaths"
                  other-segment-text="NSO"
                  :is-percentage="false"
                  :show-as-calculated-percentage="false"
                  numeral="0.[0]%"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">Suicides</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.suicides"
                  :nc="totalsData.nc.suicides"
                  :tr="totalsData.tr.suicides"
                  :other="totalsData.nso.suicides"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.0a"
                  fraction-digits="1"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">Headshots</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.headshots"
                  :nc="totalsData.nc.headshots"
                  :tr="totalsData.tr.headshots"
                  :other="totalsData.nso.headshots"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.0a"
                  fraction-digits="1"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">HSR</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.hsr"
                  :nc="totalsData.nc.hsr"
                  :tr="totalsData.tr.hsr"
                  :other="totalsData.nso.hsr"
                  other-segment-text="NSO"
                  :is-percentage="true"
                  :show-as-calculated-percentage="false"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import {
  GlobalCombatMetricsInterface,
  GlobalFactionCombatAggregateResponseInterface,
} from '~/interfaces/aggregates/global/GlobalFactionCombatAggregateResponseInterface'
import { World } from '~/constants/World'

interface TotalFactionInterface {
  vs?: GlobalCombatMetricsInterface
  nc?: GlobalCombatMetricsInterface
  tr?: GlobalCombatMetricsInterface
  nso?: GlobalCombatMetricsInterface
}

export default Vue.extend({
  name: 'CombatFactions',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<GlobalFactionCombatAggregateResponseInterface[]>,
    updateCountdownPercent: {
      type: Number,
      default: 100,
      required: true,
    },
    updateRate: {
      type: Number,
      default: 0,
      required: true,
    },
    mode: {
      type: String,
      default: 'percent',
      required: true,
    },
  },
  data() {
    return {
      loaded: false,
      totalsData: {} as TotalFactionInterface,
    }
  },
  watch: {
    rawData(): void {
      this.totalsData = this.transformTotalsData(this.rawData)
      this.loaded = true
    },
  },
  created() {
    this.totalsData = this.transformTotalsData(this.rawData)
    this.loaded = true
  },
  methods: {
    transformTotalsData(data: GlobalFactionCombatAggregateResponseInterface[]) {
      const totalMetrics: TotalFactionInterface = {}
      data.forEach((world: GlobalFactionCombatAggregateResponseInterface) => {
        if (world.world === World.JAEGER) {
          return
        }

        totalMetrics.vs = world.vs
          ? this.addMetrics(world.vs, totalMetrics.vs)
          : totalMetrics.vs ?? undefined
        totalMetrics.nc = world.nc
          ? this.addMetrics(world.nc, totalMetrics.nc)
          : totalMetrics.nc ?? undefined
        totalMetrics.tr = world.tr
          ? this.addMetrics(world.tr, totalMetrics.tr)
          : totalMetrics.tr ?? undefined
        totalMetrics.nso = world.nso
          ? this.addMetrics(world.nso, totalMetrics.nso)
          : totalMetrics.nso ?? undefined
      })

      return totalMetrics
    },
    addMetrics(
      worldFaction: GlobalCombatMetricsInterface,
      totals: GlobalCombatMetricsInterface | undefined
    ): GlobalCombatMetricsInterface {
      const newData = totals ?? {
        kills: 0,
        deaths: 0,
        teamKills: 0,
        suicides: 0,
        headshots: 0,
        kd: 0,
        hsr: 0,
      }
      newData.kills += worldFaction.kills ?? 0
      newData.deaths += worldFaction.deaths ?? 0
      newData.teamKills += worldFaction.teamKills ?? 0
      newData.suicides += worldFaction.suicides ?? 0
      newData.headshots += worldFaction.headshots ?? 0

      newData.kd = parseFloat(
        ((newData.kills ?? 0) / (newData.deaths ?? 0)).toFixed(2)
      )
      newData.hsr = parseFloat(
        newData.headshots && newData.kills
          ? ((newData.headshots / newData.kills) * 100).toFixed(1)
          : '0'
      )

      return newData
    },
  },
})
</script>
