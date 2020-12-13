<template>
  <div class="grid grid-cols-12 gap-2">
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <div class="text-center h-full">
        <h1 class="text-title">Change Log</h1>
        <p>Last updated: 12th Dec 2020</p>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 bg-tint card editorial relative">
      <div class="tag announcement">
        <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
        Announcement
      </div>
      <div class="h-full">
        <h1 class="text-subtitle text-center">PS2Alerts now in Alpha!</h1>
        <p class="content-spacing text-center">Added: 12th Dev 2020</p>
        <p>
          PS2Alerts is now in Alpha stage! The basic minimum viable product of
          the tracker is now a reality, featuring the following:
        </p>
        <ul>
          <li>
            Real time alert tracking, with an active alert log to the left (or
            top on mobile) allowing you see at a glance all the alerts going on
            in PS2 (for PC only right now)
          </li>
          <li>
            Historical Alert Searches, enabling you to go back in time (as of
            Jan 2021, which is the projects release date) and revisit or share
            an alert to your fellow planetmans. It is also filterable, allowing
            you to see alerts on Indar during Primetime for example.
          </li>
          <li>
            Real time updating of per-alert statistics. It shows a plethora of
            information, including but won't be limited to:
            <ul>
              <li>
                Alert details e.g. continent, time bracket, server, which
                faction triggered it, etc.
              </li>
              <li>
                Filterable and sortable per player, weapon, outfit and vehicle
                combat statistics
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 bg-tint card editorial relative">
      <div class="tag feature">
        <font-awesome-icon :icon="['fas', 'certificate']"></font-awesome-icon>
        New feature
      </div>
      <div class="h-full">
        <h1 class="text-subtitle text-center">Alert Result Pages</h1>
        <p class="content-spacing text-center">Added: 12th Dev 2020</p>
        <a href="/change-log/alert.jpg">
          <img
            class="object-contain mx-auto content-spacing rounded-lg"
            src="/change-log/alert.jpg"
            alt="Picture showing alert history example"
          />
        </a>
        <p>
          The first iteration of the Alert Result pages are finished! They
          provide the following statistics on a per-alert basis, updating the
          data frequently for in progress alerts:
        </p>
        <ul>
          <li>Alert territory % and winner</li>
          <li>
            Combat metrics for each faction inc NSO: kills, deaths, K/D,
            teamkills, suicides, headshots, HSR
          </li>
          <li>
            Time Bracket (Mornings = 23:00-11:59, Afternoons = 12:00-15:59,
            Prime = 16:00-22:59)
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <font-awesome-icon
                  :icon="['fas', 'info-circle']"
                  v-bind="attrs"
                  v-on="on"
                ></font-awesome-icon>
              </template>
              Determined from Alert start time
            </v-tooltip>
          </li>
          <li>
            Sortable and filterable per-player, outfit, weapon and vehicle
            statistics. For the first time in PS2Alerts, we have detailed
            Vehicle matrix tracking (which vehicle killed what other vehicles
            etc).
          </li>
        </ul>
        <p>This feature will be expanded in the Beta release of PS2Alerts!</p>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 bg-tint card editorial relative">
      <div class="tag feature">
        <font-awesome-icon :icon="['fas', 'certificate']"></font-awesome-icon>
        New feature
      </div>
      <div class="h-full">
        <h1 class="text-subtitle text-center">Filterable Alert History</h1>
        <p class="content-spacing text-center">Added: 21st Nov 2020</p>
        <a href="/change-log/alert-history.jpg">
          <img
            class="object-contain mx-auto content-spacing rounded-lg"
            src="/change-log/alert-history.jpg"
            alt="Picture showing alert history example"
          />
        </a>
        <p>
          Filterable Alert History is now available! This shows a list of alerts
          filtered down by a variety of options. This list continuously updates
          over time as alerts come in based off your criteria. You're able to
          select the below criteria:
        </p>
        <ul>
          <li>Server</li>
          <li>Continent</li>
          <li>
            Time Bracket (Mornings = 00:00-10:59, Afternoons = 11:00-15:59,
            Prime = 16:00-22:59)
          </li>
          <li>Victor</li>
          <li>Date &amp; Time Range</li>
        </ul>
        <p>
          Note this is currently not updated in real time (every 30 secs), and
          there's a known issue when the data is refreshed where it bounces you
          back to the top, that will be fixed in due course.
        </p>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 bg-tint card editorial relative">
      <div class="tag feature">
        <font-awesome-icon :icon="['fas', 'certificate']"></font-awesome-icon>
        New feature
      </div>
      <div class="h-full">
        <h1 class="text-subtitle text-center">Real Time Monitor</h1>
        <p class="content-spacing text-center">Added: 8th Nov 2020</p>
        <a href="/change-log/rtm.jpg">
          <img
            class="object-contain mx-auto content-spacing rounded-lg"
            src="/change-log/rtm.jpg"
            alt="Real Time Monitor example"
            height="322"
            width="441"
          />
        </a>
        <p>
          The Real Time Alert Monitor has returned! At the left of your screen
          (top if you're on mobile) you're now able to see a live list of
          alerts!
        </p>
        <p>
          You can use this to keep track on the alerts out of the game as well
          as fix a few niggles where PS2 doesn't properly show alerts in game.
          Additionally, you're able to see a to-the-minute population count on
          each alert's continent, enabling you to see if a fight is one sided or
          not.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Changelog',
  data() {
    return {
      pageTitle: 'Change Log',
      pageDesc: "See what's recently been released for PS2Alerts!",
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
          href: `${this.$config.baseUrl}/change-log`,
        },
      ],
    }
  },
})
</script>
