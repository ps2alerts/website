<template>
  <div>
    <p class="text-xs text-gray-400 text-center mb-2">
      Who the kills landed on. NSO kills count wherever the operative was
      fighting for the other side.
    </p>
    <div class="faction-bar flex rounded overflow-hidden text-sm font-bold">
      <div
        v-for="segment in segments"
        :key="segment.key"
        class="flex items-center justify-center whitespace-nowrap"
        :class="segment.classes"
        :style="{ width: `${segment.share}%` }"
        :title="`${segment.label}: ${
          segment.count
        } kills (${segment.share.toFixed(1)}%)`"
      >
        <span v-if="segment.share >= 8"
          >{{ segment.label }} {{ segment.share.toFixed(1) }}%</span
        >
      </div>
    </div>
    <div class="flex flex-wrap justify-center gap-4 mt-2 text-sm">
      <span v-for="segment in segments" :key="segment.key">
        <span class="label" :class="segment.classes">{{ segment.label }}</span>
        {{ segment.count.toLocaleString() }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProfileSummaryInterface } from '~/interfaces/profiles/ProfileMetricsInterface'

interface Segment {
  key: string
  label: string
  classes: string
  count: number
  share: number
}

const FACTIONS = [
  { key: 'vs', label: 'VS', classes: 'bg-vs' },
  { key: 'nc', label: 'NC', classes: 'bg-nc' },
  { key: 'tr', label: 'TR', classes: 'bg-tr' },
  { key: 'nso', label: 'NSO', classes: 'bg-nso' },
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
      const kills = this.summary.totals.factionKills
      const total = FACTIONS.reduce((sum, f) => sum + (kills[f.key] ?? 0), 0)

      return FACTIONS.map((f) => ({
        key: f.key,
        label: f.label,
        classes: f.classes,
        count: kills[f.key] ?? 0,
        share: total > 0 ? ((kills[f.key] ?? 0) / total) * 100 : 0,
      })).filter((segment) => segment.count > 0)
    },
  },
})
</script>

<style scoped lang="scss">
.faction-bar {
  height: 2rem;
}
</style>
