<template>
  <main data-app="true">
    <IntroSplash v-if="$config.environment === 'production'"></IntroSplash>
    <Maintenance v-if="$config.maintenance === true"></Maintenance>
    <div
      v-if="
        $config.environment !== 'production' && $config.maintenance === false
      "
      class="font-sans lg:flex"
    >
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
