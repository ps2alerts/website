<template>
  <div class="col-span-12 ss:col-span-6 card relative text-center">
    <div class="tag section">Faction vs Faction</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="text-center">
      <table class="w-full table-fixed border-row mb-2">
        <thead class="font-bold">
          <tr>
            <td class="w-1/20">&nbsp;</td>
            <td class="w-5/20">Kills Focus</td>
            <td class="w-5/20">Capture Focus</td>
            <td class="w-1/20">&nbsp;</td>
            <td class="w-8/20">Faction Opponent Focus</td>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr class="bg-vs">
            <td>VS</td>
            <td class="py-2 px-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="0"
                :nc="scores.kills.vs.nc"
                :tr="scores.kills.vs.tr"
                :other="0"
                dropoff-percent="15"
              />
            </td>
            <td class="py-2 px-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="0"
                :nc="scores.captures.vs.nc"
                :tr="scores.captures.vs.tr"
                :other="0"
                dropoff-percent="15"
              />
            </td>
            <td class="text-center">=</td>
            <td class="py-2 px-1 whitespace-nowrap">
              <FactionSegmentMultiBar
                :keys="['Kills', 'Captures']"
                :vs="[0]"
                :nc="[scores.kills.vs.nc, scores.captures.vs.nc]"
                :tr="[scores.kills.vs.tr, scores.captures.vs.tr]"
                other="0"
                dropoff-percent="10"
                :is-percentage="isPercentage"
                :show-as-calculated-percentage="showAsCalclatedPercentage"
                :vertical-points="[50]"
              />
            </td>
          </tr>
          <tr class="bg-tr">
            <td>TR</td>
            <td class="py-2 px-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="scores.kills.tr.vs"
                :nc="scores.kills.tr.nc"
                :tr="0"
                :other="0"
                dropoff-percent="15"
              />
            </td>
            <td class="py-2 px-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="scores.captures.tr.vs"
                :nc="scores.captures.tr.nc"
                :tr="0"
                :other="0"
                dropoff-percent="15"
              />
            </td>
            <td class="text-center">=</td>
            <td class="py-2 px-1 whitespace-nowrap">
              <FactionSegmentMultiBar
                :keys="['Kills', 'Captures']"
                :vs="[scores.kills.tr.vs, scores.captures.tr.vs]"
                :nc="[scores.kills.tr.nc, scores.captures.tr.nc]"
                :tr="[0]"
                other="0"
                dropoff-percent="10"
                :is-percentage="isPercentage"
                :show-as-calculated-percentage="showAsCalclatedPercentage"
              />
            </td>
          </tr>
          <tr class="bg-nc">
            <td>NC</td>
            <td class="py-2 px-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="scores.kills.nc.vs"
                :nc="0"
                :tr="scores.kills.nc.tr"
                :other="0"
                dropoff-percent="15"
              />
            </td>
            <td class="py-2 px-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="scores.captures.nc.vs"
                :nc="0"
                :tr="scores.captures.nc.tr"
                :other="0"
                dropoff-percent="15"
              />
            </td>
            <td class="text-center">=</td>
            <td class="py-2 px-1 whitespace-nowrap">
              <FactionSegmentMultiBar
                :keys="['Kills', 'Captures']"
                :vs="[scores.kills.nc.vs, scores.captures.nc.vs]"
                :nc="[0]"
                :tr="[scores.kills.nc.tr, scores.captures.nc.tr]"
                other="0"
                dropoff-percent="10"
                :is-percentage="isPercentage"
                :show-as-calculated-percentage="showAsCalclatedPercentage"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-sm text-gray-500 text-left">
        <p class="mb-2 text-center">
          Faction Opponent Focus is calculated via a points system, using the
          following counts:
        </p>
        <table
          class="w-full table-fixed border-row border-col mb-2 text-center text-base text-white"
        >
          <thead>
            <tr class="font-bold">
              <td class="w-2/20">Kills</td>
              <td class="w-4/20">Bio / Amp / Tech</td>
              <td class="w-8/20">Large bases (Towers / 3 pointers)</td>
              <td class="w-6/20">Small bases (1 / 4 min)</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>150</td>
              <td>100</td>
              <td>50</td>
            </tr>
          </tbody>
        </table>
        <p>
          The <span class="text-yellow-500">dashed bar</span> indicates an even
          50/50 balance between the faction and it's opponents. If all bars are
          evenly distributed across all factions, the alert was an even fight.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { InstanceFactionCombatAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceFactionCombatAggregateResponseInterface'
import { Endpoints } from '@/constants/Endpoints'
import { FactionVsFactionDataInterface } from '~/interfaces/FactionVsFactionDataInterface'
import { InstanceFacilityControlAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceFacilityControlAggregateResponseInterface'
import { FacilityType } from '~/constants/FacilityType'

export default Vue.extend({
  name: 'AlertFactionVsFaction',
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 10000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      scores: {
        kills: {} as FactionVsFactionDataInterface,
        captures: {} as FactionVsFactionDataInterface,
      },
      captureWorth: 100,
      isPercentage: false,
      showAsCalclatedPercentage: false,
    }
  },
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2alertsEventState.ENDED) {
        this.clearTimers()
        this.pull()
      }
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.init()
  },
  methods: {
    reset() {
      this.loaded = false
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    init(): void {
      this.pull()
      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      console.log('AlertFactionVsFactionMetrics.pull', this.alert.instanceId)

      const promises: Promise<any>[] = []

      promises.push(
        new ApiRequest()
          .get<InstanceFactionCombatAggregateResponseInterface>(
            Endpoints.AGGREGATES_INSTANCE_FACTION.replace(
              '{instance}',
              this.alert.instanceId
                ? this.alert.instanceId.toString()
                : 'whatever'
            )
          )
          .then((result) => {
            return result
          })
      )

      promises.push(
        new ApiRequest()
          .get<InstanceFacilityControlAggregateResponseInterface[]>(
            Endpoints.AGGREGATES_INSTANCE_FACILITY.replace(
              '{instance}',
              this.alert.instanceId
                ? this.alert.instanceId.toString()
                : 'whatever'
            )
          )
          .then((result) => {
            return result
          })
      )

      await Promise.all(promises)
        .then((returned) => {
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000

          this.scores.kills = returned[0].factionKills
          this.scores.captures = this.transformFacilityData(returned[1])
        })
        .catch((err) => {
          this.error = err
        })
    },
    transformFacilityData(
      result: InstanceFacilityControlAggregateResponseInterface[]
    ): FactionVsFactionDataInterface {
      const scores = {
        vs: {
          nc: 0,
          tr: 0,
        },
        nc: {
          vs: 0,
          tr: 0,
        },
        tr: {
          vs: 0,
          nc: 0,
        },
      }

      result.forEach((facility) => {
        let worth = 0

        switch (facility.facility.type) {
          case FacilityType.AMP_STATION:
          case FacilityType.BIO_LAB:
          case FacilityType.TECH_PLANT:
            worth = 150
            break
          case FacilityType.DEFAULT:
          case FacilityType.LARGE_OUTPOST:
          case FacilityType.INTERLINK_FACILITY:
          case FacilityType.WARPGATE:
            worth = 100
            break
          case FacilityType.SMALL_OUTPOST:
          case FacilityType.CONSTRUCTION_OUTPOST:
          case FacilityType.RELIC_OUTPOST:
            worth = 50
            break
        }

        if (facility.vs && facility.vs.takenFrom) {
          if (facility.vs.takenFrom.nc)
            scores.vs.nc += facility.vs.takenFrom.nc * worth ?? 0
          if (facility.vs.takenFrom.tr)
            scores.vs.tr += facility.vs.takenFrom.tr * worth ?? 0
        }
        if (facility.nc && facility.nc.takenFrom) {
          if (facility.nc.takenFrom.vs)
            scores.nc.vs += facility.nc.takenFrom.vs * worth ?? 0
          if (facility.nc.takenFrom.tr)
            scores.nc.tr += facility.nc.takenFrom.tr * worth ?? 0
        }
        if (facility.tr && facility.tr.takenFrom) {
          if (facility.tr.takenFrom.vs)
            scores.tr.vs += facility.tr.takenFrom.vs * worth ?? 0
          if (facility.tr.takenFrom.nc)
            scores.tr.nc += facility.tr.takenFrom.nc * worth ?? 0
        }
      })

      return scores
    },
  },
})
</script>
