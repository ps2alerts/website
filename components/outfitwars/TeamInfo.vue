<template>
  <div class="card flex flex-col" :class="backgroundClass">
    <div class="tag section">Team Info</div>
    <div
      v-if="
        !(
          outfitwar.outfitwars &&
          outfitwar.outfitwars.teams &&
          outfitwar.outfitwars.teams.red &&
          outfitwar.outfitwars.teams.blue
        )
      "
      class="text-center flex-1"
    >
      Waiting for the first combat event...
    </div>
    <div v-else class="flex relative justify-between items-center flex-1">
      <TeamLogo
        class="self-center place-self-center w-12 lg:w-24 2xl:w-32"
        :outfit-id="outfitwar.outfitwars.teams.red.id"
        :outfit-faction="outfitwar.outfitwars.teams.red.faction"
        :loser="outfitwar.result && outfitwar.result.victor === 2"
      />
      <div class="relative place-self-stretch grow">
        <div
          class="absolute top-0 left-2 text-xs sm:text-[1.5vw] xl:text-xl 2xl:text-2xl my-2 lg:mb-0"
        >
          <div class="leading-tight">
            <span v-if="outfitwar.outfitwars.teams.red.tag">
              [{{ outfitwar.outfitwars.teams.red.tag }}]
            </span>
            {{ outfitwar.outfitwars.teams.red.name.trim() }}
          </div>
          <div
            class="text-xs label"
            :class="outfitwar.outfitwars.teams.red.faction | factionShortName"
          >
            {{ outfitwar.outfitwars.teams.red.faction | factionName }}
          </div>
          <div
            v-if="outfitwar.result && outfitwar.result.victor === 3"
            class="text-xs label bg-amber-500"
          >
            Winner!
          </div>
        </div>
        <div
          class="absolute bottom-0 right-2 text-right text-xs md:text-[1.5vw] xl:text-xl 2xl:text-2xl mb-2 lg:mb-0"
        >
          <div
            v-if="outfitwar.result && outfitwar.result.victor === 2"
            class="text-xs label bg-amber-500"
          >
            Winner!
          </div>
          <div
            class="text-xs label"
            :class="outfitwar.outfitwars.teams.blue.faction | factionShortName"
          >
            {{ outfitwar.outfitwars.teams.blue.faction | factionName }}
          </div>
          <div class="leading-tight">
            <span v-if="outfitwar.outfitwars.teams.blue.tag">
              [{{ outfitwar.outfitwars.teams.blue.tag }}]
            </span>
            {{ outfitwar.outfitwars.teams.blue.name.trim() }}
          </div>
        </div>
      </div>
      <TeamLogo
        class="self-center place-self-center w-12 lg:w-24 2xl:w-32"
        :outfit-id="outfitwar.outfitwars.teams.blue.id"
        :outfit-faction="outfitwar.outfitwars.teams.blue.faction"
        :badge-left="true"
        :loser="outfitwar.result && outfitwar.result.victor === 3"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TeamLogo from './TeamLogo.vue'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { Faction } from '~/ps2alerts-constants/faction'
import { Team } from '~/ps2alerts-constants/outfitwars/team'
import { World } from '~/ps2alerts-constants/world'
import { Zone } from '~/ps2alerts-constants/zone'

export default Vue.extend({
  name: 'TeamInfo',
  components: {
    TeamLogo,
  },
  props: {
    outfitwar: {
      type: Object as () => InstanceOutfitWarsResponseInterface,
      default(): InstanceOutfitWarsResponseInterface {
        return {
          instanceId: '',
          world: World.CONNERY,
          zone: Zone.INDAR,
          timeStarted: '1970-01-01T00:00:00',
          duration: 0,
          state: 0,
          result: {
            cutoff: 0,
            outOfPlay: 0,
            perBasePercentage: 0,
            victor: null,
            blue: 0, red: 0
          },
          zoneInstanceId: 0,
          outfitwars: {phase: 0, round: 0},
        }
      },
      required: true,
    },
  },
  computed: {
    backgroundClass() {
      if (this.outfitwar.result?.victor === Team.RED) {
        return 'teams-background winner-red'
      } else if (this.outfitwar.result?.victor === Team.BLUE) {
        return 'teams-background winner-blue'
      }
      return 'teams-background'
    },
  },
  methods: {
    factionBackground(value: Faction) {
      switch (value) {
        case Faction.NONE:
        case Faction.NS_OPERATIVES:
          return 'bg-nso bg-solid'
        case Faction.VANU_SOVEREIGNTY:
          return 'bg-vs bg-solid'
        case Faction.NEW_CONGLOMERATE:
          return 'bg-nc bg-solid'
        case Faction.TERRAN_REPUBLIC:
          return 'bg-tr bg-solid'
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.teams-background {
  background: linear-gradient(
    150deg,
    rgba(155, 44, 44, 0.5) 0 51.75%,
    white,
    rgba(43, 108, 176, 0.5) 52.2% 100%
  );

  &.winner-red {
    background: linear-gradient(
      150deg,
      rgba(155, 44, 44, 0.9) 0 51.75%,
      red,
      rgba(155, 44, 44, 0.2),
      rgba(43, 108, 176, 0.5) 52.2% 100%
    );
  }

  &.winner-blue {
    background: linear-gradient(
      150deg,
      rgba(155, 44, 44, 0.5) 0 51.75%,
      rgba(43, 108, 176, 0.2),
      #53bcff,
      rgba(43, 108, 176, 0.9) 52.2% 100%
    );
  }
}
</style>
