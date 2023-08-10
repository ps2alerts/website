<template>
  <div
    class="my-2 py-2 px-4 text-center cursor-pointer hover border relative"
    :class="classes"
    :score="result.matchScore"
  >
    <font-awesome-icon
      v-show="result.isPinned || isPinned"
      :icon="['fas', 'bookmark']"
      class="text-sm absolute top-1 right-1"
      @click="pinResult(false)"
    ></font-awesome-icon>
    <v-tooltip right>
      <template #activator="{ on, attrs }">
        <font-awesome-icon
          v-show="!result.isPinned && !isPinned"
          :icon="['far', 'bookmark']"
          class="text-sm absolute top-1 right-1"
          v-bind="attrs"
          @click="pinResult(true)"
          v-on="on"
        ></font-awesome-icon>
      </template>
      Pin this result so you can find your characters / outfits easily!
    </v-tooltip>
    <NuxtLink :to="link">
      <p class="m-0">
        <span v-if="result.tag" class="font-mono">[{{ result.tag }}]</span>
        {{ result.name }}
      </p>
      <p class="text-xs text-gray-400 font-semibold">
        {{ result.type | ucFirst }} | {{ result.world | worldName }}
      </p>
    </NuxtLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FactionBgClassString } from '~/constants/FactionBgClass'
import { FactionBorderClassString } from '~/constants/FactionBorderClass'
import {
  SearchCharacterInterface,
  SearchOutfitInterface,
  SearchResultComponentInterface,
} from '~/ps2alerts-constants/interfaces/PS2AlertsSearchResultInterface'
import { Faction } from '~/ps2alerts-constants/faction'

export default defineComponent({
  name: 'SearchResult',
  props: {
    result: {
      type: Object as () => SearchResultComponentInterface,
      default: () => {
        return {}
      },
    },
  },
  data: () => {
    return {
      isPinned: false,
    }
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
  methods: {
    pinResult(value: boolean): void {
      this.isPinned = value
      this.$emit('pinned', this.result)
    },
  },
})
</script>
