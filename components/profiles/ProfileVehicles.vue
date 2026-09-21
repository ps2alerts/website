<template>
  <div>
    <p v-if="error" class="text-center text-red-400 mb-2">
      {{ error }}
      <button class="btn btn-sm ml-2" @click="load">Retry</button>
    </p>
    <p v-else-if="loaded && rows.length === 0" class="text-center p-2">
      No vehicle activity recorded<span v-if="summary.days">
        in the last {{ summary.days }} days</span
      >.
    </p>
    <v-data-table
      v-else
      class="datatable"
      item-key="vehicle"
      :headers="headers"
      :items="rows"
      :loading="!loaded"
      v-bind="tableConfig"
      disable-pagination
      hide-default-footer
    >
      <template
        v-for="col in [
          'kills',
          'vehicleKills',
          'infantryKills',
          'deaths',
          'roadkills',
          'teamKills',
          'teamKilled',
          'suicides',
        ]"
        #[`item.${col}`]="{ value }"
      >
        <span :key="col" :title="exactNumber(value)">{{
          abbreviate(value)
        }}</span>
      </template>
    </v-data-table>
    <p class="text-xs text-gray-400 text-center mt-1">
      Kills and deaths while in the vehicle. K/D counts kills of both vehicles
      and infantry.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AbbreviateNumbers from '~/mixins/AbbreviateNumbers'
import {
  ProfileSummaryInterface,
  ProfileVehicleRowInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { ProfileAlertsCombatMetricsTableConfig } from '~/constants/DataTableConfig'
import { Vehicle } from '~/ps2alerts-constants/vehicle'
import { characterVehicles } from '~/utilities/ProfileApi'

const centred = (text: string, value: string) => ({
  text,
  value,
  align: 'middle',
  filterable: false,
  class: 'whitespace-nowrap',
  cellClass: 'text-center',
})

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

// Per-vehicle combat for a player
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
      rows: [] as Record<string, string | number>[],
      loaded: false,
      error: '',
      tableConfig: {
        ...ProfileAlertsCombatMetricsTableConfig,
        'sort-by': ['kills'],
        'sort-desc': [true],
      },
      headers: [
        { text: 'Vehicle', align: 'left', sortable: true, value: 'name' },
        centred('Kills', 'kills'),
        centred('Vehicle kills', 'vehicleKills'),
        centred('Infantry kills', 'infantryKills'),
        centred('Deaths', 'deaths'),
        centred('K/D', 'kd'),
        centred('Roadkills', 'roadkills'),
        centred('TKs', 'teamKills'),
        centred('TKed', 'teamKilled'),
        centred('Suicides', 'suicides'),
      ],
    }
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
      this.loaded = false
      this.error = ''

      try {
        const rows = await characterVehicles({
          type: 'character',
          id: this.summary.id,
          world: this.summary.world,
          days: this.summary.days,
        })

        this.rows = rows.map((row: ProfileVehicleRowInterface) => {
          const kills = row.vehicleKills + row.infantryKills

          return {
            vehicle: row.vehicle,
            name: vehicleName(row.vehicle),
            kills,
            vehicleKills: row.vehicleKills,
            infantryKills: row.infantryKills,
            deaths: row.deaths,
            kd:
              row.deaths > 0
                ? (kills / row.deaths).toFixed(2)
                : kills.toFixed(2),
            roadkills: row.roadkills,
            teamKills: row.teamKills,
            teamKilled: row.teamKilled,
            suicides: row.suicides,
          }
        })
      } catch (e: any) {
        this.error = `Vehicle stats could not be loaded (${
          e?.message ?? 'network error'
        }).`
      } finally {
        this.loaded = true
      }
    },
  },
})
</script>
