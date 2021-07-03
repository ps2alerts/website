<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 2nd July 2021
    </div>
    <div>
      <h1 class="text-3xl mb-4 text-center">Alert Brackets are being incorrectly calculated</h1>
      <p>
        Currently Census (the game's API) does not include the faction that the NSO players are currently fighting for. Therefore, we are unable to accurately calculate the population levels for each faction as the NSO players can bounce between factions, making this inherently inaccurate. This didn't used to be be an issue before, as there was maybe 2% of players on NSO per alert, but as a result of the NSO update that is now more 20-30%.
      </p>
      <p>Alert Brackets use a fairness system where <b>all factions</b> need to field X amount of platoons in order to qualify for that bracket (to prevent factions from steamrolling alerts with high pop, or one faction being bullied due to low pop). Since we cannot reliability calculate NSO player's factions right now, the faction's pop cannot be fully accurately calculated.</p>
      <p>
        This will not be fixed until Census has been changed. I'm also not willing to "bodge" a fix using NSO pops by attempting to calculate who they are playing on as it is inherently inaccurate as Freelance NSO can bounce between factions at will, and it will consume a lot of my limited time even attempting it when the game should supply it. When the NSO hype dies down, this issue will naturally dissipate.
      </p>
      <p>
        - <b>Maelstrome26</b> - PS2Alerts Developer
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Announcement',
})
</script>

<style scoped lang="scss">
#splash-icon {
  max-height: 20vh;
}
</style>
