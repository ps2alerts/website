<template>
  <main data-app="true" class="default">
    <Maintenance v-if="$config.maintenance === true"></Maintenance>
    <div v-if="$config.maintenance === false" class="font-sans lg:flex">
      <div id="panel-left" class="w-full">
        <client-only>
          <Header />
          <Navigation class="block lg:hidden" />
          <RealTimeMonitor />
          <LazyFooter class="hidden lg:block" />
        </client-only>
      </div>
      <div id="panel-right" class="w-full h-full px-4">
        <client-only>
          <div
            v-if="
              $config.environment === 'staging' && $config.maintenance === false
            "
          >
            <div class="bg-orange-600 w-full p-4 mt-4 text-center rounded">
              <font-awesome-icon
                :icon="['fas', 'exclamation-triangle']"
              ></font-awesome-icon>
              You are viewing the testing / staging copy of PS2Alerts.
              <a href="https://ps2alerts.com" class="text-red-900">
                <b>Please visit the correct version!</b>
              </a>
              <font-awesome-icon
                :icon="['fas', 'exclamation-triangle']"
              ></font-awesome-icon>
            </div>
          </div>
          <div>
            <div class="bg-orange-600 w-full p-4 mt-4 text-center rounded">
              <font-awesome-icon
                :icon="['fas', 'exclamation-triangle']"
              ></font-awesome-icon>
              PS2Alerts is currently experiencing issues with it's database. The site will be inoperable for the time being.</b>
              <font-awesome-icon
                :icon="['fas', 'exclamation-triangle']"
              ></font-awesome-icon>
            </div>
          </div>
          <Navigation class="hidden lg:block" />
        </client-only>
        <client-only>
          <Nuxt />
          <LazyFooter class="lg:hidden" />
        </client-only>
      </div>
    </div>
  </main>
</template>
