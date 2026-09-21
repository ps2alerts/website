<template>
  <div class="flex justify-center items-start gap-8 mb-2">
    <div class="logo-block">
      <img
        alt="Server Logo"
        :src="world | worldImage"
        class="mx-auto mb-2 logo-image"
      />
      <b class="whitespace-nowrap">{{ world | worldName }}</b
      ><br />
      <span class="text-sm label gray">Server</span>
    </div>
    <div class="logo-block">
      <img
        alt="Faction Logo"
        :src="faction | factionImage"
        class="mx-auto mb-2 logo-image"
      />
      <b class="whitespace-nowrap" :class="faction | factionTextClass">{{
        faction | factionName
      }}</b
      ><br />
      <span class="text-sm label gray">Faction</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// Server and faction badges under a profile title
export default Vue.extend({
  name: 'ProfileLogos',
  props: {
    faction: {
      type: Number,
      required: true,
    },
    world: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style scoped lang="scss">
.logo-block {
  @apply text-center;
  min-width: 10rem;
}
.logo-image {
  height: 6rem;
  width: auto;
}
</style>
