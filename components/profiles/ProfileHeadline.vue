<template>
  <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
    <div v-for="tile in tiles" :key="tile.label" class="stat-tile">
      <div class="stat-value" :class="tile.classes">{{ tile.value }}</div>
      <div class="stat-label">
        {{ tile.label }}
        <InfoTooltip v-if="tile.tooltip" :tooltip="tile.tooltip"></InfoTooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProfileMetricsInterface } from '~/interfaces/profiles/ProfileMetricsInterface'

interface Tile {
  label: string
  value: string
  classes?: string
  tooltip?: string
}

const compact = (value: number): string =>
  new Intl.NumberFormat('en-GB', {
    notation: value >= 100000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)

// The at-a-glance strip at the top of a profile
export default Vue.extend({
  name: 'ProfileHeadline',
  props: {
    statistics: {
      type: Object as () => ProfileMetricsInterface,
      required: true,
    },
    faction: {
      type: Number,
      required: true,
    },
  },
  computed: {
    tiles(): Tile[] {
      const totals = this.statistics.totals
      let wins = 0
      let decided = 0

      this.statistics.alerts.forEach((alert) => {
        const result = alert.instanceDetails?.result

        if (!result || result.draw || !result.victor) {
          return
        }

        decided++

        if (result.victor === this.faction) {
          wins++
        }
      })

      const winRate = decided > 0 ? (wins / decided) * 100 : 0
      const kd = totals.deaths > 0 ? totals.kills / totals.deaths : totals.kills
      const hsr = totals.kills > 0 ? (totals.headshots / totals.kills) * 100 : 0

      return [
        { label: 'Alerts', value: compact(totals.alerts) },
        {
          label: 'Win rate',
          value: `${winRate.toFixed(1)}%`,
          classes: winRate >= 50 ? 'text-green-400' : 'text-red-400',
          tooltip: `${wins} won of ${decided} decided alerts. Draws and alerts still in progress are left out.`,
        },
        { label: 'Kills', value: compact(totals.kills) },
        {
          label: 'K/D',
          value: kd.toFixed(2),
          classes: kd >= 1 ? 'text-green-400' : 'text-red-400',
        },
        { label: 'HSR', value: `${hsr.toFixed(1)}%` },
        {
          label: 'KPM',
          value: totals.kpm.toFixed(2),
          tooltip: `Average kills per minute across the ${totals.xpmAlerts} alerts with per-minute tracking.`,
        },
      ]
    },
  },
})
</script>

<style scoped lang="scss">
.stat-tile {
  @apply rounded p-3 text-center;
  background-color: rgba(48, 58, 64, 0.8);
}
.stat-value {
  @apply text-3xl font-bold leading-tight;
}
.stat-label {
  @apply text-xs uppercase tracking-wide text-gray-400 mt-1;
}
</style>
