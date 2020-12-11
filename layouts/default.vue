<template>
  <main data-app="true">
    <IntroSplash v-if="$config.environment === 'production'"></IntroSplash>
    <div v-if="$config.environment !== 'production'" class="font-sans lg:flex">
      <div id="panel-left" class="w-full">
        <client-only>
          <Header />
          <RealTimeMonitor />
          <LazyFooter class="hidden lg:block" />
        </client-only>
      </div>
      <div id="panel-right" class="w-full h-full px-4">
        <client-only>
          <Navigation />
          <Nuxt />
          <LazyFooter class="lg:hidden" />
        </client-only>
      </div>
    </div>
  </main>
</template>
