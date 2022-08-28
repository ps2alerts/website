<template>
  <div class="aspect-square relative place-items-center">
    <img
      class="absolute inset-0 m-auto"
      :src="outfitId | outfitImage"
      :alt="outfitFaction | factionShortName"
      @error="imageUrlAlt"
    />
    <img
      ref="faction-badge"
      :class="'absolute bottom-0 w-1/4 ' + (badgeLeft ? 'left-0' : 'right-0')"
      :src="outfitFaction | factionImage"
      :alt="outfitFaction | factionShortName"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import factionImage from '~/filters/FactionImage';
import { Faction } from '../../ps2alerts-constants/faction'

export default Vue.extend({
  name: "TeamLogo",
  components: {},
  props: {
    outfitId: {
      type: String,
      default: "",
      required: true,
    },
    outfitFaction: {
      type: Object as () => Faction,
      default: Faction.NONE,
      required: true,
    },
    badgeLeft: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    imageUrlAlt(event: Event) {
      if(event.target){
        (event.target as HTMLImageElement).src = factionImage(this.outfitFaction);
        (this.$refs["faction-badge"] as HTMLImageElement).classList.add("hidden");
      }
    },
  }
})
</script>