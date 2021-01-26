<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Facility Breakdown</div>
      <CountdownSpinner
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
      />
      <div class="col-span-12">
        <div class="mb-2">
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
            type="text"
            placeholder="Facility / Type / Continent"
            aria-label="Facility / Type / Continent"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          item-key="uuid"
          :headers="tableHeaders"
          :items="items"
          :search="filter"
          :item-class="tableItemClass"
          v-bind="tableConfig"
        >
          <template slot="item.rank" slot-scope="props">
            {{ items.indexOf(props.item) + 1 }}
          </template>
        </v-data-table>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsFacilityServerMetricsLeaderboardConfig } from '~/constants/DataTableConfig'
import { StatisticsFacilityTableDataInterface } from '~/interfaces/statistics/StatisticsFacilityTableDataInterface'
import { ZoneBgClassString } from '~/constants/Zone'

export default Vue.extend({
  name: 'FacilitiesTotals',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<StatisticsFacilityTableDataInterface[]>,
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
    sorting: {
      type: String,
      default: 'kills',
      required: true,
    },
  },
  data() {
    return {
      items: [] as StatisticsFacilityTableDataInterface[],
      filter: '',
      tableConfig: StatisticsFacilityServerMetricsLeaderboardConfig,
      tableHeaders: [
        {
          text: '#',
          align: 'middle',
          value: 'rank',
          sortable: false,
          width: 25,
        },
        {
          text: 'Facility',
          align: 'left',
          value: 'facility.name',
        },
        {
          text: 'Type',
          align: 'left',
          value: 'facility.typeName',
        },
        {
          text: 'Continent',
          align: 'left',
          value: 'zoneName',
        },
        {
          text: 'Captures',
          align: 'middle',
          filterable: false,
          value: 'captures',
        },
        {
          text: 'VS Caps',
          align: 'middle',
          filterable: false,
          value: 'vsCaps',
        },
        {
          text: 'TR Caps',
          align: 'middle',
          filterable: false,
          value: 'trCaps',
        },
        {
          text: 'NC Caps',
          align: 'middle',
          filterable: false,
          value: 'ncCaps',
        },
        {
          text: 'Defences',
          align: 'middle',
          filterable: false,
          value: 'defences',
        },
      ],
    }
  },
  watch: {
    rawData(): void {
      this.items = this.transformTotalsData()
    },
  },
  created() {
    this.items = this.transformTotalsData()
  },
  methods: {
    transformTotalsData(): StatisticsFacilityTableDataInterface[] {
      const calcData: { [k: string]: StatisticsFacilityTableDataInterface } = {}
      this.rawData.forEach(
        (worldFacility: StatisticsFacilityTableDataInterface) => {
          const facility: StatisticsFacilityTableDataInterface =
            calcData[worldFacility.facility.id] ?? {}

          facility.facility = worldFacility.facility
          facility.zoneName = worldFacility.zoneName

          facility.captures = facility.captures
            ? facility.captures + (worldFacility?.captures ?? 0)
            : worldFacility.captures ?? 0

          facility.defences = facility.defences
            ? facility.defences + (worldFacility?.defences ?? 0)
            : worldFacility.defences ?? 0

          facility.vsCaps = facility.vsCaps
            ? facility.vsCaps + (worldFacility?.vsCaps ?? 0)
            : worldFacility.vsCaps ?? 0

          facility.ncCaps = facility.ncCaps
            ? facility.ncCaps + (worldFacility?.ncCaps ?? 0)
            : worldFacility.ncCaps ?? 0

          facility.trCaps = facility.trCaps
            ? facility.trCaps + (worldFacility?.trCaps ?? 0)
            : worldFacility.trCaps ?? 0

          calcData[worldFacility.facility.id] = facility
        }
      )

      const returnData: StatisticsFacilityTableDataInterface[] = []
      for (const key in calcData) {
        returnData.push(calcData[key])
      }

      const sortMetric = this.sorting !== '' ? this.sorting : 'captures'

      // Sort by metric
      return returnData.sort((a, b) => {
        // @ts-ignore
        return b[sortMetric] - a[sortMetric]
      })
    },
    tableItemClass(facility: StatisticsFacilityTableDataInterface): string {
      return ZoneBgClassString(facility.facility.zone)
    },
  },
})
</script>
