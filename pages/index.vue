<template>
  <div class="grid grid-cols-12 gap-2">
    <div
      class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative mt-4"
    >
      <div class="tag announcement">
        <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
        Announcement
      </div>

      <div class="grid grid-cols-12 place-items-center">
        <div class="col-span-12 ss:col-span-4">
          <div class="p-6 text-center items-center justify-items-center">
            <img
              id="splash-icon"
              src="../assets/img/alert-icon.png"
              alt="PS2Alerts Icon"
              class="inline-block"
            />
          </div>
          <h1 class="text-subtitle text-center">PS2Alerts now in Alpha!</h1>
        </div>
        <div class="col-span-12 ss:col-span-8">
          <p>
            PS2Alerts is now in Alpha stage! The basic minimum viable product of
            the tracker is now a reality, featuring the following:
          </p>
          <ul>
            <li>
              <b>Real time alert tracking</b>, with an active alert log to the
              left (or top on mobile) allowing you see at a glance all the
              alerts going on in PS2 (for PC only right now).
            </li>
            <li>
              <b>Historical Alert search</b>, enabling you to go back in time
              and revisit or share an alert to your fellow planetmans. It is
              also filterable, allowing you to see alerts on Indar during
              Primetime for example.
            </li>
            <li>
              <b>Real time per-alert statistics</b>. It shows a plethora of
              information, including but won't be limited to:
              <ul>
                <li>
                  Alert details e.g. continent, time bracket, server, which
                  faction triggered it, etc.
                </li>
                <li>
                  Filterable and sortable per player, weapon, outfit and vehicle
                  combat statistics.
                </li>
              </ul>
            </li>
          </ul>
          <p class="text-center">
            Please note -
            <b>all data is going to be wiped Jan 1st 2021!</b> This is when
            PS2Alerts will launch.
          </p>
        </div>
      </div>
      <div class="col-span-12 text-center">
        <nuxt-link to="/alert-history" class="btn">Latest Alerts</nuxt-link>
        <nuxt-link to="/change-log" class="btn">View the change log</nuxt-link>
      </div>
    </div>
    <div class="col-span-12">
      <div class="text-center">
        <h1 class="text-title">Alert Statistics</h1>
        <p>All data is currently subject to wipe!</p>
      </div>
    </div>
    <div class="col-span-12 bg-tint card text-center">
      <h1>Coming very soon!</h1>
      <p class="m-2">
        For now, visit the Alert History section to see a recent list of alerts.
      </p>
      <NuxtLink to="/alert-history" class="btn">Alert History</NuxtLink>
    </div>
    <!--    <div class="col-span-12 bg-tint card">-->
    <!--      <div class="text-center">-->
    <!--        <h1>Victory Statistics</h1>-->
    <!--        <p>TO BE FINISHED!</p>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div class="col-span-12 bg-tint card">-->
    <!--      <div class="text-center">-->
    <!--        <h1>Combat Statistics</h1>-->
    <!--        <p>TO BE FINISHED!</p>-->
    <!--      </div>-->
    <!--      <div class="flex justify-center content-center flex-wrap">-->
    <!--        <div class="flex-1 metric-card text-center">-->
    <!--          <h2 class="text-3xl">Totals</h2>-->
    <!--          <table class="table-auto border-collapse mx-auto text-sm lg:text-lg">-->
    <!--            <thead>-->
    <!--              <tr>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Server-->
    <!--                </td>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Kills-->
    <!--                </td>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Deaths-->
    <!--                </td>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Teamkills-->
    <!--                </td>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Suicides-->
    <!--                </td>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Headshots-->
    <!--                </td>-->
    <!--              </tr>-->
    <!--            </thead>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">All Servers</td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Cobalt</td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Connery</td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Emerald</td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Miller</td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Soltech</td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">-->
    <!--                123456789<br />-->
    <!--                <span class="text-vs">12345</span><br />-->
    <!--                <span class="text-nc">12345</span><br />-->
    <!--                <span class="text-tr">12345</span><br />-->
    <!--                <span class="text-nso">12345</span>-->
    <!--              </td>-->
    <!--            </tr>-->
    <!--          </table>-->
    <!--        </div>-->
    <!--        <div class="flex-1 metric-card text-center">-->
    <!--          <h2 class="text-3xl">Kills</h2>-->
    <!--          <table class="table-auto border-collapse mx-auto text-sm lg:text-lg">-->
    <!--            <thead>-->
    <!--              <tr>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Server-->
    <!--                </td>-->
    <!--                <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  VS-->
    <!--                </td>-->
    <!--                <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NC-->
    <!--                </td>-->
    <!--                <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  TR-->
    <!--                </td>-->
    <!--                <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NSO-->
    <!--                </td>-->
    <!--              </tr>-->
    <!--            </thead>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">All Servers</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">1234567</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Cobalt</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Connery</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Emerald</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Miller</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Soltech</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--          </table>-->
    <!--        </div>-->
    <!--        <div class="flex-1 metric-card text-center">-->
    <!--          <h2 class="text-3xl">Deaths</h2>-->
    <!--          <table class="table-auto border-collapse mx-auto text-sm lg:text-lg">-->
    <!--            <thead>-->
    <!--              <tr>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Server-->
    <!--                </td>-->
    <!--                <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  VS-->
    <!--                </td>-->
    <!--                <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NC-->
    <!--                </td>-->
    <!--                <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  TR-->
    <!--                </td>-->
    <!--                <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NSO-->
    <!--                </td>-->
    <!--              </tr>-->
    <!--            </thead>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">All Servers</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">1234567</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Cobalt</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Connery</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Emerald</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Miller</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Soltech</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--          </table>-->
    <!--        </div>-->
    <!--        <div class="flex-1 metric-card text-center">-->
    <!--          <h2 class="text-3xl">Suicides</h2>-->
    <!--          <table class="table-auto border-collapse mx-auto text-sm lg:text-lg">-->
    <!--            <thead>-->
    <!--              <tr>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Server-->
    <!--                </td>-->
    <!--                <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  VS-->
    <!--                </td>-->
    <!--                <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NC-->
    <!--                </td>-->
    <!--                <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  TR-->
    <!--                </td>-->
    <!--                <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NSO-->
    <!--                </td>-->
    <!--              </tr>-->
    <!--            </thead>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">All Servers</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">1234567</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Cobalt</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Connery</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Emerald</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Miller</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Soltech</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--          </table>-->
    <!--        </div>-->
    <!--        <div class="flex-1 metric-card text-center">-->
    <!--          <h2 class="text-3xl">Teamkills</h2>-->
    <!--          <table class="table-auto border-collapse mx-auto text-sm lg:text-lg">-->
    <!--            <thead>-->
    <!--              <tr>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Server-->
    <!--                </td>-->
    <!--                <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  VS-->
    <!--                </td>-->
    <!--                <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NC-->
    <!--                </td>-->
    <!--                <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  TR-->
    <!--                </td>-->
    <!--                <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NSO-->
    <!--                </td>-->
    <!--              </tr>-->
    <!--            </thead>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">All Servers</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">1234567</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Cobalt</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Connery</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Emerald</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Miller</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Soltech</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--          </table>-->
    <!--        </div>-->
    <!--        <div class="flex-1 metric-card text-center">-->
    <!--          <h2 class="text-3xl">Headshots</h2>-->
    <!--          <table class="table-auto border-collapse mx-auto text-sm lg:text-lg">-->
    <!--            <thead>-->
    <!--              <tr>-->
    <!--                <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  Server-->
    <!--                </td>-->
    <!--                <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  VS-->
    <!--                </td>-->
    <!--                <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NC-->
    <!--                </td>-->
    <!--                <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  TR-->
    <!--                </td>-->
    <!--                <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1 font-bold">-->
    <!--                  NSO-->
    <!--                </td>-->
    <!--              </tr>-->
    <!--            </thead>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">All Servers</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">123456789</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">1234567</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Cobalt</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Connery</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Emerald</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Miller</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--            <tr>-->
    <!--              <td class="px-1 sm:px-2 lg:px-4 py-0 lg:py-1">Soltech</td>-->
    <!--              <td class="vs px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nc px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="tr px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--              <td class="nso px-1 sm:px-2 lg:px-4 py-0 lg:py-1">12345</td>-->
    <!--            </tr>-->
    <!--          </table>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <hr class="my-4 mx-2" />-->
    <!--      <div class="flex justify-center content-center">-->
    <!--        <div class="flex-1 text-center">-->
    <!--          <h2 class="text-2xl">Server metrics</h2>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div class="col-span-12 bg-tint card">-->
    <!--      <div class="text-center">-->
    <!--        <h1>Combat Statistics</h1>-->
    <!--        <p>TO BE FINISHED!</p>-->
    <!--      </div>-->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Home',
})
</script>
