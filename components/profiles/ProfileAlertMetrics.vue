<template>
  <div>
    <p v-if="error" class="text-center text-red-400 mb-2">
      {{ error }}
      <button class="btn btn-sm ml-2" @click="fetchPage">Retry</button>
    </p>
    <v-data-table
      class="datatable"
      item-key="instance"
      :headers="headers"
      :items="rows"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      v-bind="tableConfig"
    >
      <template #[`item.instance`]="{ item }">
        <NuxtLink :to="`/alert/${item.instance}`" class="label gray border">
          {{ item.instance }}
        </NuxtLink>
      </template>
      <template #[`item.victor`]="{ item }">
        <span v-if="item.victor === null" class="label">-</span>
        <span v-else-if="item.victor === 'draw'" class="label gray">Draw</span>
        <template v-else>
          <span v-if="item.victor === summary.faction" class="label green"
            >Yes</span
          >
          <span v-else class="label">No</span>
          <span class="label" :class="item.victor | factionShortName">{{
            item.victor | factionShortName
          }}</span>
        </template>
      </template>
      <template #[`item.outfit`]="{ item }">
        <NuxtLink
          v-if="item.outfit && item.outfit.id"
          :to="item.outfitLink"
          class="label gray border"
          :title="item.outfit.name"
        >
          <span v-if="item.outfit.tag" class="font-mono">{{
            item.outfit.tag
          }}</span>
          <span v-else>{{ item.outfit.name }}</span>
        </NuxtLink>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { killDeathRatio } from '~/utilities/NumberFormat'
import {
  ProfileAlertRowInterface,
  ProfileSummaryInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { DataTableConfig } from '~/constants/DataTableConfig'
import { dateTimeFormat } from '~/filters/DateTimeFormat'
import zoneNameFilter from '~/filters/ZoneName'
import { Bracket } from '~/ps2alerts-constants/bracket'
import bracketName from '~/filters/BracketName'
import { profileApi, profileLink } from '~/utilities/ProfileApi'

interface Header {
  text: string
  value: string
  align?: string
  sortable?: boolean
  filterable?: boolean
  class?: string
  cellClass?: string
}

interface TableOptions {
  page: number
  itemsPerPage: number
  sortBy: string[]
  sortDesc: boolean[]
}

// Columns the API can sort on, keyed by header value
const SORTABLE: Record<string, string> = {
  instance: 'instance',
  timeStarted: 'timeStarted',
  bracket: 'bracket',
  kills: 'kills',
  deaths: 'deaths',
  headshots: 'headshots',
  teamKills: 'teamKills',
  teamKilled: 'teamKilled',
  suicides: 'suicides',
  participants: 'participants',
}

const column = (text: string, value: string, centred = true): Header => ({
  text,
  value,
  align: centred ? 'middle' : 'left',
  sortable: value in SORTABLE,
  filterable: false,
  class: 'whitespace-nowrap',
  cellClass: centred ? 'text-center' : 'whitespace-nowrap',
})

const ratio = (numerator: number, denominator: number, scale = 1): string =>
  denominator > 0 ? ((numerator / denominator) * scale).toFixed(2) : '0.00'

// One page of the subject's alerts at a time, sorted and paged by the API
export default Vue.extend({
  name: 'ProfileAlertMetrics',
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
      requestSeq: 0,
      options: {
        page: 1,
        itemsPerPage: 20,
        sortBy: ['instance'],
        sortDesc: [true],
      } as TableOptions,
      tableConfig: {
        ...DataTableConfig,
        'sort-by': ['instance'],
        'sort-desc': [true],
        'items-per-page': 20,
        'must-sort': true,
      },
    }
  },
  computed: {
    headers(): Header[] {
      const identity: Header[] =
        this.summary.type === 'outfit'
          ? [column('Players', 'participants')]
          : [column('Outfit', 'outfit', false), column('BR', 'battleRank')]

      return [
        column('ID', 'instance', false),
        column('Date', 'timeStarted', false),
        column('Cont', 'cont', false),
        column('Bracket', 'bracket', false),
        column('Victor', 'victor', false),
        ...identity,
        column('Kills', 'kills'),
        column('Deaths', 'deaths'),
        column('KD', 'kd'),
        column('HS', 'headshots'),
        column('HSR%', 'hsr'),
        column('TKs', 'teamKills'),
        column('TKed', 'teamKilled'),
        column('Sui', 'suicides'),
      ]
    },
  },
  watch: {
    summary() {
      this.options = { ...this.options, page: 1 }
      this.fetchPage()
    },
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
      const seq = ++this.requestSeq
      const { page, itemsPerPage, sortBy, sortDesc } = this.options
      this.loading = true
      this.error = ''

      try {
        const result = await profileApi.alerts(
          {
            type: this.summary.type,
            id: this.summary.id,
            world: this.summary.world,
            days: this.summary.days,
          },
          page,
          itemsPerPage,
          SORTABLE[sortBy[0]] ?? 'instance',
          sortDesc[0] === false ? 'asc' : 'desc'
        )

        if (seq !== this.requestSeq) {
          return
        }

        this.rows = result.items.map((row) => this.parseRow(row))
        this.total = result.total
      } catch (e: any) {
        if (seq !== this.requestSeq) {
          return
        }

        this.error = `The alert history could not be loaded (${
          e?.message ?? 'network error'
        }).`
      } finally {
        if (seq === this.requestSeq) {
          this.loading = false
        }
      }
    },
    parseRow(alert: ProfileAlertRowInterface): Record<string, any> {
      const details = alert.details
      const kills = alert.kills ?? 0
      const deaths = alert.deaths ?? 0
      const headshots = alert.headshots ?? 0

      return {
        instance: alert.instance,
        timeStarted: details?.timeStarted
          ? dateTimeFormat(details.timeStarted)
          : 'Unknown',
        cont: details?.zone ? zoneNameFilter(details.zone) : 'Unknown',
        bracket: bracketName(details?.bracket ?? Bracket.UNKNOWN),
        victor: details?.draw ? 'draw' : details?.victor || null,
        outfit: alert.outfit,
        outfitLink: alert.outfit
          ? profileLink('outfit', alert.outfit.id, alert.outfit.world)
          : '',
        battleRank: alert.battleRank ?? 0,
        participants: alert.participants ?? 0,
        kills,
        deaths,
        headshots,
        teamKills: alert.teamKills ?? 0,
        teamKilled: alert.teamKilled ?? 0,
        suicides: alert.suicides ?? 0,
        kd: killDeathRatio(kills, deaths),
        hsr: ratio(headshots, kills, 100),
      }
    },
  },
})
</script>
