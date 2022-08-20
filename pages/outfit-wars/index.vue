<template>
  <section
    id="outfitwars"
    ref="outfitwarsTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <img
        class="ps2alerts-logo m-auto"
        alt="PS2Alerts Logo"
        src="/img/outfitwars-logo.png"
      />
      <p class="text-title mb-1">
        <remaining-time :time-remaining="timeRemaining"></remaining-time>
      </p>
      <p class="text-sm mb-2">includes 20 min prep time</p>
      <h1 class="text-subtitle mt-4 mb-4">
        Outfit Wars 2022 statistics is coming!
      </h1>

      <p class="text-xl mb-2">
        PS2Alerts will bring <b>full</b> support of per-match and tournament
        wide statistics for Outfit Wars 2022!
      </p>
      <p class="mb-2 text-left">
        You will be able to look at the players, outfits, weapons etc on a
        global and per-server basis as you can with the normal alert metagame.
        Additionally, we will keep a track record of all match results along
        with their scores, so you don't need to go in-game to see them.
      </p>
      <p class="mb-2 text-left">
        Every single match will be recorded, including full support for Map
        Replay, combat histories and of course all the per-player and outfit
        metrics, where you can see how the battle over Nexus for the match went
        over time.
      </p>
      <p class="mb-2 text-left">
        Join us on our
        <a
          class="text-red-500"
          target="_blank"
          href="https://discord.gg/abXGXHnE"
          >Discord Server</a
        >
        to receive the latest announcements about PS2Alerts and the overall
        Outfitwars Metagame including announcements on when matchees start on
        each server!
      </p>
      <p class="text-xs mb-2">OW logo &copy; Daybreak Games</p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import MetaHead from '~/components/MetaHead.vue'
import TimeRemainingFromDuration from '~/utilities/timeRemainingFromDuration'

export default Vue.extend({
  name: 'OutfitWars',
  components: {
    MetaHead,
  },
  data() {
    return {
      pageTitle: 'Outfit Wars',
      pageDesc: 'Your source for all Outfitwars 2022 Statistics',
      now: parseInt(moment().tz('UTC').format('X'), 10),
      end: parseInt(moment.tz('2022-09-03 18:20:00', 'UTC').format('X'), 10),
      timeRemaining: 0,
    }
  },
  head(): object {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.pageDesc,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}/outfit-wars`,
        },
      ],
    }
  },
  created() {
    this.timeRemaining = TimeRemainingFromDuration(
      this.now,
      this.end - this.now
    )
  },
})
</script>
