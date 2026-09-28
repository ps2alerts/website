<template>
  <div>
    <p class="text-sm text-center mb-1">
      <span class="label amber mr-1">Tracked since {{ trackingSince }}</span>
      <template v-if="showCoverage">
        Covers <b>{{ vehicleAlerts.toLocaleString() }}</b> of
        {{ summary.totals.alerts.toLocaleString() }} alerts.
      </template>
    </p>
    <p class="text-xs text-gray-400 text-center mb-3">
      Vehicle kills were never recorded before this date, so earlier alerts are
      left out. Counts kills and deaths while in a vehicle; destroying a vehicle
      on foot is not counted here. K/D counts kills of both vehicles and
      infantry.
      <span v-if="summary.type === 'outfit'">
        Totalled across the outfit's
        <template v-if="members">{{ members.toLocaleString() }} </template
        >current members, including time before they joined. Refreshed daily;
        the days filter does not apply.</span
      >
    </p>
    <p v-if="error" class="text-center text-red-400 mb-2">
      {{ error }}
      <button class="btn btn-sm ml-2" @click="load">Retry</button>
    </p>
    <p v-else-if="!loaded" class="text-center p-2">Loading...</p>
    <p v-else-if="truncated" class="text-center p-2">
      This outfit has too many members to total their vehicle stats.
    </p>
    <p v-else-if="rows.length === 0" class="text-center p-2">
      No vehicle activity recorded<span v-if="daysApply">
        in the last {{ summary.days }} days</span
      >.
    </p>
    <div v-else class="grid grid-cols-12 gap-4 items-center">
      <div class="col-span-12 lg:col-span-9 overflow-x-auto">
        <v-simple-table dark dense class="compact">
          <thead>
            <tr class="font-bold border-b border-white whitespace-nowrap">
              <td>Vehicle</td>
              <td v-for="col in columns" :key="col.key" class="text-right">
                {{ col.label }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.vehicle">
              <td class="whitespace-nowrap">
                <span
                  class="inline-block w-3 h-3 rounded-sm mr-2 align-middle"
                  :style="{ backgroundColor: row.colour }"
                ></span
                >{{ row.name }}
              </td>
              <td
                v-for="col in columns"
                :key="col.key"
                class="text-right"
                :title="col.abbreviated ? exactNumber(row[col.key]) : ''"
              >
                {{ col.abbreviated ? abbreviate(row[col.key]) : row[col.key] }}
              </td>
            </tr>
            <tr class="font-bold border-t border-white">
              <td>Total</td>
              <td
                v-for="col in columns"
                :key="col.key"
                class="text-right"
                :title="col.abbreviated ? exactNumber(totals[col.key]) : ''"
              >
                {{
                  col.abbreviated
                    ? abbreviate(totals[col.key])
                    : totals[col.key]
                }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
      <div class="col-span-12 lg:col-span-3">
        <PieChart
          :chart-data="chartData"
          :chart-options="chartOptions"
          :styles="{ height: '260px' }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { killDeathRatio } from '~/utilities/NumberFormat'
import AbbreviateNumbers from '~/mixins/AbbreviateNumbers'
import {
  ProfileSummaryInterface,
  ProfileVehicleRowInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { Vehicle } from '~/ps2alerts-constants/vehicle'
import { characterVehicles, outfitVehicles } from '~/utilities/ProfileApi'
import { commonChartOptions } from '~/constants/CommonChartOptions'
import { formatDateTime } from '~/utilities/TimeHelper'
import { DATE_FORMAT } from '~/constants/Time'

const PALETTE = [
  '#e53e3e',
  '#dd6b20',
  '#d69e2e',
  '#38a169',
  '#319795',
  '#3182ce',
  '#5a67d8',
  '#805ad5',
]
const OTHER_COLOUR = '#718096'
// v4.3.2 reinstated per-player vehicle stats; matches the API's constant
const VEHICLE_TRACKING_START = '2022-09-10T00:00:00Z'

const COLUMNS = [
  { key: 'kills', label: 'Kills', abbreviated: true },
  { key: 'vehicleKills', label: 'vs Vehicles', abbreviated: true },
  { key: 'infantryKills', label: 'vs Infantry', abbreviated: true },
  { key: 'deaths', label: 'Deaths', abbreviated: true },
  { key: 'kd', label: 'K/D', abbreviated: false },
  { key: 'roadkills', label: 'Roadkills', abbreviated: true },
  { key: 'teamKills', label: 'TKs', abbreviated: true },
  { key: 'teamKilled', label: 'TKed', abbreviated: true },
  { key: 'suicides', label: 'Suicides', abbreviated: true },
]

const SUMMED = [
  'kills',
  'vehicleKills',
  'infantryKills',
  'deaths',
  'roadkills',
  'teamKills',
  'teamKilled',
  'suicides',
] as const

// "MAGRIDER" -> "Magrider", "ANT" stays as the constants spell it
const vehicleName = (id: number): string => {
  const key = Vehicle[id]

  if (!key) {
    return `Vehicle ${id}`
  }

  return key
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const share = (part: number, whole: number): string =>
  `${(whole > 0 ? (part / whole) * 100 : 0).toFixed(1)}%`

// Per-vehicle combat for a player, or summed over an outfit's members
export default Vue.extend({
  name: 'ProfileVehicles',
  mixins: [AbbreviateNumbers],
  props: {
    summary: {
      type: Object as () => ProfileSummaryInterface,
      required: true,
    },
  },
  data() {
    return {
      raw: [] as ProfileVehicleRowInterface[],
      members: 0,
      truncated: false,
      loaded: false,
      error: '',
      requestSeq: 0,
      columns: COLUMNS,
    }
  },
  computed: {
    // Fallbacks keep the section working against an API that predates these fields
    trackingSince(): string {
      return formatDateTime(
        new Date(this.summary.vehiclesTrackedSince ?? VEHICLE_TRACKING_START),
        DATE_FORMAT
      )
    },
    vehicleAlerts(): number {
      return this.summary.totals.vehicleAlerts ?? 0
    },
    // Outfit totals ignore the days filter, so a filtered alert count would not match them
    showCoverage(): boolean {
      return (
        this.summary.totals.vehicleAlerts !== undefined &&
        this.summary.totals.alerts > 0 &&
        (this.summary.type === 'character' || !this.summary.days)
      )
    },
    daysApply(): boolean {
      return this.summary.type === 'character' && !!this.summary.days
    },
    totalKills(): number {
      return this.raw.reduce(
        (sum, row) => sum + row.vehicleKills + row.infantryKills,
        0
      )
    },
    // Sorted here too, so the pie's named slices are always the top vehicles whatever order the API sends
    rows(): Record<string, any>[] {
      return this.raw
        .map((row) => ({ row, kills: row.vehicleKills + row.infantryKills }))
        .sort((a, b) => b.kills - a.kills)
        .map(({ row, kills }, index) => ({
          ...row,
          name: vehicleName(row.vehicle),
          colour: PALETTE[index] ?? OTHER_COLOUR,
          kills,
          kd: killDeathRatio(kills, row.deaths),
        }))
    },
    totals(): Record<string, number | string> {
      const totals: Record<string, number | string> = {}

      SUMMED.forEach((key) => {
        totals[key] = this.rows.reduce((sum, row) => sum + row[key], 0)
      })
      totals.kd = killDeathRatio(
        totals.kills as number,
        totals.deaths as number
      )

      return totals
    },
    // The top vehicles by kills get a slice each; everything past the palette shares one
    slices(): { label: string; colour: string; kills: number }[] {
      const named = this.rows.slice(0, PALETTE.length).map((row) => ({
        label: row.name,
        colour: row.colour,
        kills: row.kills,
      }))
      const rest = this.rows
        .slice(PALETTE.length)
        .reduce((sum, row) => sum + row.kills, 0)

      return rest > 0
        ? [...named, { label: 'Other', colour: OTHER_COLOUR, kills: rest }]
        : named
    },
    chartData(): Record<string, any> {
      return {
        labels: this.slices.map((slice) => slice.label),
        datasets: [
          {
            backgroundColor: this.slices.map((slice) => slice.colour),
            borderColor: '#2d3748',
            borderWidth: 2,
            data: this.slices.map((slice) => slice.kills),
          },
        ],
      }
    },
    chartOptions(): Record<string, any> {
      return {
        ...commonChartOptions.root,
        interaction: { intersect: true, mode: 'nearest' },
        plugins: {
          ...commonChartOptions.root.plugins,
          legend: { display: false },
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              label: (context: { label: string; parsed: number }) =>
                ` ${
                  context.label
                }: ${context.parsed.toLocaleString()} kills (${share(
                  context.parsed,
                  this.totalKills
                )})`,
            },
          },
        },
      }
    },
  },
  watch: {
    summary() {
      this.load()
    },
  },
  created() {
    this.load()
  },
  methods: {
    async load(): Promise<void> {
      const seq = ++this.requestSeq
      this.loaded = false
      this.error = ''

      try {
        let rows: ProfileVehicleRowInterface[]
        let members = 0
        let truncated = false

        if (this.summary.type === 'outfit') {
          const result = await outfitVehicles(
            this.summary.id,
            this.summary.world
          )
          rows = result.rows
          members = result.members
          truncated = result.truncated
        } else {
          rows = await characterVehicles({
            type: 'character',
            id: this.summary.id,
            world: this.summary.world,
            days: this.summary.days,
          })
        }

        if (seq !== this.requestSeq) {
          return
        }

        this.raw = rows
        this.members = members
        this.truncated = truncated
      } catch (e: any) {
        if (seq !== this.requestSeq) {
          return
        }

        // Old rows would sit under the newly chosen filter
        this.raw = []
        this.error = `Vehicle stats could not be loaded (${
          e?.response?.status === 503
            ? 'still warming up after an update'
            : e?.message ?? 'network error'
        }).`
      } finally {
        if (seq === this.requestSeq) {
          this.loaded = true
        }
      }
    },
  },
})
</script>

<style scoped>
/* Nine stat columns have to share the row with the pie */
.compact >>> td {
  padding: 0 8px !important;
}
</style>
