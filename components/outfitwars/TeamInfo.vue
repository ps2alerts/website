<template>
  <div class="card flex flex-col" :class="backgroundClass">
   <div class="tag section">Team Info</div>
    <div 
      v-if="!(alert.outfitwars && alert.outfitwars.teams && alert.outfitwars.teams.red && alert.outfitwars.teams.blue)"
      class="text-center flex-1"
    >
      Waiting for the first combat event...
    </div>
    <div
      v-else
      class="flex relative justify-between items-center flex-1"
    >
      <div class="absolute -top-4 -left-4 w-4 md:w-6 xl:w-8 2xl:w-10 rounded" :class="factionBackground(alert.outfitwars.teams.red.faction)">
        <img
          class="w-4/5 m-auto"
          :src="alert.outfitwars.teams.red.faction | factionImage"
          :alt="alert.outfitwars.teams.red.faction | factionShortName"
        />
      </div>
      <TeamLogo 
        class="self-center place-self-center w-12 lg:w-24 2xl:w-32"
        :outfitId="alert.outfitwars.teams.red.id"
        :outfitFaction="alert.outfitwars.teams.red.faction"
        :loser="alert.result && alert.result.victor === 2"
      />
      <div class="relative place-self-stretch grow">
        <div class="absolute top-0 left-2 text-xs sm:text-[1.5vw] xl:text-xl 2xl:text-2xl mb-2 lg:mb-0">
          <div class="leading-tight">
            <span v-if="alert.outfitwars.teams.red.tag">
              [{{ alert.outfitwars.teams.red.tag }}]
            </span>
            {{ alert.outfitwars.teams.red.name.trim() }}
          </div>
          <div class="text-xs label" :class="alert.outfitwars.teams.red.faction | factionShortName">
            {{ alert.outfitwars.teams.red.faction | factionName }}
          </div>
        </div>
        <div class="absolute flex inset-0 place-content-center">
          <div class="self-center xl:text-xl 2xl:text-2xl 3xl:text-3xl">
            vs.
          </div>
        </div>
        <div class="absolute bottom-0 right-2 text-right text-xs md:text-[1.5vw] xl:text-xl 2xl:text-2xl mb-2 lg:mb-0">
          <div class="text-xs label" :class="alert.outfitwars.teams.blue.faction | factionShortName">
            {{ alert.outfitwars.teams.blue.faction | factionName }}
          </div>
          <div class="leading-tight">
            <span v-if="alert.outfitwars.teams.blue.tag">
              [{{ alert.outfitwars.teams.blue.tag }}]
            </span>
            {{ alert.outfitwars.teams.blue.name.trim() }}
          </div>
        </div>
      </div>
      <TeamLogo 
        class="self-center place-self-center w-12 lg:w-24 2xl:w-32"
        :outfitId="alert.outfitwars.teams.blue.id"
        :outfitFaction="alert.outfitwars.teams.blue.faction"
        :badgeLeft="true"
        :loser="alert.result && alert.result.victor === 3"
      />
      <div class="absolute -right-4 -bottom-4 w-4 md:w-6 xl:w-8 2xl:w-10 rounded" :class="factionBackground(alert.outfitwars.teams.blue.faction)">
        <img
          class="w-4/5 m-auto"
          :src="alert.outfitwars.teams.blue.faction | factionImage"
          :alt="alert.outfitwars.teams.blue.faction | factionShortName"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TeamLogo from './TeamLogo.vue'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { Faction } from '~/ps2alerts-constants/faction'
import { Team } from '~/ps2alerts-constants/outfitwars/team'

export default Vue.extend({
  name: "TeamInfo",
  components: {
    TeamLogo
  },
  props: {
    alert: {
      type: Object as () => InstanceOutfitWarsResponseInterface,
      default: {},
      required: true,
    }
  },
  methods: {
    factionBackground(value: Faction) {
      switch(value) {
        case Faction.NONE:
        case Faction.NS_OPERATIVES:
          return 'bg-nso bg-solid';
        case Faction.VANU_SOVEREIGNTY:
          return 'bg-vs bg-solid';
        case Faction.NEW_CONGLOMERATE:
          return 'bg-nc bg-solid';
        case Faction.TERRAN_REPUBLIC:
          return 'bg-tr bg-solid';
      }
    }
  },
  computed: {
    backgroundClass(){
      if(this.alert.result?.victor === Team.RED) {
        return "teams-background winner-red";
      }
      else if(this.alert.result?.victor === Team.BLUE) {
        return "teams-background winner-blue";
      }
      return "teams-background";
    }
  }
})
</script>

<style lang="scss" scoped>

.teams-background {
  background: linear-gradient(150deg, rgba(155, 44, 44, 0.5) 0 51.5%, black, rgba(43, 108, 176, 0.5) 52% 100%);

  &.winner-red {
    background: linear-gradient(150deg, rgba(155, 44, 44, 0.5) 0 51.25%, gold, black, rgba(43, 108, 176, 0.5) 52.25% 100%);;
  }

  &.winner-blue {
    background: linear-gradient(150deg, rgba(155, 44, 44, 0.5) 0 51.25%, black, gold, rgba(43, 108, 176, 0.5) 52.25% 100%);;
  }
}

</style>