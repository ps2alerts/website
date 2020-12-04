<template>
  <div class="font-sans flex">
    <div id="panel-left" class="w-full">
      <client-only>
        <Header />
        <RealTimeMonitor />
        <Footer class="hidden lg:block" />
      </client-only>
    </div>
    <div
      id="panel-right"
      class="w-full h-full px-4 grid grid-cols-2 lg:grid-cols-3 ss:grid-cols-4 gap-4"
    >
      <client-only>
        <Navigation />
      </client-only>
      <Nuxt />
    </div>
    <client-only>
      <Footer class="lg:hidden" />
    </client-only>
  </div>
</template>
