<template>
  <div class="col-span-12 card relative text-center">
    <div class="tag section">Capture History</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="text-center">
      <button
        class="btn btn-alt btn-sm"
        :class="{ 'btn-active': showDefences === true }"
        @click="changeData()"
      >
        Show Defences*
      </button>
      <p class="text-gray-400 text-sm m-2">
        *Defences mean when an capture timer has started then returned to
        normal. There are going to be a <b>lot</b> of these. We also don't know
        who attempted to capture the base as the API doesn't provide this data.
      </p>
      <v-data-table
        class="datatable"
        :headers="headers"
        :items="shownData"
        :item-class="tableItemClass"
        v-bind="tableConfig"
      >
        <template #no-data>
          <div class="text-2xl text-white font-bold my-6">
            Awaiting first capture...
          </div>
        </template>
        <template slot="item.timestamp" slot-scope="{ item }">
          {{ item.timestamp | dateTimeFormatShort }}
        </template>
        <template slot="item.outfitFull" slot-scope="{ item }">
          <div
            v-if="
              item.outfitData &&
              item.outfitData.outfit &&
              item.outfitData.outfit.name
            "
          >
            <span v-show="item.outfitData.outfit.tag"
              >[{{ item.outfitData.outfit.tag }}] </span
            ><span>{{ item.outfitData.outfit.name }}</span>
          </div>
          <div v-else>== No Outfit / Unknown ==</div>
        </template>
        <template slot="item.facilityNameWithType" slot-scope="{ item }">
          <span
            >{{ item.facilityData.name }} ({{
              item.facilityData.typeName
            }})</span
          >
        </template>
        <template slot="item.isDefence" slot-scope="{ item }">
          <span v-show="item.isDefence">Defense</span>
          <span v-show="!item.isDefence">Capture</span>
        </template>
        <template slot="item.winnerLooser" slot-scope="{ item }">
          <span v-if="!item.isDefence" class="font-bold">
            <span :class="captureClass(item.factionWinner)">{{
              item.factionWinner
            }}</span>
            /
            <span :class="captureClass(item.factionLooser)">{{
              item.factionLooser
            }}</span>
          </span>
          <span v-else-if="item.isDefence && showDefences">-</span>
        </template>
        <template slot="item.territory" slot-scope="{ item }">
          <FactionSegmentBar
            v-if="item.mapControl"
            :vs="item.mapControl.vs"
            :nc="item.mapControl.nc"
            :tr="item.mapControl.tr"
            :other="item.mapControl.cutoff"
            :out-of-play="item.mapControl.outOfPlay"
            dropoff-percent="15"
          ></FactionSegmentBar>
          <span v-if="!item.mapControl">Awaiting data...</span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import { Ps2alertsEventState } from '@/ps2alerts-constants/ps2alertsEventState'
import ApiRequest from '~/api-request'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceFacilityControlEntriesResponseInterface } from '~/interfaces/instance-entries/InstanceFacilityControlEntriesResponseInterface'
import { DataTableConfig } from '@/constants/DataTableConfig'
import { InstanceMapCaptureHistoryInterface } from '~/interfaces/instance-entries/InstanceMapCaptureHistoryInterface'
import { FacilityType } from '@/ps2alerts-constants/facilityType'
import { Zone } from '@/ps2alerts-constants/zone'
import factionShortName from '~/filters/FactionShortName'
import { FactionBgClassString } from '@/constants/FactionBgClass'
import { InstanceOutfitAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface'
import { ps2AlertsApiEndpoints } from '~/ps2alerts-constants/ps2AlertsApiEndpoints'
import { Ps2alertsEventType } from '~/ps2alerts-constants/ps2alertsEventType'
import { OWMapControlInterface } from '~/interfaces/instance-entries/OWMapControlInterface'
import { MapControlInterface } from '~/interfaces/instance-entries/MapControlInterface'
import teamName from '~/filters/TeamName'

export default Vue.extend({
  name: 'AlertMapCaptureHistory',
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
    // eslint-disable-next-line vue/require-prop-types
    facilityData: {
      // Omitted Type here as I couldn't figure out how to get TS to play nice
      default: new Map(),
      required: true,
    },
    dataReady: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 5000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      shownData: {} as InstanceMapCaptureHistoryInterface[],
      captureData: {} as InstanceMapCaptureHistoryInterface[],
      defenceData: {} as InstanceMapCaptureHistoryInterface[],
      outfitData: new Map() as Map<
        string,
        InstanceOutfitAggregateResponseInterface
      >,
      showDefences: false,
      tableConfig: DataTableConfig,
      headers: [
        {
          text: 'Timestamp',
          align: 'center',
          value: 'timestamp',
          width: '120px',
        },
        {
          text: 'Facility',
          align: 'left',
          sortable: false,
          value: 'facilityNameWithType',
        },
        {
          text: 'Outfit',
          align: 'left',
          value: 'outfitFull',
        },
        {
          text: 'Win / Loss',
          align: 'middle',
          filterable: false,
          sortable: false,
          value: 'winnerLooser',
        },
        {
          text: 'Battle Type',
          align: 'middle',
          filterable: false,
          sortable: false,
          value: 'isDefence',
        },
        {
          text: 'Territory %',
          align: 'middle',
          filterable: false,
          sortable: false,
          value: 'territory',
          width: '300px',
        },
      ],
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
    dataReady() {
      if (this.dataReady) {
        this.pull()
      }
    },
    showDefences() {
      console.log('Toggling data type')
      this.shownData = this.showDefences ? this.defenceData : this.captureData
      console.log('AlertMapCaptureHistory.shownData', this.shownData)
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
    changeData() {
      this.showDefences = !this.showDefences
    },
    tableItemClass(item: InstanceMapCaptureHistoryInterface): string {
      return FactionBgClassString(item.newFaction)
    },
    captureClass(winner: string) {
      switch (winner) {
        case 'VS':
          return 'text-vs'
        case 'NC':
          return 'text-nc'
        case 'TR':
          return 'text-tr'
      }
      return ''
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

      this.outfitData = await this.pullOutfitData(
        this.alert.instanceId ?? '12345'
      )

      if (!this.dataReady) {
        console.log('AlertMapCaptureHistory.pull failed as data was not ready!')
        return
      }

      console.log('AlertMapCaptureHistory.pull', this.alert.instanceId)

      let endpoint = Endpoints.INSTANCE_FACILITY_CONTROL_ENTRIES.replace(
        '{instance}',
        this.alert.instanceId ? this.alert.instanceId.toString() : 'whatever'
      )
      if (
        this.alert.ps2alertsEventType &&
        this.alert.ps2alertsEventType ===
          Ps2alertsEventType.OUTFIT_WARS_AUG_2022
      ) {
        endpoint = ps2AlertsApiEndpoints.outfitwarsInstanceFacility.replace(
          '{instanceId}',
          this.alert.instanceId ? this.alert.instanceId.toString() : 'whatever'
        )
      }

      await new ApiRequest()
        .get<InstanceFacilityControlEntriesResponseInterface[]>(
          `${endpoint}?sortBy=timestamp&order=desc`
        )
        .then((result) => {
          const processedData = this.transformData(result)
          this.captureData = processedData.captures
          this.defenceData = processedData.defences
          this.shownData = this.captureData

          console.log('AlertMapCaptureHistory.shownData', this.shownData)
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    transformData(data: InstanceFacilityControlEntriesResponseInterface[]): {
      captures: InstanceMapCaptureHistoryInterface[]
      defences: InstanceMapCaptureHistoryInterface[]
    } {
      const captureData: InstanceMapCaptureHistoryInterface[] = []
      const defenceData: InstanceMapCaptureHistoryInterface[] = []

      data.forEach(
        (capture: InstanceFacilityControlEntriesResponseInterface) => {
          // Chuck if initial
          if (capture.isInitial) {
            return
          }

          const isOutfitWars =
            this.alert.ps2alertsEventType ===
            Ps2alertsEventType.OUTFIT_WARS_AUG_2022
          if (isOutfitWars && capture.mapControl) {
            ;(capture.mapControl as MapControlInterface).tr = (
              capture.mapControl as OWMapControlInterface
            ).red
            ;(capture.mapControl as MapControlInterface).nc = (
              capture.mapControl as OWMapControlInterface
            ).blue
            ;(capture.mapControl as MapControlInterface).vs = 0
          }

          const tempData: InstanceMapCaptureHistoryInterface = Object.assign(
            capture,
            {
              factionWinner: isOutfitWars
                ? teamName(capture.newFaction)
                : factionShortName(capture.newFaction),
              factionLooser: isOutfitWars
                ? teamName(capture.oldFaction)
                : factionShortName(capture.oldFaction),
              facilityData: this.facilityData.get(capture.facility)
                ?.facility ?? {
                name: 'Awaiting Data...',
                id: 12345,
                zone: this.alert.zone ?? Zone.ESAMIR,
                type: FacilityType.DEFAULT,
                region: 12345,
              },
              outfitData: this.outfitData.get(capture.outfitCaptured ?? ''),
            }
          )

          if (!capture.isDefence) {
            captureData.push(tempData)
          }

          defenceData.push(tempData)
        }
      )

      return { captures: captureData, defences: defenceData }
    },
    async pullOutfitData(
      instanceId: string
    ): Promise<Map<string, InstanceOutfitAggregateResponseInterface>> {
      const newMap = new Map<string, InstanceOutfitAggregateResponseInterface>()

      console.log('AlertMapCaptureHistory.pullOutfitData', instanceId)

      await new ApiRequest()
        .get<InstanceOutfitAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_OUTFIT.replace('{instance}', instanceId)
        )
        .then((outfitAggregate) => {
          outfitAggregate.forEach(
            (outfitData: InstanceOutfitAggregateResponseInterface) => {
              newMap.set(outfitData.outfit.id, outfitData)
            }
          )
        })

      return newMap
    },
  },
})
</script>
