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
      <div class="aspect-square relative self-center place-self-center place-items-center w-12 lg:w-24 3xl:w-32">
        <img
          class="absolute inset-0 m-auto"
          :src="alert.outfitwars.teams.red.id | outfitImage"
          :alt="alert.outfitwars.teams.red.faction | factionShortName"
          @error="imageUrlAltRed"
        />
        <img
          ref="redFaction"
          class="absolute right-0 bottom-0 w-1/4"
          :src="alert.outfitwars.teams.red.faction | factionImage"
          :alt="alert.outfitwars.teams.red.faction | factionShortName"
        />
      </div>
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
      <div class="aspect-square relative self-center place-self-center place-items-center w-12 lg:w-24 3xl:w-32">
        <img
          class="absolute inset-0 m-auto"
          :src="alert.outfitwars.teams.blue.id | outfitImage"
          :alt="alert.outfitwars.teams.blue.faction | factionShortName"
          @error="imageUrlAltBlue"
        />
        <img
          ref="blueFaction"
          class="absolute left-0 bottom-0 w-1/4"
          :src="alert.outfitwars.teams.blue.faction | factionImage"
          :alt="alert.outfitwars.teams.blue.faction | factionShortName"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import factionImage from '~/filters/FactionImage'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'

export default Vue.extend({
  name: "TeamInfo",
  components: {

  },
  props: {
    alert: {
      type: Object as () => InstanceOutfitWarsResponseInterface,
      default: {},
      required: true,
    }
  },
  methods: {
    imageUrlAltBlue(event: Event) {
      if(event.target){
        (event.target as HTMLImageElement).src = factionImage(this.alert.outfitwars?.teams?.blue?.faction);
        (this.$refs["blueFaction"] as HTMLImageElement).classList.add("hidden");
      }
    },
    imageUrlAltRed(event: Event) {
      if(event.target){
        (event.target as HTMLImageElement).src = factionImage(this.alert.outfitwars?.teams?.red?.faction)
        (this.$refs["redFaction"] as HTMLImageElement).classList.add("hidden");
      }
    }
  }
})
</script>