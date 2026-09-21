<template>
  <div>
    <p class="text-xs text-gray-400 text-center mb-2">
      Who the kills landed on. Kills on your own faction are team kills. NSO
      kills count wherever the operative was fighting for the other side.
    </p>
    <div class="faction-bar flex rounded overflow-hidden text-sm font-bold">
      <v-tooltip v-for="segment in segments" :key="segment.key" bottom>
        <template #activator="{ on, attrs }">
          <div
            class="flex items-center justify-center whitespace-nowrap cursor-default"
            :style="{
              width: `${segment.share}%`,
              backgroundColor: segment.colour,
            }"
            v-bind="attrs"
            v-on="on"
          >
            <span v-if="segment.share >= 8"
              >{{ segment.label }} {{ segment.share.toFixed(1) }}%</span
            >
          </div>
        </template>
        <span
          >{{ segment.label }}: {{ segment.count.toLocaleString() }} kills ({{
            segment.share.toFixed(1)
          }}%)</span
        >
      </v-tooltip>
    </div>
    <div class="flex flex-wrap justify-center gap-4 mt-2 text-sm">
      <span v-for="segment in segments" :key="segment.key">
        <span class="label" :style="{ backgroundColor: segment.colour }">{{
          segment.label
        }}</span>
        {{ abbreviate(segment.count) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProfileSummaryInterface } from '~/interfaces/profiles/ProfileMetricsInterface'
import { commonChartOptions } from '~/constants/CommonChartOptions'
import { abbreviate } from '~/utilities/NumberFormat'

interface Segment {
  key: string
  label: string
  colour: string
  count: number
  share: number
}

// Same faction colours the charts use
const FACTIONS = [
  {
    key: 'vs',
    faction: 1,
    label: 'VS',
    colour: commonChartOptions.datasets.vs.backgroundColor,
  },
  {
    key: 'nc',
    faction: 2,
    label: 'NC',
    colour: commonChartOptions.datasets.nc.backgroundColor,
  },
  {
    key: 'tr',
    faction: 3,
    label: 'TR',
    colour: commonChartOptions.datasets.tr.backgroundColor,
  },
  {
    key: 'nso',
    faction: 4,
    label: 'NSO',
    colour: commonChartOptions.datasets.nsoDraws.backgroundColor,
  },
] as const

// Kills split by the victim's faction
export default Vue.extend({
  name: 'ProfileFactionKills',
  props: {
    summary: {
      type: Object as () => ProfileSummaryInterface,
      required: true,
    },
  },
  computed: {
    segments(): Segment[] {
      const totals = this.summary.totals
      // The aggregator books kills on the subject's own faction as team kills, not under factionKills
      const countOf = (f: (typeof FACTIONS)[number]): number =>
        f.faction === this.summary.faction
          ? totals.teamKills
          : totals.factionKills[f.key] ?? 0
      const total = FACTIONS.reduce((sum, f) => sum + countOf(f), 0)

      return FACTIONS.map((f) => ({
        key: f.key,
        label:
          f.faction === this.summary.faction
            ? `${f.label} (team kills)`
            : f.label,
        colour: f.colour,
        count: countOf(f),
        share: total > 0 ? (countOf(f) / total) * 100 : 0,
      })).filter((segment) => segment.count > 0)
    },
  },
  methods: { abbreviate },
})
</script>

<style scoped lang="scss">
.faction-bar {
  height: 2rem;
}
</style>
