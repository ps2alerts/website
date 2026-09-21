<template>
  <div class="flex justify-center items-end gap-4 mb-2">
    <div class="w-1/3">
      <img
        alt="Server Logo"
        :src="world | worldImage"
        class="mx-auto mb-2 w-full"
      />
      <div class="text-center">
        <b>{{ world | worldName }}</b
        ><br />
        <span class="text-sm label gray">Server</span>
      </div>
    </div>
    <div class="w-1/3">
      <img
        alt="Faction Logo"
        :src="faction | factionImage"
        class="mx-auto mb-2 w-full"
      />
      <div class="text-center" :class="faction | factionTextClass">
        <b>{{ faction | factionName }}</b
        ><br />
        <span class="text-sm label gray">Faction</span>
      </div>
    </div>
    <div class="w-1/3">
      <NuxtLink
        :to="outfitLink"
        :disabled="!linksToOutfit"
        :event="linksToOutfit ? 'click' : ''"
      >
        <div class="mx-auto mb-2 text-center">
          <font-awesome-icon
            :icon="['fas', 'users']"
            class="outfit-icon"
            :class="faction | factionTextClass"
          ></font-awesome-icon>
        </div>
        <div class="text-center">
          <span class="font-bold">
            <span v-if="outfit.tag" class="font-mono mr-1"
              >[{{ outfit.tag }}]</span
            >{{ outfit.name }}</span
          ><br />
          <span class="text-sm label gray mr-2">Outfit</span
          ><span v-if="linksToOutfit" class="label blue border"
            ><font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>
            Stats</span
          >
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PS2AlertsOutfitInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsOutfitInterface'

export default Vue.extend({
  name: 'ProfileLogos',
  props: {
    outfit: {
      type: Object as () => PS2AlertsOutfitInterface,
      required: true,
    },
    faction: {
      type: Number,
      required: true,
    },
    world: {
      type: Number,
      required: true,
    },
    linkOutfit: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    // Outfit IDs 1-4 are the per-faction "-- NONE --" placeholders
    isInOutfit(): boolean {
      return parseInt(this.outfit.id, 10) > 4
    },
    linksToOutfit(): boolean {
      return this.linkOutfit && this.isInOutfit
    },
    outfitLink(): string {
      return `/outfit/${this.outfit.id}`
    },
  },
})
</script>

<style scoped lang="scss">
.outfit-icon {
  font-size: 5rem;
}
</style>
