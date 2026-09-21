<template>
  <div>
    <p class="text-xs text-gray-400 text-center mb-2">
      Characters whose last known outfit is this one. Membership updates once a
      day when a player is next seen, and is not affected by the days filter.
    </p>
    <p v-if="error" class="text-center text-red-400 mb-2">
      {{ error }}
      <button class="btn btn-sm ml-2" @click="fetchPage">Retry</button>
    </p>
    <v-data-table
      class="datatable"
      item-key="id"
      :headers="headers"
      :items="rows"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      v-bind="tableConfig"
    >
      <template #[`item.name`]="{ item }">
        <NuxtLink :to="item.link" class="label gray border whitespace-nowrap">
          {{ item.name }}
        </NuxtLink>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ProfileMemberRowInterface,
  ProfileSummaryInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { DataTableConfig } from '~/constants/DataTableConfig'
import { outfitMembers, profileLink } from '~/utilities/ProfileApi'

interface TableOptions {
  page: number
  itemsPerPage: number
  sortBy: string[]
  sortDesc: boolean[]
}

// Header value -> API sort field
const SORTABLE: Record<string, string> = {
  name: 'character.name',
  br: 'character.adjustedBattleRank',
  kills: 'kills',
  deaths: 'deaths',
  headshots: 'headshots',
  teamKills: 'teamKills',
  suicides: 'suicides',
}

const ratio = (numerator: number, denominator: number, scale = 1): string =>
  denominator > 0 ? ((numerator / denominator) * scale).toFixed(2) : '0.00'

const column = (text: string, value: string, centred = true) => ({
  text,
  value,
  align: centred ? 'middle' : 'left',
  sortable: value in SORTABLE,
  filterable: false,
  class: 'whitespace-nowrap',
  cellClass: centred ? 'text-center' : 'whitespace-nowrap',
})

// One page of an outfit's members at a time, sorted and paged by the API
export default Vue.extend({
  name: 'ProfileMembers',
  props: {
    summary: {
      type: Object as () => ProfileSummaryInterface,
      required: true,
    },
  },
  data() {
    return {
      rows: [] as Record<string, any>[],
      total: 0,
      loading: false,
      error: '',
      options: {
        page: 1,
        itemsPerPage: 20,
        sortBy: ['kills'],
        sortDesc: [true],
      } as TableOptions,
      tableConfig: {
        ...DataTableConfig,
        'sort-by': ['kills'],
        'sort-desc': [true],
        'items-per-page': 20,
        'must-sort': true,
      },
      headers: [
        column('Player', 'name', false),
        column('BR', 'br'),
        column('Kills', 'kills'),
        column('Deaths', 'deaths'),
        column('KD', 'kd'),
        column('HS', 'headshots'),
        column('HSR%', 'hsr'),
        column('TKs', 'teamKills'),
        column('Sui', 'suicides'),
      ],
    }
  },
  watch: {
    options: {
      handler() {
        this.fetchPage()
      },
      deep: true,
    },
  },
  created() {
    this.fetchPage()
  },
  methods: {
    async fetchPage(): Promise<void> {
      const { page, itemsPerPage, sortBy, sortDesc } = this.options
      this.loading = true
      this.error = ''

      try {
        const result = await outfitMembers(
          this.summary.id,
          this.summary.world,
          page,
          itemsPerPage,
          SORTABLE[sortBy[0]] ?? 'kills',
          sortDesc[0] === false ? 'asc' : 'desc'
        )

        this.rows = result.items.map((row) => this.parseRow(row))
        this.total = result.total
      } catch (e: any) {
        this.error = `The member list could not be loaded (${
          e?.message ?? 'network error'
        }).`
      } finally {
        this.loading = false
      }
    },
    parseRow(member: ProfileMemberRowInterface): Record<string, any> {
      const kills = member.kills ?? 0
      const deaths = member.deaths ?? 0
      const headshots = member.headshots ?? 0

      return {
        id: member.character.id,
        name: member.character.name,
        link: profileLink(
          'character',
          member.character.id,
          member.character.world
        ),
        br:
          member.character.adjustedBattleRank ??
          member.character.battleRank ??
          0,
        kills,
        deaths,
        headshots,
        teamKills: member.teamKills ?? 0,
        suicides: member.suicides ?? 0,
        kd: ratio(kills, deaths),
        hsr: ratio(headshots, kills, 100),
      }
    },
  },
})
</script>
