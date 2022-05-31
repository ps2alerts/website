<template>
  <div class="grid grid-cols-12 gap-2">
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12 xl:col-span-10 xl:col-start-2">
      <div class="text-center h-full">
        <h1 class="text-title">Change Log</h1>
        <p class="mt-1">Last updated: 31st May 2022</p>
        <v-expansion-panels
          v-model="panel"
          accordion
          class="theme--dark mt-4"
          multiple
        >
          <v-expansion-panel v-for="post in posts" :key="post.id">
            <div v-if="post.type === 'feature'" class="tag m-0 feature">
              <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
              New feature
            </div>
            <div
              v-if="post.type === 'announcement'"
              class="tag m-0 announcement"
            >
              <font-awesome-icon
                :icon="['fas', 'bullhorn']"
              ></font-awesome-icon>
              Announcement
            </div>
            <div
              v-if="post.type === 'major-update'"
              class="tag m-0 announcement"
            >
              <font-awesome-icon :icon="['fas', 'star']"></font-awesome-icon>
              Major Update
            </div>
            <div
              v-if="post.type === 'minor-update'"
              class="tag m-0 enhancement"
            >
              <font-awesome-icon :icon="['fas', 'wrench']"></font-awesome-icon>
              Minor Update
            </div>
            <v-expansion-panel-header>
              <div>
                <h1 class="text-xl mb-2 font-bold" v-html="post.title"></h1>
                <p>{{ post.date }}</p>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="editorial text-left">
              <div class="mt-4" v-html="post.body"></div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
      version: this.$config.version,
      panel: [0],
      posts: [
        {
          id: 10,
          title: `v4.1.0 - Alert mapping, Victory Timeline & Alert History improvements`,
          date: '31st May 2022',
          type: 'major-update',
          body: `
           <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <h2 class="text-subtitle">Alert Maps &amp; timeline! <a href="https://www.youtube.com/watch?v=_J6-3l3hCm0" target="_blank" class="text-sm text-red-500">Hell, it's about time.</a></h2>
                <p>
                  For a long, long time the alert pages were sorely missing maps, which is a fundamental cornerstone of the alert metagame. Thanks to some <b>extraordinary</b> work by [UN17] RiderAnton from Connery, they are finally here.
                </p>
                <p>The Alert map should be a familiar experience to you. It should work and feel exactly like the in game map - Rider has taken an ungodly level of attention to detail to his work, including things like zoom levels, lattice links with proper coloring, hover-over facility names, properly showing cutoffs, zoom sounds, and lots more! It should feel like you were watching the alert from the map screen.</p>
                <p>Soon, there are going to be changes to the Capture History which will be showing a lot more detail about each individual capture. Stay tuned for more on that!</p>
                <video controls>
                    <source src="https://assets.ps2alerts.com/change-log/v4.1-map.mp4" type="video/mp4">
                </video>
                <p class="text-center text-sm">Example map of an alert (has sound)</p>
              </div>
              <div>
                <h2 class="text-subtitle">Date filtering improvements</h2>
                <img
                  class="mx-auto rounded-lg mb-4"
                  src="https://assets.ps2alerts.com/change-log/v4.1-date-filters.png"
                  alt="Date filters example"
                />
                <p>Date filters (seen on the Statistics / home page and the Alert History page) has received an improvement. We've now added a "Quick Filter" dropdown enabling you to pull in data from the following time references very quickly, without having to choose dates manually:</p>
                <ul>
                  <li>1 year</li>
                  <li>6 months (180d)</li>
                  <li>3 months (90d)</li>
                  <li>2 months (60d)</li>
                  <li>1 month (30d)</li>
                  <li>2 weeks</li>
                  <li>1 week</li>
                </ul>

                The above filters are used in the below features:
              </div>
              <div>
                <h2 class="text-subtitle">Victory Timeline improvements</h2>
                <p>There have been many, <b>many</b> alerts added since the site's creation back in January 2021. As a result, the victories graph was very cluttered, therefore it needed a good redesign. It has been changed in the following ways:</p>
                <ul>
                  <li>It is now possible to change data points to be on a Daily, Weekly, Monthly or Yearly basis. This makes the chart vastly more readable.</li>
                  <li>Hovering over a chart point now shows all metrics for that point in time, e.g. VS, NC, TR wins and Draws without having to hover each point individually.</li>
                  <li>As you "zoom in" on a particular date range using the new date filters, the time granularity will change to an appropriate level (e.g. you won't see days on a yearly basis - making it practically unreadable - you will see weekly stats.)</li>
                </ul>
                <video controls>
                    <source src="https://assets.ps2alerts.com/change-log/v4.1-victory-timeline.mp4" type="video/mp4">
                </video>
                 <p class="text-center text-sm">New Victory Timeline</p>
              </div>
              <div>
                <h2 class="text-subtitle">Alert History improvements</h2>
                <p>In tandem with the new Date Filters, we took another pass at the Alert History page. It has recieved the following improvements</p>
                <ul>
                  <li>"Load More" button has been added, which will enable you to parse through the alert history essentially infinately. You will be limited to 300 results at a time when using filters (100 without). There's also a handy "Go to top" button should you be lost in the depths of the results and want to re-filter.</li>
                  <li>"Ghost" elements have been added in to give the page that extra polish</li>
                </ul>

              <video controls>
                  <source src="https://assets.ps2alerts.com/change-log/v4.1-alert-history.mp4" type="video/mp4">
              </video>
              </div>`,
        },
        {
          id: 9,
          title: `v4.0.1 - v4.0.3 - ASP2 support, Alert Monitor improvements &amp; more`,
          date: '16th March 2022',
          type: 'minor-update',
          body: `
            <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <h2 class="text-subtitle">ASP2 Support added</h2>
                <p>
                  While ASP2 has been out for a while, it was just something
                  that slipped under the radar for the project. Thanks to the
                  <a
                    href="https://github.com/ps2alerts/website/pull/343"
                    target="_blank"
                    class="hyperlink"
                    >contributions</a
                  >
                  from [UN17] RiderAnton (Connery) for adding this! ASP2 is now
                  represented on the alert pages as a adjusted BR of a maximum
                  of 320 (120+200 - we can't know when a person ASPed so we
                  have to assume they went up to BR 120).
                </p>
              </div>
              <div>
                <h2 class="text-subtitle">Alert Monitor Improvements</h2>
                <p>
                  The alert monitor has had yet another facelift in the
                  following ways:
                </p>
                <ul class="mb-0">
                  <li>
                    Removed the arrow that redirected you to the alert page as
                    it was hard to click on mobile
                  </li>
                  <li>
                    Made the whole alert row a clickable link, with a
                    highlight effect on desktop to indicate it's clickable.
                  </li>
                  <li>
                    Removed the "hide tray" button when there were no alerts
                    running, was pointless to show it was it would have done
                    nothing
                  </li>
                  <li>
                    <a
                      href="https://discord.com/channels/708061542649954315/708082705115643954/950499151119003719"
                      target="_blank"
                      class="hyperlink"
                      >Thanks to Jotaro for the suggestion!</a
                    >
                  </li>
                </ul>
              </div>
              <div>
                <h2 class="text-subtitle">Navbar changes</h2>
                <p>
                  The navigation menu has been completely redesigned into being more flexible and consistent across different devices. It should scale across screens quite nicely even on mobile. Mobile devices have the ability to scroll / tap to the sides to see more items, whereas before it would just bunch up the "pills" which ate into the limited vertical height of the screen.
                </p>
              </div>
              <div>
                <h2 class="text-subtitle">Mobile navigation improvements</h2>
                <p>
                  One annoyance when navigating the site on mobile was the
                  fact that you'd select something in the navbar and it
                  appeared like nothing happened - this was due to content
                  being rendered further down the page than the user was
                  seeing. There's now a jump to the content added for any new
                  page load. This won't make any difference on desktop as you
                  can always see the loading content regardless.
                </p>
              </div>
              <div>
                <h2 class="text-subtitle">Change Log redesign</h2>
                <p>
                  I've never been right happy with how the changelog was
                  represented, it involved a <b>lot</b> of scrolling, it had
                  layout issues on various devices (e.g. content side by side
                  would just look... wrong as
                  <a
                    href="/change-log/old-changelog.png"
                    target="_blank"
                    class="hyperlink"
                    >one would be much bigger than the other</a
                  >). I've opted for a more accordion design which should
                  enable people to go back and see what they're interested in
                  and see how the project has evolved over time with relative ease.
                </p>
              </div>
            </div>`,
        },
        {
          id: 8,
          title: `PS2Alerts 4.0 has finally arrived!`,
          date: '2nd March 2022',
          type: 'major-update',
          body: `
          <div class="grid grid-cols-12 gap-2 editorial">
            <div class="col-span-12 text-left">
              <p>
                Long time no see! Since the project has been running a long
                time, 95% stable (there's occasionally some alerts missing
                due to Census giving us crap responses resulting in errors),
                I've decided that PS2Alerts is coming out of it's Beta phase
                and
                <b>officially releasing as v4.0!</b>
              </p>
              <p>
                PS2Alerts has undergone some changes, listed below. The
                project is now out of mothballs (2021 was a rough year) and
                you should continue to expect new things coming for the site
                soon, namely things like Maps, Per-Player and Per-Outfit
                searchable statistics within the alert meta as a whole, and
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
                  Alert Capture History has been added! Recording as of Feb
                  5th 17:34 BST. Maps are coming hopefully fairly soon!
                </li>
                <li>
                  Battle ranks are now a stacked graph rather than separate
                  tiny lines no-one could read
                </li>
                <li>
                  Added per-base worth for each alert as of Feb 5th 17:34
                  BST (you can find this above the territory bar)
                </li>
              </ul>
              <h2 class="text-subtitle">Other changes</h2>
              <ul>
                <li>
                  <a href="/alert-history" class="text-red-500"
                    >Alert History</a
                  >
                  results has had a redesign, resulting in a lot more
                  compact design, especially on mobile.
                </li>
                <li>
                  Alert Monitor (to the left side) has been re-worked, now
                  showing populations for each alert rather than being
                  hidden behind a button press, as well as various layout
                  fixes.
                </li>
                <li>
                  Alert Monitor is now able to be collapsed / hidden on
                  mobile if it's taking too much space.
                </li>
                <li>
                  Stats (home page): Server Activity Level Victories and
                  Server Continent Victories have had a redesign pass,
                  resulting in a vastly better display on mobile and
                  desktop.
                </li>
                <li>
                  Navigation bar has been redesigned from a pill format to a
                  bar format.
                </li>
                <li>
                  Some missing NSO vehicles (Dervish, Chimera) were added
                  into various parts of the site whereas previously they'd
                  show up as unknown vehicles
                </li>
                <li>
                  Various styling issues have been corrected and the site
                  has been updated to the latest technologies
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
          </div>`,
        },
        {
          id: 7,
          title: `Faction vs Faction metrics`,
          date: '7th February 2021',
          type: 'feature',
          body: `
            <div class="text-center">
              <img
                class="object-contain mx-auto content-spacing rounded-lg"
                src="/change-log/factionvsfaction.png"
                alt="Picture showing faction vs faction example"
              />
            </div>
            <p>
              There is now a way to calculate how double teamed a faction is
              during an alert!
            </p>
            <p>It is calculated in the following ways:</p>
            <ul>
              <li>
                Kills made against a particular faction, added as a 1 point
              </li>
              <li>
                Bases captured against a faction, and applying 100 points to
                that (numbers may be adjusted)
              </li>
            </ul>
            <p>
              Combining the two will give a reasonable (not 100% accurate but
              close enough) view of the balance between factions in the alert,
              and to give an indicator on how balanced it was.
            </p>
            <p>
              In the example above, you can see TR was heavily double teamed
              by both VS and NC. It appears NC focused TR a bit more than VS,
              only due to their captures.
            </p>`,
        },
        {
          id: 6,
          title: `Statistics section has been released!`,
          date: '28th January 2021',
          type: 'feature',
          body: `
           <div class="text-center">
              <img
                class="object-contain mx-auto content-spacing rounded-lg"
                src="/change-log/statistics.png"
                alt="Picture showing faction vs faction example"
              />
            </div>
            <p>The first pass of the statistics section is now done!</p>
            <p>
              As you can see in the screenshot above, quite a lot of
              statistics types are shown which is filterable by Activity
              Level, Server and in some cases dates.
            </p>
            <p>This section will continue to get updates in the future!</p>`,
        },
        {
          id: 5,
          title: `PS4 servers are now officially supported!`,
          date: '23rd December 2020',
          type: 'announcement',
          body: `
           <div class="text-center">
              <img
                src="/change-log/ps4.jpg"
                alt="PS2Alerts Icon"
                class="inline-block my-2"
              />
            </div>
            <p>
              The PS4 servers are now supported! The PS2Alerts team want to
              support every player of Planetside in the great metagame that is
              the Alerts, so we welcome our PS4 brothers and sisters in
              battle!
            </p>
            <p>
              The PS4 statistics for now will be coupled in the same metagame
              as the PC version. Certain things however such as seasons or
              other events as part of the metagame may be split out between PC
              and PS4, however the statistics for now will remain the same.
            </p>`,
        },
        {
          id: 4,
          title: `PS2Alerts now in Alpha!`,
          date: '12th December 2020',
          type: 'announcement',
          body: `
            <div class="text-center">
              <img
                style="max-width: 300px"
                src="/img/alert-icon.png"
                alt="PS2Alerts Icon"
                class="inline-block"
              />
            </div>

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
            </ul>`,
        },
        {
          id: 3,
          title: `Alert Result Pages`,
          date: '12th December 2020',
          type: 'feature',
          body: `
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
            <p>This feature will be expanded in the Beta release of PS2Alerts!</p>`,
        },
        {
          id: 2,
          title: `Filterable Alert History`,
          date: '21st November 2020',
          type: 'feature',
          body: `
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
          </p>`,
        },
        {
          id: 1,
          title: `Real Time Monitor`,
          date: '8th November 2020',
          type: 'feature',
          body: `
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
            </p>`,
        },
      ],
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
  mounted() {
    localStorage.lastVersionSeen = this.version

    window.dispatchEvent(
      new CustomEvent('lastVersionSeenUpdated', {
        detail: {
          version: localStorage.getItem('lastVersionSeen'),
        },
      })
    )
  },
})
</script>
