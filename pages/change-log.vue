<template>
  <div class="grid grid-cols-12 gap-2">
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <div class="text-center h-full">
        <h1 class="text-title">Change Log</h1>
        <p class="mt-1">Last updated: 2nd March 2022</p>
      </div>
    </div>
    <div class="col-span-12 bg-tint card editorial relative">
      <div class="tag announcement">
        <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
        Announcement, &amp; Fixes &amp; New Features
      </div>
      <div class="h-full text-center">
        <h1 class="text-subtitle">PS2Alerts 4.0 has finally arrived!</h1>
        <p class="content-spacing text-center">Added: 2nd March 2022</p>
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-12 text-left">
            <p>
              Long time no see! Since the project has been running a long time,
              95% stable (there's occasionally some alerts missing due to Census
              giving us crap responses resulting in errors), I've decided that
              PS2Alerts is coming out of it's Beta phase and
              <b>officially releasing as v4.0</b>!
            </p>
            <p>
              PS2Alerts has undergone some changes, listed below. The project is
              now out of mothballs (2021 was a rough year) and you should
              continue to expect new things coming for the site soon, namely
              things like Maps, Per-Player and Per-Outfit searchable statistics
              within the alert meta as a whole, and
              <a
                class="text-red-500"
                href="https://github.com/ps2alerts/website/issues"
                target="_blank"
                >various other things</a
              >.
            </p>
            <h2 class="text-subtitle">Alert Statistics Pages</h2>
            <ul>
              <li>
                Alert Capture History has been added! Recording as of Feb 5th
                17:34 BST. Maps are coming hopefully fairly soon!
              </li>
              <li>
                Battle ranks are now a stacked graph rather than separate tiny
                lines no-one could read
              </li>
              <li>
                Added per-base worth for each alert as of Feb 5th 17:34 BST (you
                can find this above the territory bar)
              </li>
            </ul>
            <h2 class="text-subtitle">Other changes</h2>
            <ul>
              <li>
                <a href="/alert-history" class="text-red-500">Alert History</a>
                results has had a redesign, resulting in a lot more compact
                design, especially on mobile.
              </li>
              <li>
                Alert Monitor (to the left side) has been re-worked, now showing
                populations for each alert rather than being hidden behind a
                button press, as well as various layout fixes.
              </li>
              <li>
                Alert Monitor is now able to be collapsed / hidden on mobile if
                it's taking too much space.
              </li>
              <li>
                Stats (home page): Server Activity Level Victories and Server
                Continent Victories have had a redesign pass, resulting in a
                vastly better display on mobile and desktop.
              </li>
              <li>
                Navigation bar has been redesigned from a pill format to a bar
                format.
              </li>
              <li>
                Some missing NSO vehicles (Dervish, Chimera) were added into
                various parts of the site whereas previously they'd show up as
                unknown vehicles
              </li>
              <li>
                Various styling issues have been corrected and the site has been
                updated to the latest technologies
              </li>
            </ul>
          </div>
          <div class="col-span-12 mb-2">
            <img
              class="w-72 mx-auto rounded-lg"
              src="/change-log/new-rtm.png"
              alt="Picture showing faction vs faction example"
            />
            <p class="text-gray-400 text-sm mt-1">
              New redesign of the Real Time Monitor
              <a
                href="/change-log/old-rtm.png"
                class="text-red-500"
                target="_blank"
                >old design</a
              >
            </p>
          </div>
          <div class="col-span-12 mb-2">
            <img
              class="object-contain mx-auto rounded-lg w-full"
              src="/change-log/new-alert-history.png"
              alt="Picture showing new alert history design"
            />
            <p class="text-gray-400 text-sm mt-1">
              New redesign of Alert History
              <a
                href="/change-log/old-alert-history.png"
                class="text-red-500"
                target="_blank"
                >old design</a
              >
            </p>
          </div>

          <div class="col-span-12 mb-2">
            <img
              class="object-contain mx-auto rounded-lg w-full"
              src="/change-log/capture-history.png"
              alt="Picture showing new capture history design"
            />
            <p class="text-gray-400 text-sm mt-1">
              Introduction of Capture History
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 bg-tint card editorial relative">
      <div class="tag feature">
        <font-awesome-icon :icon="['fas', 'certificate']"></font-awesome-icon>
        New feature
      </div>
      <div class="h-full">
        <div class="text-center">
          <img
            class="object-contain mx-auto content-spacing rounded-lg"
            src="/change-log/factionvsfaction.png"
            alt="Picture showing faction vs faction example"
          />
        </div>

        <h1 class="text-subtitle text-center">
          Faction vs Faction Alert metrics
        </h1>
        <p class="content-spacing text-center">Added: 7th Feb 2021</p>
        <p>
          There is now a way to calculate how double teamed a faction is during
          an alert!
        </p>
        <p>It is calculated in the following ways:</p>
        <ul>
          <li>Kills made against a particular faction, added as a 1 point</li>
          <li>
            Bases captured against a faction, and applying 100 points to that
            (numbers may be adjusted)
          </li>
        </ul>
        <p>
          Combining the two will give a reasonable (not 100% accurate but close
          enough) view of the balance between factions in the alert, and to give
          an indicator on how balanced it was.
        </p>
        <p>
          In the example above, you can see TR was heavily double teamed by both
          VS and NC. It appears NC focused TR a bit more than VS, only due to
          their captures.
        </p>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 bg-tint card editorial relative">
      <div class="tag feature">
        <font-awesome-icon :icon="['fas', 'certificate']"></font-awesome-icon>
        New feature
      </div>
      <div class="h-full">
        <div class="text-center">
          <img
            class="object-contain mx-auto content-spacing rounded-lg"
            src="/change-log/statistics.png"
            alt="Picture showing faction vs faction example"
          />
        </div>

        <h1 class="text-subtitle text-center">
          Statistics section has been released!
        </h1>
        <p class="content-spacing text-center">Added: 28th Jan 2021</p>
        <p>The first pass of the statistics section is now done!</p>
        <p>
          As you can see in the screenshot above, quite a lot of statistics
          types are shown which is filterable by Activity Level, Server and in
          some cases dates.
        </p>
        <p>This section will continue to get updates in the future!</p>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 bg-tint card editorial relative">
      <div class="tag announcement">
        <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
        Announcement
      </div>
      <div class="h-full">
        <div class="text-center">
          <img
            src="../assets/img/ps4.jpg"
            alt="PS2Alerts Icon"
            class="inline-block"
          />
        </div>

        <h1 class="text-subtitle text-center">
          PS2Alerts now supports the PS4!
        </h1>
        <p class="content-spacing text-center">Added: 23rd Dec 2020</p>
        <p>
          The PS4 servers are now supported! The PS2Alerts team want to support
          every player of planetside in the great metagame that is the Alerts,
          so we welcome our PS4 brothers and sisters in battle!
        </p>
        <p>
          The PS4 statistics for now will be coupled in the same metagame as the
          PC version. Certain things however such as seasons or other events as
          part of the metagame may be split out between PC and PS4, however the
          statistics for now will remain the same.
        </p>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 bg-tint card editorial relative">
      <div class="tag announcement">
        <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
        Announcement
      </div>
      <div class="h-full">
        <div class="text-center">
          <img
            style="max-width: 300px"
            src="../assets/img/alert-icon.png"
            alt="PS2Alerts Icon"
            class="inline-block"
          />
        </div>

        <h1 class="text-subtitle text-center">PS2Alerts now in Alpha!</h1>
        <p class="content-spacing text-center">Added: 12th Dec 2020</p>
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
              <li>Population history graph</li>
              <li>
                Filterable and sortable per player, weapon, outfit, vehicle and
                class combat statistics
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
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.baseUrl}/change-log`,
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
