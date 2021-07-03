<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 2nd July 2021
    </div>
    <div>
      <h1 class="text-3xl mb-4 text-center">Prime Alerts are currently not recording correctly</h1>
      <p>
        Due to an Census (PS2 API) issue, we are unable to accurately determine the faction NSO players are playing for. Since the launch of the NSO update, this has majorly borked the population activity levels as we cannot identify factions for players. Pre-NSO update this wasn't an issue as there was maybe 20 players at a prime time alert, now there's around 300.
      </p>
      <p>
        This will not be fixed until Census has been changed. I'm also not willing to "bodge" a fix using NSO pops by attempting to calculate who they are playing on as it is inherently inaccurate. When the NSO hype dies down, this issue will naturally dissipate.
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
