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
        <img
          v-if="outfit.id"
          :alt="faction | factionShortName"
          :src="outfit.id | outfitImage"
          class="mx-auto mb-2 w-full"
          @error="outfitImageAlt"
        />
      </NuxtLink>
      <div class="text-center">
        <NuxtLink
          :to="outfitLink"
          :disabled="!linksToOutfit"
          :event="linksToOutfit ? 'click' : ''"
        >
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
        </NuxtLink>
        <a
          v-if="outfitLogoMissing && isInOutfit"
          href="https://www.outfit-tracker.com/outfit/edit/37509488620604883"
          target="_blank"
          class="text-red-400 text-sm"
          >Upload your logo!</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import factionImage from '~/filters/FactionImage'
import { PS2AlertsOutfitInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsOutfitInterface'

export default Vue.extend({
  name: 'ProfileLogos',
  components: {},
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
  data() {
    return {
      outfitLogoMissing: false,
    }
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
  methods: {
    outfitImageAlt(event: Event) {
      if (event.target) {
        ;(event.target as HTMLImageElement).src = factionImage(this.faction)
        this.outfitLogoMissing = true
      }
    },
  },
})
</script>
