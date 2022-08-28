<template>
  <div class="card flex flex-col">
    <div class="tag section">Team Info</div>
    <div 
      v-if="!(alert.outfitwars && alert.outfitwars.teams && alert.outfitwars.teams.red && alert.outfitwars.teams.blue)"
      class="text-center flex-1"
    >
      Waiting for the first combat event...
    </div>
    <div
      v-else
      class="flex items-center flex-1"
    >
      <TeamLogo 
        class="self-center place-self-center w-12 lg:w-24 3xl:w-32"
        :outfitId="alert.outfitwars.teams.red.id"
        :outfitFaction="alert.outfitwars.teams.red.faction"
      />
      <div class="grid grid-cols-7 gap-2 justify-center grow">
        <div class="col-start-1 col-span-3 align-bottom text-right 3xl:text-xl mb-2 lg:mb-0">
          <span v-if="alert.outfitwars.teams.red.tag">
            [{{ alert.outfitwars.teams.red.tag }}]
          </span>
          {{ alert.outfitwars.teams.red.name.trim() }}
        </div>
        <div class="col-start-4 col-span-1 align-bottom text-center text-base mb-2 lg:mb-0">
            vs.
        </div>
        <div class="col-end-8 col-span-3 align-bottom text-left 3xl:text-xl mb-2 lg:mb-0">
          <span v-if="alert.outfitwars.teams.blue.tag">
            [{{ alert.outfitwars.teams.blue.tag }}]
          </span>
          {{ alert.outfitwars.teams.blue.name.trim() }}
        </div>
      </div>
      <TeamLogo 
        class="self-center place-self-center w-12 lg:w-24 3xl:w-32"
        :outfitId="alert.outfitwars.teams.blue.id"
        :outfitFaction="alert.outfitwars.teams.blue.faction"
        :badgeLeft="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import factionImage from '~/filters/FactionImage'
import TeamLogo from './TeamLogo.vue'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'

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
})
</script>