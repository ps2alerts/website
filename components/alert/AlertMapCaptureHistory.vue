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
        normal. There are going to be a lot of these.
      </p>
      <v-data-table
        class="datatable"
        :headers="headers"
        :items="shownData"
        :item-class="tableItemClass"
        v-bind="tableConfig"
      >
        <template #no-results>
          <div class="text-2xl text-white font-bold my-6">
            Awaiting Captures...
          </div>
        </template>
        <template slot="item.timestamp" slot-scope="{ item }">
          {{ item.timestamp | dateTimeFormatShort }}
        </template>
        <template slot="item.outfit"> [DIG] Dignity Of War </template>
        <template slot="item.facilityNameWithType" slot-scope="{ item }"
          >>
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
          <span v-if="!item.isDefence"
            >{{ item.factionWinner }} / {{ item.factionLooser }}</span
          >
          <span v-else-if="item.isDefence && showDefences">-</span>
        </template>
        <template slot="item.territory">
          <FactionSegmentBar
            :vs="40"
            :nc="20"
            :tr="20"
            :other="0"
            dropoff-percent="15"
          ></FactionSegmentBar>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import { Ps2alertsEventState } from '~/constants/Ps2alertsEventState'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { InstanceFacilityControlEntriesResponseInterface } from '~/interfaces/instance-entries/InstanceFacilityControlEntriesResponseInterface'
import { DataTableConfig } from '~/constants/DataTableConfig'
import { InstanceMapCaptureHistoryInterface } from '~/interfaces/instance-entries/InstanceMapCaptureHistoryInterface'
import { FacilityType } from '~/constants/FacilityType'
import { Zone } from '~/constants/Zone'
import factionShortName from '~/filters/FactionShortName'
import { FactionBgClassString } from '~/constants/FactionBgClass'

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
      showDefences: false,
      tableConfig: DataTableConfig,
      headers: [
        {
          text: 'Timestamp',
          align: 'left',
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
          value: 'outfit',
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

      if (!this.dataReady) {
        console.log('AlertMapCaptureHistory.pull failed as data was not ready!')
        return
      }

      console.log('AlertMapCaptureHistory.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceFacilityControlEntriesResponseInterface[]>(
          Endpoints.INSTANCE_FACILITY_CONTROL_ENTRIES.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
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

          const tempData: InstanceMapCaptureHistoryInterface = Object.assign(
            capture,
            {
              factionWinner: factionShortName(capture.newFaction),
              factionLooser: factionShortName(capture.oldFaction),
              facilityData: this.facilityData.get(capture.facility)
                ?.facility ?? {
                name: 'UNKNOWN',
                id: 12345,
                zone: this.alert.zone ?? Zone.ESAMIR,
                type: FacilityType.DEFAULT,
                region: 12345,
              },
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
  },
})
</script>
