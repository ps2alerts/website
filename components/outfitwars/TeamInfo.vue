<template>
  <div class="card flex flex-col teams-background">
    <div class="tag section">Team Info</div>
    <div 
      v-if="!(alert.outfitwars && alert.outfitwars.teams && alert.outfitwars.teams.red && alert.outfitwars.teams.blue)"
      class="text-center flex-1"
    >
      Waiting for the first combat event...
    </div>
    <div
      v-else
      class="flex justify-between items-center flex-1"
    >
      <TeamLogo 
        class="self-center place-self-center w-12 lg:w-24 3xl:w-32"
        :outfitId="alert.outfitwars.teams.red.id"
        :outfitFaction="alert.outfitwars.teams.red.faction"
      />
      <div class="relative place-self-stretch grow">
        <div class="absolute top-0 left-2 2xl:text-xl mb-2 lg:mb-0">
          <div>
            <span v-if="alert.outfitwars.teams.red.tag">
              [{{ alert.outfitwars.teams.red.tag }}]
            </span>
            {{ alert.outfitwars.teams.red.name.trim() }}
          </div>
          <div class="text-xs">
            {{ alert.outfitwars.teams.red.faction | factionName }}
          </div>
        </div>
        <div class="absolute flex inset-0 place-content-center">
          <div class="self-center">
            vs.
          </div>
        </div>
        <div class="absolute bottom-0 right-2 text-right 3xl:text-xl mb-2 lg:mb-0">
          <div class="text-xs">
            {{ alert.outfitwars.teams.blue.faction | factionName }}
          </div>
          <div>
            <span v-if="alert.outfitwars.teams.blue.tag">
              [{{ alert.outfitwars.teams.blue.tag }}]
            </span>
            {{ alert.outfitwars.teams.blue.name.trim() }}
          </div>
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

<style lang="scss" scoped>

.teams-background {
  background: linear-gradient(135deg, rgba(155, 44, 44, 0.5) 0 50.75%, black, rgba(43, 108, 176, 0.5) 51.25% 100%);
}

</style>