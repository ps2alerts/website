<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-2">Facility Statistics</h1>
    <p class="text-center mb-4">
      Shows the hottest bases split down by world and continent.<br />
      Defences are when a base has had an active timer and all capture points
      are fully secured. Take this with a pinch of salt, there will be a lot of
      them.
    </p>
    <div v-if="loaded">
      <p v-if="filter.bracket !== 0" class="text-center mb-4">
        <font-awesome-icon
          :icon="['fas', 'exclamation-triangle']"
        ></font-awesome-icon>
        Activity Level data is delayed by up to 1:30 hours
      </p>
      <div v-if="data.length === 0">
        <h1 class="text-2xl text-center mb-4">No data! Check back soon!</h1>
      </div>
      <div v-else>
        <FacilitiesTotals
          :v-if="data.length > 0"
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
          :sorting="filter.metric"
        ></FacilitiesTotals>
        <div v-show="!apiFilter.world">
          <FacilitiesServerMetrics
            :v-if="data.length > 0"
            :raw-data="data"
            :update-countdown-percent="updateCountdownPercent"
            :update-rate="updateRate"
            :mode="mode"
          ></FacilitiesServerMetrics>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <h2>Loading...</h2>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { GlobalFacilityControlAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalFacilityControlAggregateResponseInterface'
import { Bracket } from '~/constants/Bracket'
import { GlobalAggregateParamsInterface } from '~/interfaces/GlobalAggregateParamsInterface'
import { FacilityDataInterface } from '~/interfaces/FacilityDataInterface'
import worldNameFilter from '~/filters/WorldName'
import { StatisticsFacilityTableDataInterface } from '~/interfaces/statistics/StatisticsFacilityTableDataInterface'
import { World } from '~/constants/World'
import zoneNameFilter from '~/filters/ZoneName'
import facilityTypeName from '~/filters/FacilityTypeName'

export default Vue.extend({
  name: 'Facilities',
  props: {
    mode: {
      type: String,
      default: 'percent',
      required: true,
    },
    filter: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: [] as StatisticsFacilityTableDataInterface[],
      facilityData: new Map() as Map<number, FacilityDataInterface[]>,
      totalMode: true,
      filtered: false,
    }
  },
  computed: {
    apiFilter() {
      const filter: GlobalAggregateParamsInterface = {
        pageSize: 1000,
        sortBy: 'totals.captures',
        order: 'desc',
      }
      if (this.filter.world > 0) filter.world = this.filter.world
      if (this.filter.zone > 0) filter.zone = this.filter.zone
      if (this.filter.bracket !== Bracket.UNKNOWN)
        filter.bracket = this.filter.bracket

      return filter
    },
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    async filter() {
      await this.filterResults()
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
    setTimers() {
      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)
      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    async init(): Promise<void> {
      await this.pull()
      this.setTimers()
    },
    async pull(): Promise<void> {
      console.log('FacilityStatistics.pull', this.apiFilter)

      await new ApiRequest()
        .get<GlobalFacilityControlAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_FACILITY,
          this.apiFilter
        )
        .then((result) => {
          this.data = this.transformData(result)
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    transformData(
      result: GlobalFacilityControlAggregateResponseInterface[]
    ): StatisticsFacilityTableDataInterface[] {
      const newData: StatisticsFacilityTableDataInterface[] = []

      result.forEach(
        (facility: GlobalFacilityControlAggregateResponseInterface) => {
          if (facility.world === World.JAEGER) {
            return
          }

          // Ensure table displays all data even if zero
          facility.totals.captures = facility.totals.captures ?? 0
          facility.totals.defences = facility.totals.defences ?? 0
          facility.facility.typeName = facilityTypeName(facility.facility.type)

          const tempData: StatisticsFacilityTableDataInterface = Object.assign(
            facility,
            {
              uuid: `${facility.world}-${facility.facility.id}`,
              facility: facility.facility,
              worldName: worldNameFilter(facility.world),
              zoneName: zoneNameFilter(facility.facility.zone),
              captures: facility.totals.captures,
              defences: facility.totals.defences,
              vsCaps: facility.vs?.captures ?? 0,
              ncCaps: facility.nc?.captures ?? 0,
              trCaps: facility.tr?.captures ?? 0,
            }
          )
          newData.push(tempData)
        }
      )

      return newData
    },
    async filterResults(): Promise<void> {
      this.clearTimers()
      await this.pull()
      this.setTimers()
    },
  },
})
</script>
