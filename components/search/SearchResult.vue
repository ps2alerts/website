<template>
  <div
    class="my-2 py-2 text-center cursor-pointer hover border"
    :class="classes"
  >
    <NuxtLink :to="link">
      <p class="m-0">{{ result.name }}</p>
      <p class="text-xs text-gray-400 font-semibold">
        {{ result.type | ucFirst }} | {{ result.world | worldName }}
      </p></NuxtLink
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FactionBgClassString } from '~/constants/FactionBgClass'
import { FactionBorderClassString } from '~/constants/FactionBorderClass'
import {
  SearchCharacterInterface,
  SearchOutfitInterface,
} from '~/ps2alerts-constants/interfaces/PS2AlertsSearchResultInterface'
import { Faction } from '~/ps2alerts-constants/faction'

export default defineComponent({
  name: 'SearchResult',
  props: {
    result: {
      type: Object as () => SearchCharacterInterface | SearchOutfitInterface,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    characterResult(): SearchCharacterInterface | undefined {
      return this.result.type === 'player'
        ? (this.result as SearchCharacterInterface)
        : undefined
    },
    outfitResult(): SearchOutfitInterface | undefined {
      return this.result.type === 'outfit'
        ? (this.result as SearchOutfitInterface)
        : undefined
    },
    link(): string {
      if (this.characterResult) {
        return `/player/${this.characterResult.character.id}`
      }

      if (this.outfitResult) {
        return `/outfit/${this.outfitResult.outfit.id}`
      }

      throw new Error('Unexpected result type')
    },
    classes(): string[] {
      const faction = this.result.faction

      return [
        FactionBgClassString(this.result.faction),
        faction !== Faction.NS_OPERATIVES
          ? FactionBorderClassString(this.result.faction)
          : 'border-gray-300',
      ]
    },
  },
})
</script>
