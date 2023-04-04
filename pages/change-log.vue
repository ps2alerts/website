<template>
  <div class="grid grid-cols-12 gap-2">
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12 xl:col-span-10 xl:col-start-2">
      <div class="text-center h-full">
        <h1 class="text-title">Change Log</h1>
        <p class="mt-1">Last updated: {{ posts[0].date }}</p>
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
            <div v-if="post.type === 'wip'" class="tag m-0 wip">
              <font-awesome-icon :icon="['fas', 'wrench']"></font-awesome-icon>
              Upcoming Update / WIP
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
          id: 19,
          title: 'v4.4.0 - Capture the Conduit & PS2Alerts module updates',
          date: '3rd April 2023',
          type: 'major-update',
          body: `
             <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <p class="text-xl font-bold">Capture the Conduit support (Nov 2022)</p>
                <p>Thanks to [UN17] RiderAnton yet again for providing updates to the mapping technology PS2Alerts uses, the website fully supports Capture the Conduit base types as of 17th November 2022 (yes this change log is well overdue!)</p>
              </div>
              <div class="pt-3">
                <p class="text-xl font-bold">PS2Alerts module updates (April 2023)</p>
                <p>PS2Alerts is constructed out of various modules. They needed a bit of love and care before an upcoming remodelling of PS2Alerts and how it records data.</p>
                <p class="text-lg font-bold">Aggregator</p>
                <p>A <a class="text-red-500" target="_blank" href="https://github.com/ps2alerts/aggregator/releases/tag/v4.4.0">massive refactor</a> of the Aggregator (the module that calculates the statistics for Alerts) was conducted, including migrating from a very troublesome method of Inversion of Control class injection into a better form. It also marks the introduction of NestJS to the Aggregator, to match API in terms of how the modules are configured and set up and increasing our development abilities. Many thanks to <a href="https://github.com/microwavekonijn" target="_blank" class="text-red-500">[DIG] Microwavekonijn</a> for the bulk of the refactor!</p>

                <p class="text-lg font-bold">API</p>
                <p>The API module was brought up to date in a major way as many of it's dependencies were out of date. Most importantly the NestJS version was bumped from 7->9 and the TypeScript version 3->4 meaning we are able to make sure of more modern development processes.</p>

                <p class="text-lg font-bold">Website</p>
                <p>Additionally, the website module was brought up to date in terms of it's dependencies as well. Nothing functionally was changed.</p>
              </div>
            </div>
          `,
        },
        {
          id: 18,
          title: 'v4.3.4 - Various Outfit Wars cosmetic changes',
          date: '11th September 2022',
          type: 'minor-update',
          body: `
            <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <p>Various tweaks and polish have been applied to the site, making your experience better!</p>
                <p class="text-xl font-bold">Match pages</p>
                <ul>
                    <li>Added match durations to the match pages, this was a streamer requested feature.</li>
                    <li>Optimised the colours of the Team Info "versus" banner, where the winner is a lot more obvious.</li>
                </ul>
                <p class="text-xl font-bold">Rankings & Brackets page</p>
                <ul>
                    <li>Changed bracket view to be vertically scrolling rather than horizontal.</li>
                    <li>Bracket match entries are now always Red vs Blue, matching the territory bars. We've also added a strikethrough to the loser of matches to better highlight at a glance who won / lost.</li>
                    <li>Added better handling of upcoming matches. Every Sunday there's a period where we know what the lineups are, but we don't know the match times, which was previously showing a date in the past which was very confusing.</li>
                </ul>
                <p class="text-xl font-bold">Known issues</p>
                <p>We're tracking the following known issues:</p>
                <ul>
                    <li>Missing a total of 8 matches of data (4 on Cobalt and 4 on Miller). We are getting closer with our backfill tooling for these matches and will be the next focus.</li>
                    <li>Populations are still scuffed for any matches involving VS, or any same faction matches.</li>
                    <li>Mobile view for Team Info is still wonky (low priority considering 18% of traffic is mobile)</li>
                    <li>Occasionally people see the wrong version of the website due to caching issues. This is extraordinarily hard to fix. If you suspect you're on the wrong version, simply just hard refresh by pressing Shift + R or some other combination of it.</li>
                </ul>
              </div>
            </div>`,
        },
        {
          id: 17,
          title: 'v4.3.3 - Outfit Wars: SolTech added to rankings',
          date: '10th September 2022',
          type: 'minor-update',
          body: `
            <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <h1 class="text-3xl mb-4">SolTech rankings have been added!</h1>
                <p>The API developers are receiving partial data from SolTech, so we have chosen to add SolTech to the rankings assuming daybreak are working on restoring full data services to the server. You will now find the SolTech rankings on the rankings page. <b>However</b>, match statistics are not yet supported until DBG fully fix the issues.</p>
                <p>Additionally, rankings page now shows the qualifier cutoff, alongside some visual improvements to the ranking listing.</p>
              </div>
            </div>`,
        },
        {
          id: 16,
          title: 'v4.3.2 - Outfit Wars: Vehicle Combat Data reinstated & fixes',
          date: '10th September 2022',
          type: 'minor-update',
          body: `
            <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <p>More fixes have been released to support Outfit Wars and other parts of the site:</p>
                <ul>
                  <li>Vehicle statistics have been reinstated. This was disabled globally (OW and alerts) due to a bug introduced that increased processing lag by 14-40x, as we were querying for characters that didn't exist.</li>
                  <li>OW: Cobalt's rankings have been fixed. Thanks RPG!</li>
                  <li>OW: Population graphs have been improved and no longer show pops from normal continents and other matches. However, there are still certain scenarios where issues occur, and is still being looked into.</li>
                  <li>OW: XPM metrics are now working. This unfortunately won't be backdated.</li>
                  <li>OW: All teams now have logos thanks to some "diplomatic persistence"!</li>
                  <li>OW: Measures have been put in place to prevent wonky game data from messing with the rankings in a weird way. They should be quite accurate now.</li>
                </ul>
                <p>Below are the current known issues:</p>
                <ul>
                  <li>OW: Team info on match pages on mobile is super scuffed.</li>
                  <li>OW: Cobalt and Miller's matches on Friday 9th are missing statistics. We are working on tooling to backfill this data.</li>
                  <li>OW: Matches with VS teams and same faction matches make the population history graph go super weird.</li>
                  <li>OW: It's still quite confusing to understand when the rankings were last updated and when their next update is due. We'll be adding in a timer till next update soon.</li>
                </ul>
              </div>
            </div>`,
        },
        {
          id: 15,
          title: 'v4.3.1 - Outfit Wars: Bugfixes',
          date: '3rd September 2022',
          type: 'minor-update',
          body: `
            <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <p>A number of fixes have been released for the Outfit Wars section, as well as fixing some bugs in other areas of the website.</p>
                <ul>
                  <li>Brackets no longer display future rounds, we don't have crystal balls after all.</li>
                  <li>Bracket matches have been adjusted to properly show teams and how the outfits were assigned them. It also now shows properly the winner of the match, along with the faction they played as.</li>
                  <li>Rankings section has received some visual improvements, improving logo layouts and spacing.</li>
                  <li>Cobalt's scores have been adjusted manually due to a bug from DBG, however match counts are still incorrect.</li>
                  <li>Victory statistics on the home page for normal alerts were reporting no data.</li>
                </ul>
                <p>Below are the current known issues:</p>
                <ul>
                  <li>Cobalt wins / defeats are inaccurate, scores however are accurate.</li>
                  <li>XPM metrics are not working.</li>
                  <li>Some team assignment bugs were fixed, however there are still occasions outfits won't be assigned to the correct team. We're continuing to monitor.</li>
                  <li>Vehicle statistics are still not working, we're looking into this actively.</li>
                  <li>Population information for matches with numbers 2, 4, 6 and 8 in their identifiers (which is mostly first rounds) will report Indar, Hossin, Amerish and Esamir populations in addition to Nexus.</li>
                  <li>Nexus is reporting populations of matches that are the same match ID as them, across different servers.</li>
                  <li>Team info on match pages on mobile is super scuffed.</li>
                </ul>
              </div>
            </div>`,
        },
        {
          id: 14,
          title: `v4.3.0 - Outfit Wars support`,
          date: '2nd September 2022',
          type: 'major-update',
          body: `
            <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <div class="text-center mb-4">
                   <img
                      src="/img/outfitwars-nexus.png"
                      alt="Outfitwars Logo"
                      class="inline-block mx-a rounded-xl w-72"
                    />
                  <h2 class="text-subtitle">Outfit Wars support has arrived!</h2>
                  <p>Status: <span class="label amber">BETA / WIP</span></p>
                  <a href="/outfit-wars" class="btn btn-lg hover:bg-red-500">Visit the OW section!</a>
                </div>
                <p>
                    Welcome to Outfit Wars! In this release, PS2Alerts provides full support of statistics for Outfit Wars matches as well as the tournament overall. The section is split into 3, each providing different information about Outfit Wars.
                </p>
                <p>A massive shoutout must go to [UN17] RiderAnton for his huge contributions to this new set of features to PS2Alerts, without him the section would not be anywhere close as detailed nor possibly even working for OW release.</p>
                <h2 class="text-subtitle">Rankings & Brackets</h2>
                <p>The Rankings & Brackets page brings us an overview of the Outfit War in general, along with statistics on how many matches outfits have won / lost, and an estimation of their scorings and rank. You are able to click on the arrows for any outfit listed and view all of their matches.</p>
                <p>Additionally we have shown a breakdown of the brackets, with full history of who fought whom alongside the result and a link to the match statistics.</p>
                <h2 class="text-subtitle">Matches List</h2>
                <p>Fairly self-explanatory, this is where all the matches for each outfit war will be listed. You're able to filter by Outfit, Team Faction (e.g. search for when VS was on the red / blue team), round, phase (e.g. all matches in Qualifiers) etc.</p>
                <h2 class="text-subtitle">Statistics (WIP)</h2>
                <p>While not fully ready for launch just yet, the Statistics section will show the overall stats for outfit wars, alongside outfit, player, weapon and vehicle specific statistics on a tournament level, also broken down by server. This will be released early next week as there will be no statistics to show off yet!</p>
              </div>
            </div>`,
        },
        {
          id: 13,
          title: `v4.2.0 - Collect All Lost Messages (CALM) release`,
          date: '22nd July 2022',
          type: 'major-update',
          body: `
            <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <h2 class="text-subtitle">Collect All Lost Messages release - large stability improvements</h2>
                <p>Status: <span class="label green">Released</span></p>
                <p>
                    TL;DR: In this release we have massively improved stability for the project. For some time now Census (the game's API) has been in a very poor state, not providing data like it should. We've made some fundamental changes how data is collected in order to ensure alerts are not missed and everyone's kills are being recorded etc.
                </p>
                <p>
                    In terms of changes to the website itself not a lot will change as these changes were purely backend. However, what you should see is alerts should always be present on the site now, and your kill counts should be a LOT more accurate (there's still some edge cases not making it 100% yet). <a class="text-red-500" target="_blank" href="https://discord.gg/abXGXHnE">Please report any alerts not being logged by PS2A in our feedback section</a>.
                  </p>
                <p>
                    I'd like to thank everyone for their patience and most importantly understanding with the project and why the data has often been missing. The recent instability of Census has really affected a lot of community projects, we hope the DBG team will be able to address the issues we've presented to them two months ago with some haste.
                </p>

                <h2 class="text-subtitle">Technical details</h2>

                <p>Link to the <a class="text-red-500" href="https://github.com/ps2alerts/aggregator/pull/565/files">pull request for these changes</a>. Note, it is MEATY!</p>

                <h2 class="text-2xl mb-2">The major issues</h2>
                <p>For those interested in the more technical detail of the changes made, I'd like to explain what's changed. Up until very recently, the Aggregator module of the project which has the job of processing the Census data (such as kill events) via a singular websocket stream and spit out stats to hit our API which then stores the data. There were however the below major issues with the component:
                    <ul>
                        <li>The aggregator processed <b>ALL</b> messages coming in from Census, whether it needed to or not. This was in excess of about <b>500 messages a second</b>! This meant every Death, XP tick, base capture, vehicle destruction etc were all being processed, on every server. This resulted in many messages getting lost, including MetagameEvents (alerts) resulting in the whole alert not being recorded.</li>
                        <li>The aggregator would eventually "lock up", where it would just crawl to a halt. It was never fully understood why it did this, presumably due to message volume causing thread locks within NodeJS.</li>
                        <li>A major bug was discovered where the aggregator was not caching queries from Census properly (which holds things like Character data, char name, outfit etc). This was released prior to this release as a hotfix a week ago, the fix slashed processing times down by 83% even without the additional improvements in v4.2.0</li>
                        <li>Should the aggregator ever crash (and it has, many times), all messages where lost during the downtime.</li>
                        <li>Census itself is currently unstable when using singular connections, connections would outright just drop over time, including alert notifications.</li>
                    </ul>
                </p>

                <h2 class="text-2xl mb-2">How did we resolve them?</h2>
                <p>
                    These issues were mainly solved by using Message Queues using RabbitMQ, and the use of a new service called the <a class="text-red-500" href="https://github.com/ps2alerts/collector">ps2alerts-collector</a>. This is a bundled version of the <a  class="text-red-500" href="https://github.com/nanite-systems/stream-collector">Nanite Systems Collector project</a>, who's job is to handle all the connections to Census and forward those messages to RabbitMQ. This provides the following benefits:
                    <ul>
                        <li>The collector has a dedicated function to - as you've probably guessed by now - collect data from Census and forward it to RabbitMQ into a series of queues, and it does this role very well.</li>
                        <li>The aggregator now only processes messages where there's active alerts, rather than absorbing all the census messages. It opens up queues and uses a <a class="text-red-500" href="https://www.cloudamqp.com/blog/part4-rabbitmq-for-beginners-exchanges-routing-keys-bindings.html">RabbitMQ Topic Exchange</a> which the collector passes the messages using routing keys seperated out by world and event type, e.g. "10.Death.foo". Upon alert start the aggregator opens queues which filter by the world and event types and processes them.
                          <ul>
                            <li>e.g. A player dies, an event is emitted with key "10.Death.somerandomuuid"</li>
                            <li>A queue for the alert has been bound to the topic exchange filtering on "10.Death.*"</li>
                            <li>The message drops in the queue, and then is consumed by the Aggregator, processed, sent to the API then acknowledged.</li>
                          </ul>
                        </li>
                        <li>A huge benefit comes from using the <a class="text-red-500" href="https://github.com/nanite-systems/stream-manifold">Nanite Systems Manifold</a> system, which combines the connections of 3+ collectors and merges them, de-duplicates them, and then provides a "cleaner" data stream which should have very little missing data. It also has the responsibility of maintaining a healthy connection with Census, abstracting a lot of that away from PS2Alerts and simplifying a ton of code in the project. Massive shout-out to Microwavekonijn for his efforts on that project!</li>
                        <li>A nice side benefit of using queues if the aggregator ever crashes, no messages are lost, and it will resume processing when it's restarted.</li>
                        <li>An additional side benefit is because now message rates are all located within queues, we can better alert and report on whether we have lost connections to certain servers, which unfortunately often happens with Census.</li>
                    </ul>
                </p>
                <p>Amongst all the data collection fixes, there were also a ton of internal fixes made as well:
                    <ul>
                        <li>Territory calculations (which produce the alert result upon a facility capture) were improved. This fixed a series of edge cases with certain lattice combinations. The fix was basically to ensure a base has links between every base in a bidirectional manner, whereas before (and this is wonky data from census), each base only had a link in one direction.</li>
                        <li>Massive cleanup of the code base to make it a lot more expandable for the future, and we still plan on adding new processing of events e.g. revives, Player Facility Capture stuff etc.</li>
                    </ul>
                </p>
                <p>If you've got to the bottom of this very detailed technical change log, thank you for your interest! If you're interested in working on the PS2Alerts project, please <a class="text-red-500" href="https://discord.io/ps2alerts">join us on Discord</a> and introduce yourself!</p>
              </div>
            </div>`,
        },
        {
          id: 12,
          title: `v4.2.0-alpha-1 - XPM / XPM-PP Metrics`,
          date: '14th July 2022',
          type: 'minor-update',
          body: `
            <div class="grid grid-cols-1 divide-y gap-y-3 divide-gray-400">
              <div>
                <h2 class="text-subtitle">XPM &amp; XPM-PP Metrics</h2>
                <p>Status: <span class="label green">Released</span></p>
                <p>XPM (X statistic Per Minute) and XPM-PP (X statistic Per Minute - Per Player) metrics are here! Now on alert pages you are able to see your Kills, Deaths, Headshots, Teamkills (kek) and Suicides per minute. In addition, you are also able to see your Time Played during the alert as well. XPM metrics are calculated based off your time in the alert, so if you are late to the party you won't have a super low XPM metrics, you'll be on the same level playing field as someone who started at the very beginning of the alert, in order to remain competitive.</p>
                <p>For outfits, there is also an expansion to this to show said metrics on a per-participant level. In addition, new "X-PP" metrics are present as well.</p>
                <p>Thanks to DobBole69 for reporting the <a class="text-red-500" href="https://github.com/ps2alerts/website/issues/427">feature on GitHub!</a></p>
              </div>
              <div class="mt-6 mb-2 pt-6">
                <h1>Edit: The below features have been pushed back to the v4.3.0 release!</h1>
              </div>
              <div>
                <h2 class="text-xl">Player &amp; Outfit Facility Capture / Defences participation stats</h2>
                <p>Status: <span class="label red">Delayed until v4.4</span></p>
                <p>With this update, we will bring an expansion to the Capture History system where each capture will show all players (and thus, outfits) present at the Capture / Defense of a base, along with rough population calculations. <b>Note</b>, there is a heavy caveat here that the data we receive is literally a snapshot of the base at the time, e.g. if some people have left the base ahead of the capture / defence of said base, they will not be registered.</p>
                <p>In addition to showing the players on the Capture History, the facilities the player has been involved capturing will show up on the player's entry in the Player section. Outfits will also have their bases they were involved in capturing listed under their row in the Outfit section on each alert as well, along with the percentage of players present both on a same-faction and all outfits level.</p>
                <p>Full list of additions can be see on the <a href="https://github.com/ps2alerts/website/issues/418" class="text-red-500">GitHub feature request.</a></p>
                <!--<ul>
                  <li>Faction Combat Metrics - Bases captured &amp; defended by faction, seperated by base size</li>
                  <li><b>Players</b></li>
                    <ul>
                      <li>Helped capture / defend counts for the player</li>
                      <li>Faction capture / defense participation (# of total faction captures / player involved captures / defences)</li>
                      <li>Alert-wide Capture / Defense participation(# of total alert captures (any faction) / player involved captures / defences)</li>
                    </ul>
                  </li>
                </ul>-->
              </div>
              <div>
                <h2 class="text-xl">Alert timer de-sync bugfix</h2>
                <p>Status: <span class="label">Not started</span></p>
                <p>There is currently a very annoying bug where if you are alt tabbed from your browser, certain optimisations browsers perform is to stop "timers" from working occurring in the background, which results in timers getting de-synced, requiring a page refresh to fix. In this update we will add in a re-sync mechanism using when you're looking at the page to trigger a timer refresh.</p>
           </div>`,
        },
        {
          id: 11,
          title: `v4.1.1 - Leaderboard fixes`,
          date: '2nd June 2022',
          type: 'minor-update',
          body: `
            <div>
              <p>There was a bug when you searched for certain high kill items in the player leaderboard and outfit leaderboards pulling in duplicate records. Each player and outfit has separate records, split out by the Activity Level. There was a bug where it was pulling in all activity levels when there wasn't one selected, now it only pulls in totals or any selected activity level.</p>
              <p>Thanks to [NEXO] lly1 / lly1bot for reporting the bug!</p>
            </div>`,
        },
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
