<template>
  <div class="col-span-12">
    <div class="text-center">
      <div v-if="alert.ps2alertsEventType !== OUTFIT_WARS_AUG_2022">
        <h1 class="text-4xl">Alert #{{ alert.instanceId }}</h1>
      </div>
      <div v-if="alert.ps2alertsEventType === OUTFIT_WARS_AUG_2022 && alert.outfitwars">
        <h1 class="text-4xl">
          {{ alert.world | worldName }} {{ alert.outfitwars.phase | phaseName }} Round
          {{ alert.outfitwars.round | owRoundByPhase(alert.outfitwars.phase) }}
        </h1>
      </div>
    </div>
    <div v-if="alert.state === 2" class="mb-2 text-center">
      <h2 class="text-2xl">
        {{ victorText }}
        <v-tooltip v-if="alert.result && alert.result.draw === true" bottom>
          <template #activator="{ on, attrs }">
            <font-awesome-icon
              :icon="['fas', 'info-circle']"
              v-bind="attrs"
              v-on="on"
            ></font-awesome-icon>
          </template>
          When alert reaches a draw, the game does a coin flip between the
          drawing factions to gain the continent lock bonus. In terms of the
          metagame, this is a draw.
        </v-tooltip>
      </h2>
    </div>
    <div v-if="alert.state === 1" class="mb-2 text-center text-2xl">
      <remaining-time
        :started="alert.timeStarted"
        :duration="alert.duration"
        show-remaining="true"
      ></remaining-time>
    </div>
    <div class="rounded px-4 py-4 bg-tint relative" :class="victorClass">
      <div class="tag section">
        Result
        <span v-if="alert.result && alert.result.perBasePercentage"
          >({{ alert.result.perBasePercentage.toFixed(1) }}% per base)
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                v-bind="attrs"
                v-on="on"
              ></font-awesome-icon>
            </template>
            Each and every base is worth the same amount of territory. Yes, even
            the 1 minute construction bases.
          </v-tooltip></span
        >
      </div>
      <CountdownSpinner
        v-if="alert.state === 1"
        :percent="updateCountdownPercent"
        update-rate="5000"
      />
      <div v-if="!alert.result" class="text-center">
        Result not available - likely due to Census (the game's API) sending an
        invalid response. This should correct itself next capture.
      </div>
      <FactionSegmentBar
        v-else
        :vs="
          alert.ps2alertsEventType !== OUTFIT_WARS_AUG_2022
            ? alert.result.vs
            : 0
        "
        :nc="
          alert.ps2alertsEventType !== OUTFIT_WARS_AUG_2022
            ? alert.result.nc
            : alert.result.blue
        "
        :tr="
          alert.ps2alertsEventType !== OUTFIT_WARS_AUG_2022
            ? alert.result.tr
            : alert.result.red
        "
        :other="alert.result.cutoff"
        :out-of-play="alert.result.outOfPlay"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FactionSegmentBar from '@/components/common/FactionSegmentBar.vue'
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import { FactionBgClass } from '@/constants/FactionBgClass'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { Phase } from '~/ps2alerts-constants/outfitwars/phase'
import factionOrTeamName from '~/filters/FactionOrTeamName'

export default Vue.extend({
  name: 'AlertResult',
  components: {
    FactionSegmentBar,
  },
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface &
        InstanceOutfitWarsResponseInterface,
      default: {},
      required: true,
    },
    updateCountdownPercent: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      error: null,
      OUTFIT_WARS_AUG_2022: Ps2AlertsEventType.OUTFIT_WARS_AUG_2022,
      CHAMPIONSHIPS: Phase.CHAMPIONSHIPS,
    }
  },
  computed: {
    victorText(): string {
      const isOutfitWars =
        this.alert.ps2alertsEventType ===
        Ps2AlertsEventType.OUTFIT_WARS_AUG_2022
      return this.alert.state === Ps2AlertsEventState.STARTED
        ? 'In progress...'
        : this.alert.result?.draw === true
        ? 'Draw!'
        : `${
            factionOrTeamName(
              this.alert.result?.victor,
              this.alert.ps2alertsEventType
            ) + (isOutfitWars ? ' Team' : '')
          } victory!`
    },
    victorClass(): object {
      if (!this.alert.result || !this.alert.result.victor) {
        return {}
      }
      return {
        'bg-tint': this.alert.state !== Ps2AlertsEventState.ENDED,
        ...FactionBgClass(this.alert.result.victor),
      }
    },
  },
})
</script>
