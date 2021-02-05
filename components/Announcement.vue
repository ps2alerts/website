<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <!--    <div class="tag announcement">-->
    <!--      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>-->
    <!--      Announcement - 6th Jan 2021-->
    <!--    </div>-->

    <div class="grid grid-cols-12 place-items-center">
      <div class="col-span-12">
        <h1 class="text-subtitle text-center">
          Welcome to PS2Alerts - Planetside 2's Alert Tracker
        </h1>
        <p class="text-center text-xl font-semibold">
          Hello everyone coming in from the PS2 launcher! If you're new here,
          below is a rundown of what this site does:
        </p>
        <p>
          The PS2Alerts stats system collects and presents player, outfit,
          weapons, vehicles, population, classes and facility data, both on a
          per-alert and global basis. The data is then filterable by Activity
          Levels
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                v-bind="attrs"
                v-on="on"
              ></font-awesome-icon>
            </template>
            Determined from average population counts for an alert, where all
            factions require X amount of platoons to qualify for the bracket.
            This ranges from Dead (&lt;1 Platoon) to Prime which is 4+ platoons
            on all factions. </v-tooltip
          >, Server, Date / Time etc below on this page.
        </p>
        <p>
          You're able to view your own statistics on a per-alert basis to see
          how well you faired against your fellow comrades and rivals. All the
          statistics are updated in near real time (depending on stat, usually
          10 secs) so you can track how well you're doing as the alert rages on!
          Searchable Per-player and per-outfit statistics will be coming in the
          coming weeks!
        </p>
        <p>
          Please note, the project is currently in <b>Beta</b>. It is not
          finished, so what you see today is not the finished product, it will
          be worked upon over time. Check out our
          <a
            href="https://github.com/ps2alerts"
            class="text-blue-600"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'github']" /> GitHub
          </a>
          for more information on what's coming.
        </p>
        <p>
          Feel free to join us on
          <a
            href="https://discord.io/ps2alerts"
            class="text-blue-600"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'discord']" /> Discord
          </a>
          to nerd out on the Alert Meta, talk with the project's devs and alert
          notifications. If you really like what you see here and feel like
          helping out, I'm looking to cover server / monitoring costs over on
          <a
            href="https://www.patreon.com/PS2Alerts"
            class="text-blue-600"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'patreon']" /> Patreon </a
          >.
        </p>
      </div>
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
