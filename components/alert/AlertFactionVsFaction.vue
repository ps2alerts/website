<template>
  <div class="col-span-12 ss:col-span-5 card relative text-center">
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
      <p class="mb-2 text-sm text-gray-500">
        Below is calculated into a points system. Each kill made by a faction is
        worth 1 point, each capture 100 points.
      </p>
      <table class="w-full table-fixed border-row">
        <thead>
          <tr>
            <td class="w-2/20">Faction</td>
            <td class="w-8/20">Calculated Focus</td>
            <td class="w-5/20">Kills Focus</td>
            <td class="w-5/20">Capture Focus</td>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr>
            <td>VS</td>
            <td class="p-1 whitespace-nowrap">
              <FactionSegmentMultiBar
                :keys="['Kills', 'Captures']"
                :vs="[0]"
                :nc="[scores.kills.vs.nc, scores.captures.vs.nc * captureWorth]"
                :tr="[scores.kills.vs.tr, scores.captures.vs.tr * captureWorth]"
                other="0"
                dropoff-percent="10"
                :is-percentage="isPercentage"
                :show-as-calculated-percentage="showAsCalclatedPercentage"
                :vertical-points="[50]"
              />
            </td>

            <td class="p-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="0"
                :nc="scores.kills.vs.nc"
                :tr="scores.kills.vs.tr"
                :other="0"
                dropoff-percent="10"
              />
            </td>
            <td class="p-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="0"
                :nc="scores.captures.vs.nc"
                :tr="scores.captures.vs.tr"
                :other="0"
                dropoff-percent="10"
              />
            </td>
          </tr>
          <tr>
            <td>TR</td>
            <td class="p-1 whitespace-nowrap">
              <FactionSegmentMultiBar
                :keys="['Kills', 'Captures']"
                :vs="[scores.kills.tr.vs, scores.captures.tr.vs * captureWorth]"
                :nc="[scores.kills.tr.nc, scores.captures.tr.nc * captureWorth]"
                :tr="[0]"
                other="0"
                dropoff-percent="5"
                :is-percentage="isPercentage"
                :show-as-calculated-percentage="showAsCalclatedPercentage"
              />
            </td>
            <td class="p-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="scores.kills.tr.vs"
                :nc="scores.kills.tr.nc"
                :tr="0"
                :other="0"
                dropoff-percent="10"
              />
            </td>
            <td class="p-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="scores.captures.tr.vs"
                :nc="scores.captures.tr.nc"
                :tr="0"
                :other="0"
                dropoff-percent="10"
              />
            </td>
          </tr>
          <tr>
            <td>NC</td>
            <td class="p-1 whitespace-nowrap">
              <FactionSegmentMultiBar
                :keys="['Kills', 'Captures']"
                :vs="[scores.kills.nc.vs, scores.captures.nc.vs * captureWorth]"
                :nc="[0]"
                :tr="[scores.kills.nc.tr, scores.captures.nc.tr * captureWorth]"
                other="0"
                dropoff-percent="10"
                :is-percentage="isPercentage"
                :show-as-calculated-percentage="showAsCalclatedPercentage"
              />
            </td>
            <td class="p-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="scores.kills.nc.vs"
                :nc="0"
                :tr="scores.kills.nc.tr"
                :other="0"
                dropoff-percent="10"
              />
            </td>
            <td class="p-1 whitespace-nowrap">
              <FactionSegmentBar
                :vs="scores.captures.nc.vs"
                :nc="0"
                :tr="scores.captures.nc.tr"
                :other="0"
                dropoff-percent="10"
              />
            </td>
          </tr>
        </tbody>
      </table>
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
        if (facility.vs && facility.vs.takenFrom) {
          scores.vs.nc += facility.vs.takenFrom.nc ?? 0
          scores.vs.tr += facility.vs.takenFrom.tr ?? 0
        }
        if (facility.nc && facility.nc.takenFrom) {
          scores.nc.vs += facility.nc.takenFrom.vs ?? 0
          scores.nc.tr += facility.nc.takenFrom.tr ?? 0
        }
        if (facility.tr && facility.tr.takenFrom) {
          scores.tr.vs += facility.tr.takenFrom.vs ?? 0
          scores.tr.nc += facility.tr.takenFrom.nc ?? 0
        }
      })

      return scores
    },
  },
})
</script>
