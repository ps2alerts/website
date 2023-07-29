<template>
  <div
    class="my-2 py-2 text-center border-gray-500 cursor-pointer hover"
    :class="classes"
  >
    <p class="m-0">{{ formattedName }}</p>
    <p class="text-xs text-gray-400 font-semibold">
      {{ formattedType }} | {{ result.world | worldName }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FactionBgClassString } from '~/constants/FactionBgClass'
import { FactionBorderClassString } from '~/constants/FactionBorderClass'
import { PS2AlertsSearchResultInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsSearchResultInterface'
export default defineComponent({
  name: 'SearchResult',
  props: {
    result: {
      type: Object as () => PS2AlertsSearchResultInterface,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    formattedName(): string {
      if (this.result.type === 'player' && this.result.character) {
        if (this.result.character.outfit?.tag) {
          return `[${this.result.character.outfit.tag}] ${this.result.character.name}`
        }
        return this.result.character.name
      }

      if (this.result.type === 'outfit' && this.result.outfit) {
        if (this.result.outfit.tag) {
          return `[${this.result.outfit.tag}] ${this.result.outfit.name}`
        }
        return this.result.outfit.name
      }
      return 'UNKNOWN TYPE!'
    },
    formattedType(): string {
      if (!this.result.type) {
        console.error("Type wasn't sent in!")
        return 'ERROR!'
      }
      return (
        this.result.type.charAt(0).toUpperCase() + this.result.type.slice(1)
      )
    },
    classes(): string[] {
      return [
        FactionBorderClassString(this.result.faction),
        FactionBgClassString(this.result.faction),
      ]
    },
  },
})
</script>

<style scoped lang="scss"></style>
