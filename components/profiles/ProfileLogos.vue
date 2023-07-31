<template>
  <div class="col-span-12 lg:col-span-4 lg:col-start-5">
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
        <NuxtLink :to="outfitLink" :disabled="!isInOutfit">
          <img
            v-if="outfit.id"
            :alt="faction | factionShortName"
            :src="outfit.id | outfitImage"
            class="mx-auto mb-2 w-full"
            @error="outfitImageAlt"
          />
        </NuxtLink>
        <div class="text-center">
          <NuxtLink :to="outfitLink" :disabled="!isInOutfit">
            <span class="font-bold">
              <span v-if="outfit.tag" class="font-mono mr-1"
                >[{{ outfit.tag }}]</span
              >{{ outfit.name }}</span
            ><br />
            <span class="text-sm label gray mr-2">Outfit</span
            ><span v-if="isInOutfit" class="label default"
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
  },
  data() {
    return {
      outfitLogoMissing: false,
    }
  },
  computed: {
    isInOutfit(): boolean {
      console.log(parseInt(this.outfit.id, 10))
      return parseInt(this.outfit.id, 10) > 4
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
