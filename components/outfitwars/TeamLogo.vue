<template>
  <div>
    <div class="aspect-square relative place-items-center">
      <img
        class="absolute inset-0 m-auto"
        :class="loser ? rounding + ' grayscale opacity-40' : rounding"
        :src="outfitId | outfitImage"
        :alt="outfitFaction | factionShortName"
        @error="imageUrlAlt"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Faction } from '~/ps2alerts-constants/faction'
import factionImage from '~/filters/FactionImage'

export default Vue.extend({
  name: 'TeamLogo',
  components: {},
  props: {
    outfitId: {
      type: String,
      default: '',
      required: true,
    },
    outfitFaction: {
      type: Number,
      default: Faction.NONE,
      required: true,
    },
    badgeLeft: {
      type: Boolean,
      default: false,
    },
    loser: {
      type: Boolean,
      default: false,
      required: false,
    },
    rounding: {
      type: String,
      default: 'rounded-lg',
      required: false,
    },
  },
  methods: {
    imageUrlAlt(event: Event) {
      if (event.target) {
        ;(event.target as HTMLImageElement).src = factionImage(
          this.outfitFaction
        )
      }
    },
  },
})
</script>
